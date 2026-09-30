// lib/validations/text.ts
import { z } from "zod";

// Visitor-typed text from public forms. Control characters are dropped at the
// boundary: Postgres rejects NUL (a 500 instead of a validation error), and the
// rest end up in email subjects and calendar files. Limits apply after
// stripping, so a value of only control characters still fails min().
const ANY_CONTROL = /[\x00-\x1f\x7f]/g;
const CONTROL_EXCEPT_NEWLINES_TABS = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;

export const lineText = (max: number, min = 0) =>
  z.string().transform((s) => s.replace(ANY_CONTROL, "")).pipe(z.string().min(min).max(max));

export const multilineText = (max: number, min = 0) =>
  z.string().transform((s) => s.replace(CONTROL_EXCEPT_NEWLINES_TABS, "")).pipe(z.string().min(min).max(max));
