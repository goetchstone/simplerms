// app/(dashboard)/dashboard/settings/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { SettingsForm } from "@/components/settings/settings-form";
import { db } from "@/server/db";

async function getSettings() {
  const rows = await db.setting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Company information, invoice defaults, and email configuration.
        </p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
