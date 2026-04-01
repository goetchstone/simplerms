// app/(dashboard)/dashboard/audit-log/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { AuditLogTable } from "@/components/audit/audit-log-table";

export default async function AuditLogPage() {
  const caller = await createCachedCaller();
  const result = await caller.audit.list({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every mutation, who made it, and what changed.
        </p>
      </div>
      <AuditLogTable initialData={result} />
    </div>
  );
}
