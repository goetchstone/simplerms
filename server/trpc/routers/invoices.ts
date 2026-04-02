// server/trpc/routers/invoices.ts
import "server-only";

import { createTRPCRouter, protectedProcedure, staffProcedure, publicProcedure } from "@/server/trpc/trpc";
import { createInvoiceSchema } from "@/lib/validations/invoice";
import { computeInvoice } from "@/server/invoice/tax";
import { nextInvoiceNumber } from "@/server/invoice/number";
import { createInvoicePaymentLink, deactivatePaymentLink } from "@/server/stripe";
import { sendEmail } from "@/server/email";
import { invoiceEmailHtml, invoiceEmailText } from "@/server/email/templates/invoice";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Decimal } from "@prisma/client/runtime/library";

// Converts a Prisma Decimal to a plain number for calculation.
function toNum(d: Decimal | number): number {
  return typeof d === "number" ? d : Number(d);
}

export const invoicesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        clientId: z.string().cuid().optional(),
        status: z
          .enum(["DRAFT", "SENT", "VIEWED", "PARTIAL", "PAID", "OVERDUE", "VOID"])
          .optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clientId, status, page, limit } = input;
      const where = {
        ...(clientId && { clientId }),
        ...(status && { status }),
      };

      const [items, total] = await Promise.all([
        ctx.db.invoice.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            client: { select: { id: true, name: true, company: true } },
            createdBy: { select: { id: true, name: true } },
          },
        }),
        ctx.db.invoice.count({ where }),
      ]);

      return { items, total, pages: Math.ceil(total / limit) };
    }),

  byId: protectedProcedure
    .input(z.string().cuid())
    .query(({ ctx, input }) =>
      ctx.db.invoice.findUniqueOrThrow({
        where: { id: input },
        include: {
          client: true,
          createdBy: { select: { id: true, name: true, email: true } },
          lines: {
            orderBy: { sortOrder: "asc" },
            include: {
              taxes: { include: { taxRate: true } },
              catalogItem: true,
            },
          },
          payments: { orderBy: { paidAt: "desc" } },
          files: true,
        },
      })
    ),

  // Public tokenized view — no auth required. Used for client-facing invoice page.
  byPublicToken: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUnique({
        where: { publicToken: input },
        include: {
          client: { select: { name: true, email: true, company: true } },
          lines: {
            orderBy: { sortOrder: "asc" },
            include: { taxes: { include: { taxRate: true } } },
          },
          payments: { select: { amount: true, method: true, paidAt: true } },
        },
      });

      if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

      // Mark as VIEWED the first time a client opens the link.
      if (invoice.status === "SENT") {
        await ctx.db.invoice.update({
          where: { id: invoice.id },
          data: { status: "VIEWED" },
        });
      }

      return invoice;
    }),

  create: staffProcedure
    .input(createInvoiceSchema)
    .mutation(async ({ ctx, input }) => {
      const { clientId, issueDate, dueDate, currency, notes, lines: lineInputs } = input;

      // Fetch all referenced tax rates in one query.
      const allTaxRateIds = [...new Set(lineInputs.flatMap((l) => l.taxRateIds))];
      const taxRates = await ctx.db.taxRate.findMany({
        where: { id: { in: allTaxRateIds }, isActive: true },
      });
      const taxRateMap = new Map(taxRates.map((t) => [t.id, t]));

      // Validate every requested tax rate exists.
      for (const id of allTaxRateIds) {
        if (!taxRateMap.has(id)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Tax rate ${id} not found or inactive`,
          });
        }
      }

      // Run tax calculations.
      const computed = computeInvoice(
        lineInputs.map((l) => ({
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          taxRates: l.taxRateIds.map((id) => {
            const t = taxRateMap.get(id)!;
            return { id: t.id, name: t.name, rate: toNum(t.rate), isCompound: t.isCompound };
          }),
        }))
      );

      const invoiceNumber = await nextInvoiceNumber();

      const invoice = await ctx.db.invoice.create({
        data: {
          invoiceNumber,
          clientId,
          createdById: ctx.session.user.id,
          issueDate,
          dueDate,
          currency,
          notes,
          subtotal: computed.subtotal,
          taxTotal: computed.taxTotal,
          total: computed.total,
          lines: {
            create: lineInputs.map((line, i) => ({
              catalogItemId: line.catalogItemId,
              description: line.description,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              lineTotal: computed.lines[i].lineTotal,
              sortOrder: line.sortOrder ?? i,
              taxes: {
                create: computed.lines[i].taxes.map((t) => ({
                  taxRateId: t.taxRateId,
                  taxAmount: t.taxAmount,
                })),
              },
            })),
          },
        },
        include: {
          lines: { include: { taxes: true } },
          client: true,
        },
      });

      // Append to client activity log.
      await ctx.db.activityLog.create({
        data: {
          clientId,
          type: "invoice.created",
          summary: `Invoice ${invoiceNumber} created`,
          metadata: { invoiceId: invoice.id, total: computed.total },
        },
      });

      return {
        ...invoice,
        _audit: {
          action: "invoice.create",
          entityType: "Invoice",
          entityId: invoice.id,
          after: { invoiceNumber, total: computed.total, clientId },
        },
      };
    }),

  // Generates a Stripe Payment Link and attaches it to the invoice.
  generatePaymentLink: staffProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUniqueOrThrow({
        where: { id: input },
        include: { client: true },
      });

      if (["PAID", "VOID"].includes(invoice.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot create payment link for a paid or voided invoice",
        });
      }

      // If one already exists, deactivate it before creating a new one.
      if (invoice.stripePaymentLinkId) {
        await deactivatePaymentLink(invoice.stripePaymentLinkId);
      }

      const remaining = toNum(invoice.total) - toNum(invoice.paidAmount);
      const amountCents = Math.round(remaining * 100);

      const link = await createInvoicePaymentLink({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.name,
        amountCents,
        currency: invoice.currency,
      });

      const updated = await ctx.db.invoice.update({
        where: { id: invoice.id },
        data: { stripePaymentLink: link.url, stripePaymentLinkId: link.id },
      });

      return {
        ...updated,
        _audit: {
          action: "invoice.paymentLink.generate",
          entityType: "Invoice",
          entityId: invoice.id,
        },
      };
    }),

  // Sends the invoice email to the client with the payment link.
  send: staffProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUniqueOrThrow({
        where: { id: input },
        include: { client: true },
      });

      if (invoice.status === "VOID") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot send a voided invoice" });
      }

      if (!invoice.client.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Client has no email address",
        });
      }

      const [companySetting] = await Promise.all([
        ctx.db.setting.findUnique({ where: { key: "company_name" } }),
      ]);

      const companyName = companySetting?.value ?? "Akritos";
      const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/invoices/${invoice.publicToken}`;

      const emailData = {
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.name,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        total: toNum(invoice.total),
        currency: invoice.currency,
        paymentLink: invoice.stripePaymentLink,
        portalUrl,
        companyName,
      };

      await sendEmail({
        to: invoice.client.email,
        subject: `Invoice ${invoice.invoiceNumber} from ${companyName}`,
        html: invoiceEmailHtml(emailData),
        text: invoiceEmailText(emailData),
      });

      const updated = await ctx.db.invoice.update({
        where: { id: invoice.id },
        data: {
          status: invoice.status === "DRAFT" ? "SENT" : invoice.status,
          sentAt: new Date(),
        },
      });

      await ctx.db.activityLog.create({
        data: {
          clientId: invoice.clientId,
          type: "invoice.sent",
          summary: `Invoice ${invoice.invoiceNumber} sent to ${invoice.client.email}`,
          metadata: { invoiceId: invoice.id },
        },
      });

      return {
        ...updated,
        _audit: {
          action: "invoice.send",
          entityType: "Invoice",
          entityId: invoice.id,
        },
      };
    }),

  void: staffProcedure
    .input(z.string().cuid())
    .mutation(async ({ ctx, input }) => {
      const invoice = await ctx.db.invoice.findUniqueOrThrow({
        where: { id: input },
      });

      if (invoice.status === "PAID") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot void a paid invoice" });
      }

      if (invoice.stripePaymentLinkId) {
        await deactivatePaymentLink(invoice.stripePaymentLinkId);
      }

      const updated = await ctx.db.invoice.update({
        where: { id: input },
        data: { status: "VOID", stripePaymentLink: null, stripePaymentLinkId: null },
      });

      return {
        ...updated,
        _audit: {
          action: "invoice.void",
          entityType: "Invoice",
          entityId: input,
        },
      };
    }),
});
