// app/(dashboard)/dashboard/settings/users/page.tsx
export const dynamic = "force-dynamic";

import { createCachedCaller } from "@/lib/trpc/server";
import { UsersTable } from "@/components/settings/users-table";

export default async function UsersPage() {
  const caller = await createCachedCaller();
  const users = await caller.users.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Staff & users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage who has access and what they can do.
        </p>
      </div>
      <UsersTable initialData={users} />
    </div>
  );
}
