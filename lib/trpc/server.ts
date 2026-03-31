// lib/trpc/server.ts
// Use this to call tRPC procedures from React Server Components.
import "server-only";

import { createCallerFactory, createTRPCContext } from "@/server/trpc/trpc";
import { appRouter } from "@/server/trpc/root";
import { headers } from "next/headers";
import { cache } from "react";

const createCaller = createCallerFactory(appRouter);

export const createCachedCaller = cache(async () => {
  const ctx = await createTRPCContext({ headers: await headers() });
  return createCaller(ctx);
});
