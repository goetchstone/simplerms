// components/scheduling/availability-editor.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";

// Index === dayOfWeek, matching JS Date.getDay() (0 = Sunday), which is what
// availableSlots compares against.
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DayRow {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const CLOSED: DayRow = { enabled: false, startTime: "09:00", endTime: "17:00" };

type SavedWindow = { dayOfWeek: number; startTime: string; endTime: string };

function toRows(saved: SavedWindow[] | undefined): DayRow[] {
  const rows = DAYS.map(() => ({ ...CLOSED }));
  for (const a of saved ?? []) {
    if (a.dayOfWeek >= 0 && a.dayOfWeek <= 6) {
      rows[a.dayOfWeek] = { enabled: true, startTime: a.startTime, endTime: a.endTime };
    }
  }
  return rows;
}

export function AvailabilityEditor() {
  const services = trpc.scheduling.listServices.useQuery({ publicOnly: false });
  const [pickedServiceId, setPickedServiceId] = useState("");

  // Availability is per-service, and availableSlots unions service-scoped rows
  // with global ones — so the editor always targets one explicit service rather
  // than writing "global" hours that would silently add slots on top.
  const serviceId = pickedServiceId || services.data?.[0]?.id || "";

  const availability = trpc.scheduling.getAvailability.useQuery(
    { serviceId: serviceId || undefined },
    { enabled: serviceId.length > 0 }
  );

  // A draft remembers which fetch it was edited from, so a refetch (after
  // saving or switching service) shows the server's hours again.
  const [draft, setDraft] = useState<{
    source: SavedWindow[] | undefined;
    rows: DayRow[];
  } | null>(null);
  const rows =
    draft && draft.source === availability.data ? draft.rows : toRows(availability.data);

  const utils = trpc.useUtils();
  const save = trpc.scheduling.setAvailability.useMutation({
    onSuccess: () => utils.scheduling.getAvailability.invalidate(),
  });

  function update(index: number, patch: Partial<DayRow>) {
    setDraft({
      source: availability.data,
      rows: rows.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    });
  }

  // Lexical compare is safe on zero-padded HH:MM and catches the end-before-start
  // case that would otherwise publish a window producing zero slots.
  const badRange = rows.some((r) => r.enabled && r.startTime >= r.endTime);

  function onSave() {
    if (!serviceId || badRange) return;
    save.mutate({
      serviceId,
      slots: rows.flatMap((r, dayOfWeek) =>
        r.enabled ? [{ dayOfWeek, startTime: r.startTime, endTime: r.endTime }] : []
      ),
    });
  }

  return (
    <div className="rounded-md border p-6">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-medium">Booking availability</h2>
        {services.data && services.data.length > 1 && (
          <select
            aria-label="Service"
            value={serviceId}
            onChange={(e) => setPickedServiceId(e.target.value)}
            className="rounded-md border bg-background px-2 py-1 text-sm"
          >
            {services.data.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Unchecked days show no times on the public booking page. Times are Eastern
        (America/New_York) and are converted per visitor.
      </p>

      {availability.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-3">
          {DAYS.map((day, i) => {
            const row = rows[i]!;
            return (
              <div key={day} className="flex flex-wrap items-center gap-3">
                <label className="flex w-36 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={row.enabled}
                    onChange={(e) => update(i, { enabled: e.target.checked })}
                    className="h-4 w-4"
                  />
                  {day}
                </label>

                {row.enabled ? (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${day}-start`} className="sr-only">
                      {day} start
                    </Label>
                    <Input
                      id={`${day}-start`}
                      type="time"
                      value={row.startTime}
                      onChange={(e) => update(i, { startTime: e.target.value })}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Label htmlFor={`${day}-end`} className="sr-only">
                      {day} end
                    </Label>
                    <Input
                      id={`${day}-end`}
                      type="time"
                      value={row.endTime}
                      onChange={(e) => update(i, { endTime: e.target.value })}
                      className="w-32"
                    />
                    {row.startTime >= row.endTime && (
                      <span className="text-sm text-destructive">End must be after start</span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Closed</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={onSave} disabled={save.isPending || badRange || !serviceId}>
          {save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save availability
        </Button>
        {save.isSuccess && !save.isPending && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
        {save.error && <span className="text-sm text-destructive">{save.error.message}</span>}
      </div>
    </div>
  );
}
