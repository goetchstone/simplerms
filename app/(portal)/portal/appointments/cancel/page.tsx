// app/(portal)/portal/appointments/cancel/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Suspense } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [confirmed, setConfirmed] = useState(false);

  const cancel = trpc.scheduling.cancel.useMutation();

  if (!token) {
    return (
      <div className="text-center text-muted-foreground">
        Invalid cancellation link.
      </div>
    );
  }

  if (cancel.isSuccess) {
    return (
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-semibold">Appointment cancelled</h2>
        <p className="text-muted-foreground">Your appointment has been cancelled. We hope to see you again soon.</p>
      </div>
    );
  }

  if (cancel.error) {
    return (
      <div className="text-center">
        <XCircle className="mx-auto mb-4 h-12 w-12 text-red-400" strokeWidth={1.5} />
        <h2 className="mb-2 text-xl font-semibold">Unable to cancel</h2>
        <p className="text-muted-foreground">{cancel.error.message}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="mb-2 text-xl font-semibold">Cancel appointment?</h2>
      <p className="mb-6 text-muted-foreground">This action cannot be undone.</p>
      <Button
        variant="destructive"
        disabled={cancel.isPending}
        onClick={() => cancel.mutate({ cancelToken: token })}
      >
        {cancel.isPending ? "Cancelling…" : "Yes, cancel my appointment"}
      </Button>
    </div>
  );
}

export default function CancelPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Suspense>
          <CancelContent />
        </Suspense>
      </div>
    </div>
  );
}
