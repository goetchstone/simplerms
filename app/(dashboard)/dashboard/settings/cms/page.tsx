// app/(dashboard)/dashboard/settings/cms/page.tsx
export const dynamic = "force-dynamic";

import { createCachedCaller } from "@/lib/trpc/server";
import { CmsManager } from "@/components/cms/cms-manager";

export default async function CmsPage() {
  const caller = await createCachedCaller();

  const [pages, posts] = await Promise.all([
    caller.cms.listPages({ publishedOnly: false }),
    caller.cms.listPosts({ publishedOnly: false }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage public-facing pages and blog posts.
        </p>
      </div>
      <CmsManager initialPages={pages} initialPosts={posts} />
    </div>
  );
}
