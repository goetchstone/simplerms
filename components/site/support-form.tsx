// components/site/support-form.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { CheckCircle } from "lucide-react";

export function SupportForm() {
  const [form, setForm] = useState({
    submitterName: "",
    submitterEmail: "",
    subject: "",
    body: "",
  });

  const submit = trpc.tickets.submit.useMutation();

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit.mutate(form);
  }

  if (submit.isSuccess) {
    return (
      <div className="border border-clear/30 bg-clear/10 p-8 text-center" style={{ borderRadius: "2px" }}>
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-clear" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-medium text-bone">Ticket submitted</h2>
        <p className="mb-1 text-bone/60">
          Your ticket number is{" "}
          <span className="font-mono font-medium text-conviction">
            {submit.data.ticketNumber}
          </span>
          .
        </p>
        <p className="text-sm text-bone/40">
          We&apos;ve sent a confirmation to {form.submitterEmail}. We&apos;ll reply there.
        </p>
      </div>
    );
  }

  const inputClass = "w-full border border-bone/20 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-bone/30 focus:border-conviction focus:outline-none";
  const labelClass = "text-sm font-medium text-bone/70";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className={labelClass}>Your name *</label>
          <input
            id="name"
            required
            value={form.submitterName}
            onChange={field("submitterName")}
            placeholder="Jane Smith"
            className={inputClass}
            style={{ borderRadius: "2px" }}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input
            id="email"
            type="email"
            required
            value={form.submitterEmail}
            onChange={field("submitterEmail")}
            placeholder="jane@example.com"
            className={inputClass}
            style={{ borderRadius: "2px" }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className={labelClass}>Subject *</label>
        <input
          id="subject"
          required
          value={form.subject}
          onChange={field("subject")}
          placeholder="Brief description of your issue"
          className={inputClass}
          style={{ borderRadius: "2px" }}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="body" className={labelClass}>Details *</label>
        <textarea
          id="body"
          required
          rows={6}
          value={form.body}
          onChange={field("body")}
          placeholder="Please describe your issue in as much detail as possible..."
          className={`${inputClass} resize-none`}
          style={{ borderRadius: "2px" }}
        />
      </div>

      {submit.error && (
        <p className="text-sm text-alert">{submit.error.message}</p>
      )}

      <button
        type="submit"
        disabled={submit.isPending}
        className="w-full bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90 disabled:opacity-50"
        style={{ borderRadius: "2px" }}
      >
        {submit.isPending ? "Submitting..." : "Submit ticket"}
      </button>
    </form>
  );
}
