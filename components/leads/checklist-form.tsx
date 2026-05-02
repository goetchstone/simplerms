// components/leads/checklist-form.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
  source: string;
}

const HONEYPOT_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "-9999px",
  width: "1px",
  height: "1px",
  opacity: 0,
};

export function ChecklistForm({ source }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const submit = trpc.leads.submit.useMutation();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit.mutate({ email, name: name || undefined, company: company || undefined, source, website });
  }

  if (submit.isSuccess) {
    return (
      <div
        className="space-y-4 border border-conviction/30 bg-slate-brand/20 p-6"
        style={{ borderRadius: "2px" }}
      >
        <div className="flex items-center gap-2 text-bone">
          <CheckCircle2 className="h-5 w-5 text-conviction" />
          <p className="text-base font-medium">Check your email.</p>
        </div>
        <p className="text-base leading-relaxed text-bone/70">
          The checklist is on its way to <span className="text-bone">{email}</span>.
          If it doesn&apos;t arrive in a few minutes, check your spam folder
          or email <a href="mailto:info@akritos.com" className="text-conviction underline underline-offset-2">info@akritos.com</a>.
        </p>
        {submit.data?.downloadUrl && (
          <p className="text-sm text-bone/50">
            You can also{" "}
            <a
              href={submit.data.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-conviction underline underline-offset-2"
            >
              download it directly
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          maxLength={80}
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-bone/20 bg-midnight px-3 py-2 text-sm text-bone placeholder-bone/30 focus:border-conviction focus:outline-none"
          style={{ borderRadius: "2px" }}
        />
        <input
          type="text"
          maxLength={120}
          placeholder="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border border-bone/20 bg-midnight px-3 py-2 text-sm text-bone placeholder-bone/30 focus:border-conviction focus:outline-none"
          style={{ borderRadius: "2px" }}
        />
      </div>

      <input
        type="email"
        required
        maxLength={254}
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-bone/20 bg-midnight px-3 py-2 text-sm text-bone placeholder-bone/30 focus:border-conviction focus:outline-none"
        style={{ borderRadius: "2px" }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submit.isPending || !email}
          className="inline-flex items-center gap-2 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90 disabled:opacity-50"
          style={{ borderRadius: "2px" }}
        >
          {submit.isPending ? "Sending…" : (
            <>
              Email me the checklist <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        {submit.error && (
          <span className="text-sm text-red-400">{submit.error.message}</span>
        )}
      </div>

      <p className="text-xs text-bone/40">
        We email you the PDF and one follow-up message a week later. No drip
        sequences, no list rentals, easy unsubscribe. Used only to send you
        what you asked for.
      </p>
    </form>
  );
}
