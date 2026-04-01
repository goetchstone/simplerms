// app/(auth)/login/page.tsx
export const dynamic = "force-dynamic";

import { LoginForm } from "@/components/auth/login-form";
import { LogoMark } from "@/components/brand/logo-mark";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1C1F2E]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <LogoMark size={48} color="#C8A96E" />
          <h1 className="text-2xl font-medium tracking-wider text-[#E8E4DC]">Akritos</h1>
          <p className="text-sm text-[#4A5068]">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
