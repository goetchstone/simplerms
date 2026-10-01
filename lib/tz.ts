// lib/tz.ts

/**
 * Weekday (0=Sun..6=Sat) of an instant *in a given IANA timezone*.
 *
 * StaffAvailability stores `dayOfWeek` as a local weekday, so an 8 PM ET slot —
 * which is already the next day in UTC — must resolve to its ET weekday. Using
 * Date.getDay() (the server/UTC weekday) instead silently shifts evening slots
 * to the wrong day, which false-rejects bookings the slot picker offered.
 */
export function weekdayInTz(date: Date, tz: string): number {
  const short = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(short);
}

// Browser-supplied zone names reach Intl at email time; an invalid one throws
// there, after the booking is already saved.
export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export function formatDayInTz(date: Date, tz: string): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: tz,
  });
}

// The zone label ("EDT") keeps a reader in another timezone from arriving an
// hour off.
export function formatTimeInTz(date: Date, tz: string): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
    timeZoneName: "short",
  });
}

export function formatInTz(date: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
    timeZoneName: "short",
  }).format(date);
}
