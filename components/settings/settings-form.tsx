// components/settings/settings-form.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface Props {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: Props) {
  const [values, setValues] = useState({
    company_name: initialSettings.company_name ?? "",
    company_email: initialSettings.company_email ?? "",
    company_phone: initialSettings.company_phone ?? "",
    company_address: initialSettings.company_address ?? "",
    invoice_prefix: initialSettings.invoice_prefix ?? "INV",
    default_currency: initialSettings.default_currency ?? "USD",
    default_due_days: initialSettings.default_due_days ?? "30",
    smtp_host: initialSettings.smtp_host ?? "",
    smtp_port: initialSettings.smtp_port ?? "587",
    smtp_user: initialSettings.smtp_user ?? "",
    smtp_pass: "",
    email_from: initialSettings.email_from ?? "",
  });

  const upsert = trpc.settings.upsert.useMutation();

  function field(key: keyof typeof values) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Don't send empty smtp_pass — it would clear the existing password.
    const payload = { ...values };
    if (!payload.smtp_pass) delete (payload as Record<string, string>).smtp_pass;
    upsert.mutate(payload);
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-8">
      {/* Company */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Company</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="company_name">Company name</Label>
            <Input id="company_name" value={values.company_name} onChange={field("company_name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company_email">Company email</Label>
            <Input id="company_email" type="email" value={values.company_email} onChange={field("company_email")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company_phone">Phone</Label>
            <Input id="company_phone" type="tel" value={values.company_phone} onChange={field("company_phone")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company_address">Address</Label>
            <Input id="company_address" value={values.company_address} onChange={field("company_address")} />
          </div>
        </div>
      </section>

      {/* Invoice defaults */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Invoice defaults</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="invoice_prefix">Invoice prefix</Label>
            <Input id="invoice_prefix" value={values.invoice_prefix} onChange={field("invoice_prefix")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="default_currency">Currency</Label>
            <Input id="default_currency" value={values.default_currency} onChange={field("default_currency")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="default_due_days">Default due (days)</Label>
            <Input id="default_due_days" type="number" min="0" value={values.default_due_days} onChange={field("default_due_days")} />
          </div>
        </div>
      </section>

      {/* Email / SMTP */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold">Email (SMTP)</h2>
        <p className="text-xs text-muted-foreground">
          In development, Mailpit catches all outbound email on port 1025 — no configuration needed.
          Set these for production SMTP.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="smtp_host">SMTP host</Label>
            <Input id="smtp_host" value={values.smtp_host} onChange={field("smtp_host")} placeholder="smtp.example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="smtp_port">SMTP port</Label>
            <Input id="smtp_port" type="number" value={values.smtp_port} onChange={field("smtp_port")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="smtp_user">SMTP user</Label>
            <Input id="smtp_user" value={values.smtp_user} onChange={field("smtp_user")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="smtp_pass">SMTP password</Label>
            <Input id="smtp_pass" type="password" value={values.smtp_pass} onChange={field("smtp_pass")} placeholder="Leave blank to keep current" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email_from">From address</Label>
            <Input id="email_from" type="email" value={values.email_from} onChange={field("email_from")} placeholder="noreply@yourcompany.com" />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={upsert.isPending}>
          {upsert.isPending ? "Saving…" : "Save settings"}
        </Button>
        {upsert.isSuccess && (
          <span className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" /> Saved
          </span>
        )}
        {upsert.error && (
          <span className="text-sm text-destructive">{upsert.error.message}</span>
        )}
      </div>
    </form>
  );
}
