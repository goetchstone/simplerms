// app/(dashboard)/dashboard/page.tsx
import { auth } from "@/server/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}.
      </p>
    </div>
  );
}
