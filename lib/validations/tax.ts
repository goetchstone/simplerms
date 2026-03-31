// lib/validations/tax.ts
import { z } from "zod";

export const taxRateSchema = z.object({
  name: z.string().min(1).max(100),
  // Rate as a percentage — stored and displayed as e.g. 8.25, converted to 0.0825 in DB.
  ratePercent: z.number().min(0).max(100).multipleOf(0.0001),
  isCompound: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type TaxRateInput = z.infer<typeof taxRateSchema>;
