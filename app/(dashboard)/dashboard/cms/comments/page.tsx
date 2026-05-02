// app/(dashboard)/dashboard/cms/comments/page.tsx
export const dynamic = "force-dynamic";

import { createCachedCaller } from "@/lib/trpc/server";
import { CommentsTable } from "@/components/cms/comments-table";

export default async function CommentsModerationPage() {
  const caller = await createCachedCaller();
  const result = await caller.comments.listPending({ status: "PENDING", page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Comments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderate blog comments. Pending comments are not visible to readers.
        </p>
      </div>
      <CommentsTable initialData={result} initialStatus="PENDING" />
    </div>
  );
}
