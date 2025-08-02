import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/lib/data";
import { cn } from "@/lib/utils";

interface TicketStatusBadgeProps {
  status: Ticket["status"];
}

export default function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const statusClasses = {
    Open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "In Progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Closed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <Badge
      variant="outline"
      className={cn("border-none", statusClasses[status])}
    >
      {status}
    </Badge>
  );
}
