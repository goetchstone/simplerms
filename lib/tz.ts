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
