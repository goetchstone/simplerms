// app/(auth)/login/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LogoMark } from "@/components/brand/logo-mark";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-midnight">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <LogoMark size={48} color="#C8A96E" />
          <h1 className="text-2xl font-medium tracking-wider text-bone">Akritos</h1>
          <p className="text-sm text-slate-brand">Sign in to your account</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
