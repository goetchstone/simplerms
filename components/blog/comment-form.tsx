// components/blog/comment-form.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

interface Props {
  postId: string;
}

// Honeypot field 'website' must be visually hidden but reachable to bots.
// Real users never fill it; bots fill every field they see.
const HONEYPOT_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  opacity: 0,
};

export function CommentForm({ postId }: Props) {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [website, setWebsite] = useState("");
  const submit = trpc.comments.submit.useMutation();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.length < 10) return;
    submit.mutate({ postId, authorName, authorEmail, content, website });
  }

  if (submit.isSuccess) {
    return (
      <div className="border border-bone/10 bg-slate-brand/20 p-6 text-base text-bone/70" style={{ borderRadius: "2px" }}>
        Thanks. Your comment is awaiting approval.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-base font-medium text-bone">Leave a comment</h3>
      <p className="text-sm text-bone/40">
        Comments are reviewed before they appear. Email is not shown publicly.
      </p>

      {/* Honeypot — hidden from users, visible to bots */}
      <div style={HONEYPOT_STYLE} aria-hidden="true">
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          required
          maxLength={80}
          placeholder="Your name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="border border-bone/20 bg-midnight px-3 py-2 text-sm text-bone placeholder-bone/30 focus:border-conviction focus:outline-none"
          style={{ borderRadius: "2px" }}
        />
        <input
          type="email"
          required
          maxLength={254}
          placeholder="Email (not shown publicly)"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          className="border border-bone/20 bg-midnight px-3 py-2 text-sm text-bone placeholder-bone/30 focus:border-conviction focus:outline-none"
          style={{ borderRadius: "2px" }}
        />
      </div>

      <textarea
        required
        minLength={10}
        maxLength={2000}
        rows={5}
        placeholder="Your comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-bone/20 bg-midnight px-3 py-2 text-sm text-bone placeholder-bone/30 focus:border-conviction focus:outline-none"
        style={{ borderRadius: "2px" }}
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submit.isPending || content.length < 10}
          className="inline-flex items-center gap-2 bg-conviction px-4 py-2 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90 disabled:opacity-50"
          style={{ borderRadius: "2px" }}
        >
          {submit.isPending ? "Sending…" : "Submit comment"}
        </button>
        {submit.error && (
          <span className="text-sm text-red-400">{submit.error.message}</span>
        )}
      </div>
    </form>
  );
}
