// components/settings/users-table.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, UserCheck, UserX } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { RouterOutputs } from "@/lib/trpc/client";

type UserList = RouterOutputs["users"]["list"];

const ROLES = ["ADMIN", "STAFF", "READONLY"] as const;

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  role: typeof ROLES[number];
}

const emptyForm = (): NewUserForm => ({ name: "", email: "", password: "", role: "STAFF" });

export function UsersTable({ initialData }: { initialData: UserList }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(emptyForm());

  const utils = trpc.useUtils();

  const { data: users } = trpc.users.list.useQuery(undefined, {
    initialData,
    placeholderData: (prev) => prev,
  });

  const create = trpc.users.create.useMutation({
    onSuccess: () => {
      utils.users.list.invalidate();
      setOpen(false);
      setForm(emptyForm());
    },
  });

  const updateRole = trpc.users.updateRole.useMutation({
    onSuccess: () => utils.users.list.invalidate(),
  });

  const setActive = trpc.users.setActive.useMutation({
    onSuccess: () => utils.users.list.invalidate(),
  });

  function field(key: keyof NewUserForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    create.mutate(form);
  }

  const list = users ?? initialData;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Invite user
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole.mutate({ id: user.id, role: e.target.value as typeof ROLES[number] })
                    }
                    className="rounded border border-input bg-background px-2 py-1 text-xs"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setActive.mutate({ id: user.id, isActive: !user.isActive })}
                    className="text-muted-foreground hover:text-foreground"
                    title={user.isActive ? "Deactivate" : "Activate"}
                  >
                    {user.isActive
                      ? <UserX className="h-4 w-4" />
                      : <UserCheck className="h-4 w-4" />}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setForm(emptyForm()); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="uname">Full name *</Label>
              <Input id="uname" required value={form.name} onChange={field("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uemail">Email *</Label>
              <Input id="uemail" type="email" required value={form.email} onChange={field("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="upass">Temporary password *</Label>
              <Input id="upass" type="password" required minLength={8} value={form.password} onChange={field("password")} />
              <p className="text-xs text-muted-foreground">The user can change this after their first login.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="urole">Role</Label>
              <select
                id="urole"
                value={form.role}
                onChange={field("role")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {create.error && <p className="text-sm text-destructive">{create.error.message}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create user"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
