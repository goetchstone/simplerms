// components/site/booking-flow.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Step = "date" | "slot" | "details" | "done";

interface SlotButtonProps {
  slot: { startsAt: Date; endsAt: Date };
  selected: boolean;
  onSelect: () => void;
}

function SlotButton({ slot, selected, onSelect }: SlotButtonProps) {
  const time = new Date(slot.startsAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
        selected
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
      }`}
    >
      {time}
    </button>
  );
}

// Produce a list of dates to browse (next 14 days from today).
function getDateRange(): Date[] {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

export function BookingFlow({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ startsAt: Date; endsAt: Date } | null>(null);
  const [form, setForm] = useState({
    bookerName: "",
    bookerEmail: "",
    bookerPhone: "",
    notes: "",
  });

  const dates = getDateRange();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const { data: slots, isFetching } = trpc.scheduling.availableSlots.useQuery(
    { serviceId, date: selectedDate! },
    { enabled: !!selectedDate }
  );

  const book = trpc.scheduling.book.useMutation();

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    book.mutate({
      serviceId,
      startsAt: selectedSlot.startsAt,
      bookerName: form.bookerName,
      bookerEmail: form.bookerEmail,
      bookerPhone: form.bookerPhone || null,
      notes: form.notes || null,
      timezone,
    });
  }

  if (book.isSuccess) {
    const appt = book.data;
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-green-500" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-semibold text-zinc-900">You're booked!</h2>
        <p className="mb-1 text-zinc-600">
          <span className="font-medium">{serviceName}</span> on{" "}
          <span className="font-medium">{formatDate(appt.startsAt)}</span>
        </p>
        <p className="text-sm text-zinc-500">
          Confirmation sent to {form.bookerEmail}. Use your email link to cancel if needed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step: pick date */}
      {step === "date" && (
        <div>
          <p className="mb-4 text-sm font-medium text-zinc-700">Select a date</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {dates.map((d) => {
              const isSelected = selectedDate?.toDateString() === d.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d);
                    setSelectedSlot(null);
                    setStep("slot");
                  }}
                  className={`flex flex-col items-center rounded-lg border px-2 py-3 text-center transition-colors ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  <span className="text-xs font-medium uppercase opacity-60">
                    {d.toLocaleDateString([], { weekday: "short" })}
                  </span>
                  <span className="text-lg font-semibold">{d.getDate()}</span>
                  <span className="text-xs opacity-60">
                    {d.toLocaleDateString([], { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step: pick slot */}
      {step === "slot" && selectedDate && (
        <div>
          <button
            type="button"
            onClick={() => setStep("date")}
            className="mb-4 flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <p className="mb-4 text-sm font-medium text-zinc-700">
            Available times on{" "}
            <span className="text-zinc-900">{formatDate(selectedDate)}</span>
          </p>

          {isFetching ? (
            <p className="text-sm text-zinc-400">Loading…</p>
          ) : !slots || slots.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
              No availability on this date. Try another day.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <SlotButton
                  key={slot.startsAt.toString()}
                  slot={slot}
                  selected={selectedSlot?.startsAt.toString() === slot.startsAt.toString()}
                  onSelect={() => setSelectedSlot(slot)}
                />
              ))}
            </div>
          )}

          {selectedSlot && (
            <Button
              className="mt-6"
              onClick={() => setStep("details")}
            >
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Step: booker details */}
      {step === "details" && selectedSlot && (
        <form onSubmit={handleBook} className="space-y-5">
          <button
            type="button"
            onClick={() => setStep("slot")}
            className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
            <span className="font-medium text-zinc-700">{serviceName}</span>
            {" — "}
            {formatDate(selectedSlot.startsAt)}{" "}
            {new Date(selectedSlot.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" required value={form.bookerName} onChange={field("bookerName")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" required value={form.bookerEmail} onChange={field("bookerEmail")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" type="tel" value={form.bookerPhone} onChange={field("bookerPhone")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Anything we should know? (optional)</Label>
            <Textarea id="notes" rows={3} value={form.notes} onChange={field("notes")} />
          </div>

          {book.error && (
            <p className="text-sm text-red-600">{book.error.message}</p>
          )}

          <Button type="submit" disabled={book.isPending} className="w-full">
            {book.isPending ? "Confirming…" : "Confirm booking"}
          </Button>
        </form>
      )}
    </div>
  );
}
