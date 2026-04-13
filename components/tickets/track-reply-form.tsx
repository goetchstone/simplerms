// components/tickets/track-reply-form.tsx
"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  token: string;
}

export function TrackReplyForm({ token }: Props) {
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setStatus("pending");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/tickets/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, body: body.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      setStatus("success");
      setBody("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-clear/30 bg-clear/10 p-6 text-center" style={{ borderRadius: "2px" }}>
        <CheckCircle className="mx-auto mb-3 h-8 w-8 text-clear" strokeWidth={1.5} />
        <p className="mb-1 text-sm font-medium text-bone">Reply sent</p>
        <p className="text-xs text-bone/40">We&apos;ll get back to you shortly.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs text-conviction underline"
        >
          Send another reply
        </button>
      </div>
    );
  }

  const inputClass = "w-full border border-bone/20 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-bone/30 focus:border-conviction focus:outline-none resize-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="reply" className="text-sm font-medium text-bone/70">
        Reply
      </label>
      <textarea
        id="reply"
        required
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add details or respond to our team..."
        className={inputClass}
        style={{ borderRadius: "2px" }}
      />

      {status === "error" && (
        <p className="text-sm text-alert">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "pending"}
        className="w-full bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90 disabled:opacity-50"
        style={{ borderRadius: "2px" }}
      >
        {status === "pending" ? "Sending..." : "Send reply"}
      </button>
    </form>
  );
}
