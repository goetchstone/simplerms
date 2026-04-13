// components/auth/forgot-password-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = trpc.users.requestPasswordReset.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate({ email });
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-bone/80">
          If an account exists for <strong className="text-bone">{email}</strong>,
          we sent a reset link. Check your inbox.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-conviction hover:text-conviction/80"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-bone/80">Email address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-bone/20 bg-bone/5 text-bone placeholder:text-bone/30 focus:border-conviction"
        />
      </div>

      {error && <p className="text-sm text-alert">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-conviction text-midnight hover:bg-conviction/90"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Sending…" : "Send reset link"}
      </Button>

      <p className="text-center text-sm text-slate-brand">
        <Link href="/login" className="hover:text-bone">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
