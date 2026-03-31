// lib/trpc/client.ts
// Use this to call tRPC procedures from Client Components.
"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/trpc/root";

export const trpc = createTRPCReact<AppRouter>();
