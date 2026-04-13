// app/(auth)/reset-password/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { LogoMark } from "@/components/brand/logo-mark";

export default function ResetPasswordPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-midnight">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <LogoMark size={48} color="#C8A96E" />
          <h1 className="text-2xl font-medium tracking-wider text-bone">New password</h1>
          <p className="text-sm text-slate-brand">Choose a new password for your account.</p>
        </div>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
