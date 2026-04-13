// components/account/edit-profile-form.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface Props {
  initialName: string;
  initialEmail: string;
}

export function EditProfileForm({ initialName, initialEmail }: Props) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const mutation = trpc.users.updateProfile.useMutation();

  const dirty = name !== initialName || email !== initialEmail;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dirty) return;
    mutation.mutate({ name, email });
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={1}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="profile-email">Email</Label>
        <Input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {mutation.isSuccess && email !== initialEmail && (
          <p className="text-xs text-muted-foreground">
            Sign out and back in for the email change to take full effect.
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={mutation.isPending || !dirty}>
          {mutation.isPending ? "Saving…" : "Save changes"}
        </Button>
        {mutation.isSuccess && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" /> Profile updated
          </span>
        )}
        {mutation.error && (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        )}
      </div>
    </form>
  );
}
