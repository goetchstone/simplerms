// server/trpc/routers/scheduling.ts
import "server-only";

import { createTRPCRouter, protectedProcedure, staffProcedure, publicProcedure, adminProcedure } from "@/server/trpc/trpc";
import { rateLimit } from "@/server/rate-limit";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { addMinutes, startOfDay, endOfDay } from "date-fns";

const appointmentStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"]);

// Build a UTC Date from a local time string ("HH:MM") in a given IANA timezone on a specific date.
// E.g. toUTCDate(someDate, "09:00", "America/New_York") → the UTC instant when it's 9 AM Eastern.
function toUTCDate(date: Date, timeStr: string, timezone: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  // Format the target date in the target timezone to get the year/month/day there.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")!.value);
  const month = Number(parts.find((p) => p.type === "month")!.value);
  const day = Number(parts.find((p) => p.type === "day")!.value);

  // Create a UTC date string and parse it, then find the offset by comparing
  // with what the timezone thinks the time is.
  const utcGuess = new Date(Date.UTC(year, month - 1, day, h, m, 0, 0));
  const inTZ = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(utcGuess);
  const [tzH, tzM] = inTZ.split(":").map(Number);
  const offsetMinutes = (tzH * 60 + tzM) - (h * 60 + m);
  return new Date(utcGuess.getTime() - offsetMinutes * 60000);
}

