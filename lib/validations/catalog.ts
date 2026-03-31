// lib/validations/catalog.ts
import { z } from "zod";

export const catalogItemSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  type: z.enum(["SERVICE", "PRODUCT", "DIGITAL"]),
  unitPrice: z.number().min(0).multipleOf(0.01),
  unit: z.string().max(50).optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CatalogItemInput = z.infer<typeof catalogItemSchema>;
