// components/site/support-form.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-green-500" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-semibold text-zinc-900">Ticket submitted</h2>
        <p className="mb-1 text-zinc-600">
          Your ticket number is{" "}
          <span className="font-mono font-semibold text-zinc-900">
            {submit.data.ticketNumber}
          </span>
          .
        </p>
        <p className="text-sm text-zinc-500">
          We've sent a confirmation to {form.submitterEmail}. We'll reply there.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name *</Label>
          <Input
            id="name"
            required
            value={form.submitterName}
            onChange={field("submitterName")}
            placeholder="Jane Smith"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.submitterEmail}
            onChange={field("submitterEmail")}
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          required
          value={form.subject}
          onChange={field("subject")}
          placeholder="Brief description of your issue"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Details *</Label>
        <Textarea
          id="body"
          required
          rows={6}
          value={form.body}
          onChange={field("body")}
          placeholder="Please describe your issue in as much detail as possible…"
        />
      </div>

      {submit.error && (
        <p className="text-sm text-red-600">{submit.error.message}</p>
      )}

      <Button type="submit" disabled={submit.isPending} className="w-full">
        {submit.isPending ? "Submitting…" : "Submit ticket"}
      </Button>
    </form>
  );
}
