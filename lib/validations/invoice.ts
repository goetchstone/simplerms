// lib/validations/invoice.ts
import { z } from "zod";

export const invoiceLineSchema = z.object({
  catalogItemId: z.string().cuid().optional().nullable(),
  description: z.string().min(1).max(1000),
  quantity: z.number().positive().multipleOf(0.001),
  unitPrice: z.number().min(0).multipleOf(0.01),
  taxRateIds: z.array(z.string().cuid()).default([]),
  sortOrder: z.number().int().default(0),
});

export const createInvoiceSchema = z.object({
  clientId: z.string().cuid(),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date().optional().nullable(),
  currency: z.string().length(3).default("USD"),
  notes: z.string().max(5000).optional().nullable(),
  lines: z.array(invoiceLineSchema).min(1),
});

export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  status: z
    .enum(["DRAFT", "SENT", "VIEWED", "PARTIAL", "PAID", "OVERDUE", "VOID"])
    .optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type InvoiceLineInput = z.infer<typeof invoiceLineSchema>;
