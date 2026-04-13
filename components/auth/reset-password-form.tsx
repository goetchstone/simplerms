// components/auth/reset-password-form.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutation = trpc.users.resetPassword.useMutation({
    onSuccess: () => setSuccess(true),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    mutation.mutate({ token, newPassword: password });
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-alert">Missing reset token. Please use the link from your email.</p>
        <Link href="/forgot-password" className="inline-block text-sm text-conviction hover:text-conviction/80">
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-bone/80">
          Your password has been reset. You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-md bg-conviction px-6 py-2 text-sm font-medium text-midnight hover:bg-conviction/90"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-bone/80">New password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-bone/20 bg-bone/5 text-bone placeholder:text-bone/30 focus:border-conviction"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm" className="text-bone/80">Confirm password</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border-bone/20 bg-bone/5 text-bone placeholder:text-bone/30 focus:border-conviction"
        />
      </div>

      {error && <p className="text-sm text-alert">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-conviction text-midnight hover:bg-conviction/90"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}
