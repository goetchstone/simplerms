// components/layout/user-menu.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChangePasswordDialog } from "./change-password-dialog";

function initials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return (email?.[0] ?? "?").toUpperCase();
}

interface UserMenuProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function UserMenu({ name, email, image }: UserMenuProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback className="text-xs">
              {initials(name, email)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium">{name ?? email}</p>
            {name && (
              <p className="text-xs text-muted-foreground">{email}</p>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
            Change password
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => signOut({ callbackUrl: "/login" })}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </>
  );
}
