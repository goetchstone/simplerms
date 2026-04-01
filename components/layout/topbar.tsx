// components/layout/topbar.tsx
import { auth } from "@/server/auth";
import { UserMenu } from "./user-menu";

export async function Topbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="flex h-14 items-center justify-end border-b px-4">
      <UserMenu name={user?.name} email={user?.email} image={user?.image} />
    </header>
  );
}
