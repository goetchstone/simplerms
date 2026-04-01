// components/layout/change-password-dialog.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = trpc.users.changePassword.useMutation({
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    if (newPassword.length < 8) return;
    mutation.mutate({ currentPassword, newPassword });
  }

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const tooShort = newPassword.length > 0 && newPassword.length < 8;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) mutation.reset(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            {tooShort && (
              <p className="text-xs text-destructive">Must be at least 8 characters</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {mismatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={mutation.isPending || mismatch || tooShort || !currentPassword}
            >
              {mutation.isPending ? "Changing..." : "Change password"}
            </Button>
            {mutation.isSuccess && (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" /> Password changed
              </span>
            )}
            {mutation.error && (
              <p className="text-sm text-destructive">{mutation.error.message}</p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
