// lib/validations/client.ts
import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zip: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
});

export const clientSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(255).optional().nullable(),
  address: addressSchema.optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export const contactSchema = z.object({
  clientId: z.string().cuid(),
  name: z.string().min(1).max(255),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  isPrimary: z.boolean().default(false),
});

export type ClientInput = z.infer<typeof clientSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