export const schedulingRouter = createTRPCRouter({
  // ── Services ─────────────────────────────────────────────────────────────

  listServices: publicProcedure
    .input(z.object({ publicOnly: z.boolean().default(true) }))
    .query(({ ctx, input }) =>
      ctx.db.service.findMany({
        where: {
          isActive: true,
          ...(input.publicOnly && { isPublic: true }),
        },
        orderBy: { name: "asc" },
      })
    ),

  serviceBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.service.findUnique({
        where: { slug: input, isActive: true },
        include: { availability: true },
      });
      if (!service) throw new TRPCError({ code: "NOT_FOUND" });
      return service;
    }),

  createService: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().max(2000).optional().nullable(),
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
        duration: z.number().int().min(5).max(480),
        bufferAfter: z.number().int().min(0).max(120).default(0),
        price: z.number().min(0).optional().nullable(),
        isPublic: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const service = await ctx.db.service.create({ data: input });
      return {
        ...service,
        _audit: { action: "scheduling.service.create", entityType: "Service", entityId: service.id },
      };
    }),

  // ── Availability ─────────────────────────────────────────────────────────

  setAvailability: staffProcedure
    .input(
      z.object({
        serviceId: z.string().cuid().optional(),
        slots: z.array(
          z.object({
            dayOfWeek: z.number().int().min(0).max(6),
            startTime: z.string().regex(/^\d{2}:\d{2}$/),
            endTime: z.string().regex(/^\d{2}:\d{2}$/),
            timezone: z.string().default("America/New_York"),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Replace all availability for this user+service combination atomically.
      await ctx.db.$transaction([
        ctx.db.staffAvailability.deleteMany({
          where: { userId, serviceId: input.serviceId ?? null },
        }),
        ctx.db.staffAvailability.createMany({
          data: input.slots.map((s) => ({ ...s, userId, serviceId: input.serviceId ?? null })),
        }),
      ]);

      return { ok: true };
    }),

  // ── Available slots (public) ──────────────────────────────────────────────

  availableSlots: publicProcedure
    .input(
      z.object({
        serviceId: z.string().cuid(),
        date: z.coerce.date(),
        staffId: z.string().cuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { serviceId, date, staffId } = input;

      const service = await ctx.db.service.findUniqueOrThrow({
        where: { id: serviceId },
      });

      const dayOfWeek = date.getDay();

      const availability = await ctx.db.staffAvailability.findMany({
        where: {
          dayOfWeek,
          ...(staffId ? { userId: staffId } : {}),
          OR: [{ serviceId }, { serviceId: null }],
        },
      });

      // Existing appointments that day.
      const booked = await ctx.db.appointment.findMany({
        where: {
          serviceId,
          startsAt: { gte: startOfDay(date), lte: endOfDay(date) },
          status: { notIn: ["CANCELLED"] },
          ...(staffId ? { staffId } : {}),
        },
        select: { startsAt: true, endsAt: true },
      });

      // Calendar blocks that day.
      const blocked = staffId
        ? await ctx.db.calendarBlock.findMany({
            where: {
              userId: staffId,
              startsAt: { gte: startOfDay(date), lte: endOfDay(date) },
            },
            select: { startsAt: true, endsAt: true },
          })
        : [];

      const slots: { startsAt: Date; endsAt: Date }[] = [];

      for (const avail of availability) {
        const tz = avail.timezone || "America/New_York";
        const windowStart = toUTCDate(date, avail.startTime, tz);
        const windowEnd = toUTCDate(date, avail.endTime, tz);

        let cursor = windowStart;
        while (cursor < windowEnd) {
          const slotEnd = addMinutes(cursor, service.duration);
          if (slotEnd > windowEnd) break;

          const conflict =
            booked.some((b) => cursor < b.endsAt && slotEnd > b.startsAt) ||
            blocked.some((b) => cursor < b.endsAt && slotEnd > b.startsAt);

          if (!conflict) slots.push({ startsAt: new Date(cursor), endsAt: slotEnd });

          cursor = addMinutes(cursor, service.duration + service.bufferAfter);
        }
      }

      return slots;
    }),

  // ── Book (public, no login) ───────────────────────────────────────────────

  book: publicProcedure
    .input(
      z.object({
        serviceId: z.string().cuid(),
        staffId: z.string().cuid().optional(),
        startsAt: z.coerce.date(),
        bookerName: z.string().min(1).max(255),
        bookerEmail: z.string().email(),
        bookerPhone: z.string().max(50).optional().nullable(),
        notes: z.string().max(2000).optional().nullable(),
        timezone: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limit: 10 bookings per IP per hour.
      const ip = ctx.headers.get("x-forwarded-for") ?? ctx.headers.get("x-real-ip") ?? "unknown";
      const { allowed } = rateLimit(`book:${ip}`, 10, 3600000);
      if (!allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many booking attempts. Please try again later." });

      const service = await ctx.db.service.findUniqueOrThrow({
        where: { id: input.serviceId, isActive: true },
      });

      const endsAt = addMinutes(input.startsAt, service.duration);

      // Conflict check — run inside transaction to prevent double-booking.
      const appointment = await ctx.db.$transaction(async (tx) => {
        const conflict = await tx.appointment.findFirst({
          where: {
            serviceId: input.serviceId,
            status: { notIn: ["CANCELLED"] },
            startsAt: { lt: endsAt },
            endsAt: { gt: input.startsAt },
            ...(input.staffId && { staffId: input.staffId }),
          },
        });

        if (conflict) throw new TRPCError({ code: "CONFLICT", message: "This slot is no longer available" });

        return tx.appointment.create({
          data: {
            serviceId: input.serviceId,
            staffId: input.staffId ?? null,
            bookerName: input.bookerName,
            bookerEmail: input.bookerEmail,
            bookerPhone: input.bookerPhone ?? null,
            notes: input.notes ?? null,
            startsAt: input.startsAt,
            endsAt,
            timezone: input.timezone,
            status: "CONFIRMED",
          },
        });
      });

      return {
        publicToken: appointment.publicToken,
        cancelToken: appointment.cancelToken,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
      };
    }),

  // Public cancel by token — no login required.
  cancel: publicProcedure
    .input(z.object({ cancelToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.findUnique({
        where: { cancelToken: input.cancelToken },
      });

      if (!appointment) throw new TRPCError({ code: "NOT_FOUND" });
      if (appointment.status === "CANCELLED") throw new TRPCError({ code: "BAD_REQUEST", message: "Already cancelled" });
      if (appointment.startsAt < new Date()) throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel a past appointment" });

      await ctx.db.appointment.update({
        where: { id: appointment.id },
        data: { status: "CANCELLED" },
      });

      return { ok: true };
    }),

  listAppointments: protectedProcedure
    .input(
      z.object({
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
        staffId: z.string().cuid().optional(),
        status: appointmentStatusEnum.optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { from, to, staffId, status, page, limit } = input;
      const where = {
        ...(from && { startsAt: { gte: from } }),
        ...(to && { startsAt: { lte: to } }),
        ...(staffId && { staffId }),
        ...(status && { status }),
      };

      const [items, total] = await Promise.all([
        ctx.db.appointment.findMany({
          where,
          orderBy: { startsAt: "asc" },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            service: { select: { name: true, duration: true } },
            staff: { select: { id: true, name: true } },
            client: { select: { id: true, name: true } },
          },
        }),
        ctx.db.appointment.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),
});
