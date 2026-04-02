// components/site/booking-flow.tsx
"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
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
      className={`border px-4 py-2.5 text-sm font-medium transition-colors ${
        selected
          ? "border-conviction bg-conviction text-midnight"
          : "border-bone/20 bg-bone/5 text-bone/70 hover:border-conviction/50"
      }`}
      style={{ borderRadius: "2px" }}
    >
      {time}
    </button>
  );
}

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
      <div className="border border-clear/30 bg-clear/10 p-8 text-center" style={{ borderRadius: "2px" }}>
        <CheckCircle className="mx-auto mb-4 h-10 w-10 text-clear" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-medium text-bone">You&apos;re booked!</h2>
        <p className="mb-1 text-bone/60">
          <span className="font-medium text-bone">{serviceName}</span> on{" "}
          <span className="font-medium text-bone">{formatDate(appt.startsAt)}</span>
        </p>
        <p className="text-sm text-bone/40">
          Confirmation sent to {form.bookerEmail}. Use your email link to cancel if needed.
        </p>
      </div>
    );
  }

  const inputClass = "w-full border border-bone/20 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-bone/30 focus:border-conviction focus:outline-none";
  const labelClass = "text-sm font-medium text-bone/70";

  return (
    <div className="space-y-6">
      {step === "date" && (
        <div>
          <p className="mb-4 text-sm font-medium text-bone/70">Select a date</p>
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
                  className={`flex flex-col items-center border px-2 py-3 text-center transition-colors ${
                    isSelected
                      ? "border-conviction bg-conviction text-midnight"
                      : "border-bone/20 bg-bone/5 text-bone/70 hover:border-conviction/50"
                  }`}
                  style={{ borderRadius: "2px" }}
                >
                  <span className="text-xs font-medium uppercase opacity-60">
                    {d.toLocaleDateString([], { weekday: "short" })}
                  </span>
                  <span className="text-lg font-medium">{d.getDate()}</span>
                  <span className="text-xs opacity-60">
                    {d.toLocaleDateString([], { month: "short" })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === "slot" && selectedDate && (
        <div>
          <button
            type="button"
            onClick={() => setStep("date")}
            className="mb-4 flex items-center gap-1 text-sm text-bone/40 hover:text-conviction"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <p className="mb-4 text-sm font-medium text-bone/70">
            Available times on{" "}
            <span className="text-bone">{formatDate(selectedDate)}</span>
          </p>

          {isFetching ? (
            <p className="text-sm text-bone/30">Loading...</p>
          ) : !slots || slots.length === 0 ? (
            <div className="border border-bone/10 bg-slate-brand/20 p-6 text-center text-sm text-bone/50" style={{ borderRadius: "2px" }}>
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
            <button
              className="mt-6 inline-flex items-center gap-1 bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
              onClick={() => setStep("details")}
              style={{ borderRadius: "2px" }}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {step === "details" && selectedSlot && (
        <form onSubmit={handleBook} className="space-y-5">
          <button
            type="button"
            onClick={() => setStep("slot")}
            className="flex items-center gap-1 text-sm text-bone/40 hover:text-conviction"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="border border-bone/10 bg-slate-brand/20 px-4 py-3 text-sm" style={{ borderRadius: "2px" }}>
            <span className="font-medium text-bone">{serviceName}</span>
            {" — "}
            <span className="text-bone/60">
              {formatDate(selectedSlot.startsAt)}{" "}
              {new Date(selectedSlot.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="name" className={labelClass}>Full name *</label>
              <input id="name" required value={form.bookerName} onChange={field("bookerName")} className={inputClass} style={{ borderRadius: "2px" }} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className={labelClass}>Email *</label>
              <input id="email" type="email" required value={form.bookerEmail} onChange={field("bookerEmail")} className={inputClass} style={{ borderRadius: "2px" }} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className={labelClass}>Phone (optional)</label>
            <input id="phone" type="tel" value={form.bookerPhone} onChange={field("bookerPhone")} className={inputClass} style={{ borderRadius: "2px" }} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="notes" className={labelClass}>Anything we should know? (optional)</label>
            <textarea id="notes" rows={3} value={form.notes} onChange={field("notes")} className={`${inputClass} resize-none`} style={{ borderRadius: "2px" }} />
          </div>

          {book.error && (
            <p className="text-sm text-alert">{book.error.message}</p>
          )}

          <button
            type="submit"
            disabled={book.isPending}
            className="w-full bg-conviction px-6 py-3 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90 disabled:opacity-50"
            style={{ borderRadius: "2px" }}
          >
            {book.isPending ? "Confirming..." : "Confirm booking"}
          </button>
        </form>
      )}
    </div>
  );
}
