// server/trpc/routers/tickets.ts
import "server-only";

import { createTRPCRouter, protectedProcedure, staffProcedure, publicProcedure } from "@/server/trpc/trpc";
import { rateLimit } from "@/server/rate-limit";
import { sendEmail } from "@/server/email";
import { ticketConfirmationHtml, ticketConfirmationText, ticketReplyHtml, ticketReplyText } from "@/server/email/templates/ticket";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const createTicketSchema = z.object({
  submitterName: z.string().min(1).max(255),
  submitterEmail: z.string().email(),
  subject: z.string().min(1).max(500),
  body: z.string().min(1).max(10000),
  clientId: z.string().cuid().optional(),
});

const ticketStatusEnum = z.enum(["OPEN", "IN_PROGRESS", "WAITING_ON_CLIENT", "RESOLVED", "CLOSED"]);
const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const ticketsRouter = createTRPCRouter({
  // Public — no auth. Used by the /support intake form.
  submit: publicProcedure
    .input(createTicketSchema)
    .mutation(async ({ ctx, input }) => {
      // Rate limit: 5 tickets per IP per 15 minutes.
      const ip = ctx.headers.get("x-forwarded-for") ?? ctx.headers.get("x-real-ip") ?? "unknown";
      const { allowed } = rateLimit(`ticket:${ip}`, 5, 900000);
      if (!allowed) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many submissions. Please try again later." });

      // Atomic number generation to prevent race conditions.
      const ticket = await ctx.db.$transaction(async (tx) => {
        const count = await tx.ticket.count();
        const ticketNumber = `TKT-${String(count + 1).padStart(5, "0")}`;

        return tx.ticket.create({
          data: {
            ticketNumber,
            submitterName: input.submitterName,
            submitterEmail: input.submitterEmail,
            subject: input.subject,
            clientId: input.clientId ?? null,
            messages: {
              create: {
                senderName: input.submitterName,
                body: input.body,
                isInternal: false,
              },
            },
          },
        });
      });

      // Fire-and-forget confirmation email — don't block the response.
      const companyName = (await ctx.db.setting.findUnique({ where: { key: "company_name" } }))?.value ?? "Akritos";
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const trackUrl = `${baseUrl}/support/track?token=${ticket.publicToken}`;

      sendEmail({
        to: input.submitterEmail,
        subject: `[${ticket.ticketNumber}] We received your request`,
        html: ticketConfirmationHtml({ ticketNumber: ticket.ticketNumber, subject: input.subject, submitterName: input.submitterName, trackUrl, companyName }),
        text: ticketConfirmationText({ ticketNumber: ticket.ticketNumber, subject: input.subject, submitterName: input.submitterName, trackUrl, companyName }),
      }).catch(() => {});

      return { ticketNumber: ticket.ticketNumber, publicToken: ticket.publicToken };
    }),

  // Public — track ticket status by token (sent in confirmation email).
  byPublicToken: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.findUnique({
        where: { publicToken: input },
        include: {
          messages: {
            where: { isInternal: false },
            orderBy: { createdAt: "asc" },
          },
        },
      });
      if (!ticket) throw new TRPCError({ code: "NOT_FOUND" });
      return ticket;
    }),

  list: protectedProcedure
    .input(
      z.object({
        status: ticketStatusEnum.optional(),
        priority: priorityEnum.optional(),
        assignedToId: z.string().cuid().optional(),
        clientId: z.string().cuid().optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { status, priority, assignedToId, clientId, page, limit } = input;
      const where = {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedToId && { assignedToId }),
        ...(clientId && { clientId }),
      };

      const [items, total] = await Promise.all([
        ctx.db.ticket.findMany({
          where,
          orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
          skip: (page - 1) * limit,
          take: limit,
          include: {
            client: { select: { id: true, name: true } },
            assignedTo: { select: { id: true, name: true } },
            _count: { select: { messages: true } },
          },
        }),
        ctx.db.ticket.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),

  byId: protectedProcedure
    .input(z.string().cuid())
    .query(({ ctx, input }) =>
      ctx.db.ticket.findUniqueOrThrow({
        where: { id: input },
        include: {
          client: true,
          assignedTo: { select: { id: true, name: true, email: true } },
          messages: {
            orderBy: { createdAt: "asc" },
            include: { files: true },
          },
          files: true,
        },
      })
    ),

  assign: staffProcedure
    .input(z.object({ ticketId: z.string().cuid(), userId: z.string().cuid().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          assignedToId: input.userId,
          status: input.userId ? "IN_PROGRESS" : "OPEN",
        },
      });
      return {
        ...ticket,
        _audit: { action: "ticket.assign", entityType: "Ticket", entityId: ticket.id },
      };
    }),

  updateStatus: staffProcedure
    .input(z.object({ ticketId: z.string().cuid(), status: ticketStatusEnum, priority: priorityEnum.optional() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.ticket.update({
        where: { id: input.ticketId },
        data: {
          status: input.status,
          ...(input.priority && { priority: input.priority }),
          ...(["RESOLVED", "CLOSED"].includes(input.status) && { resolvedAt: new Date() }),
        },
      });
      return {
        ...ticket,
        _audit: { action: "ticket.status", entityType: "Ticket", entityId: ticket.id },
      };
    }),

  reply: staffProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
        body: z.string().min(1).max(10000),
        isInternal: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.ticketMessage.create({
        data: {
          ticketId: input.ticketId,
          senderId: ctx.session.user.id,
          senderName: ctx.session.user.name,
          body: input.body,
          isInternal: input.isInternal,
        },
      });

      // Move back to open if staff replies to a waiting ticket.
      if (!input.isInternal) {
        await ctx.db.ticket.update({
          where: { id: input.ticketId, status: "WAITING_ON_CLIENT" },
          data: { status: "IN_PROGRESS" },
        });

        // Notify the submitter of the reply (only if we have their email).
        const ticket = await ctx.db.ticket.findUniqueOrThrow({ where: { id: input.ticketId } });
        if (ticket.submitterEmail) {
          const companyName = (await ctx.db.setting.findUnique({ where: { key: "company_name" } }))?.value ?? "Akritos";
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
          const trackUrl = `${baseUrl}/support/track?token=${ticket.publicToken}`;
          const submitterName = ticket.submitterName ?? "there";

          sendEmail({
            to: ticket.submitterEmail,
            subject: `Re: [${ticket.ticketNumber}] ${ticket.subject}`,
            html: ticketReplyHtml({ ticketNumber: ticket.ticketNumber, subject: ticket.subject, submitterName, replyBody: input.body, replierName: ctx.session.user.name ?? "Support", trackUrl, companyName }),
            text: ticketReplyText({ ticketNumber: ticket.ticketNumber, subject: ticket.subject, submitterName, replyBody: input.body, replierName: ctx.session.user.name ?? "Support", trackUrl, companyName }),
          }).catch(() => {});
        }
      }

      return message;
    }),
});
