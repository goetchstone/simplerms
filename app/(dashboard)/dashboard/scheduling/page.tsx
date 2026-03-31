// app/(dashboard)/dashboard/scheduling/page.tsx
import { createCachedCaller } from "@/lib/trpc/server";
import { AppointmentList } from "@/components/scheduling/appointment-list";

export default async function SchedulingPage() {
  const caller = await createCachedCaller();
  const result = await caller.scheduling.listAppointments({ page: 1, limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Scheduling</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upcoming and recent appointments.
        </p>
      </div>
      <AppointmentList initialData={result} />
    </div>
  );
}
