// components/blog/comments-section.tsx
import { db } from "@/server/db";
import { formatDate } from "@/lib/utils";
import { CommentForm } from "@/components/blog/comment-form";

interface Props {
  postId: string;
}

export async function CommentsSection({ postId }: Props) {
  const comments = await db.blogComment.findMany({
    where: { postId, status: "APPROVED" },
    orderBy: { createdAt: "asc" },
    select: { id: true, authorName: true, content: true, createdAt: true },
  });

  return (
    <section className="mt-12 space-y-8 border-t border-bone/10 pt-8">
      <h2 className="text-xl font-medium text-bone">
        Comments {comments.length > 0 && <span className="text-bone/40">({comments.length})</span>}
      </h2>

      {comments.length > 0 && (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="border-l-2 border-conviction/30 pl-5">
              <div className="mb-1 flex items-baseline gap-3 text-sm">
                <span className="font-medium text-bone">{c.authorName}</span>
                <time className="text-xs text-bone/30" dateTime={c.createdAt.toISOString()}>
                  {formatDate(c.createdAt)}
                </time>
              </div>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-bone/70">
                {c.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      <CommentForm postId={postId} />
    </section>
  );
}
