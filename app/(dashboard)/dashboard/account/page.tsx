// app/(dashboard)/dashboard/account/page.tsx
export const dynamic = "force-dynamic";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/account/change-password-form";

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-lg font-semibold">Account</h1>
        <p className="text-sm text-muted-foreground">
          {session.user?.name ?? session.user?.email}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Change password</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
