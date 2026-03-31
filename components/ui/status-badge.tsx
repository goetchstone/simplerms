// components/ui/status-badge.tsx
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  // Invoice statuses
  DRAFT: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-50 text-blue-700",
  VIEWED: "bg-purple-50 text-purple-700",
  PARTIAL: "bg-amber-50 text-amber-700",
  PAID: "bg-green-50 text-green-700",
  OVERDUE: "bg-red-50 text-red-700",
  VOID: "bg-gray-100 text-gray-400",
  // Ticket statuses
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  WAITING_ON_CLIENT: "bg-purple-50 text-purple-700",
  RESOLVED: "bg-green-50 text-green-700",
  CLOSED: "bg-gray-100 text-gray-500",
  // Priority
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-orange-50 text-orange-700",
  URGENT: "bg-red-50 text-red-700",
};

const labels: Record<string, string> = {
  IN_PROGRESS: "In progress",
  WAITING_ON_CLIENT: "Waiting on client",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = variants[status] ?? "bg-gray-100 text-gray-600";
  const label = labels[status] ?? status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
