// app/(auth)/forgot-password/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { LogoMark } from "@/components/brand/logo-mark";

export default function ForgotPasswordPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-midnight">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <LogoMark size={48} color="#C8A96E" />
          <h1 className="text-2xl font-medium tracking-wider text-bone">Reset password</h1>
          <p className="text-sm text-slate-brand">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>
        <Suspense>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
