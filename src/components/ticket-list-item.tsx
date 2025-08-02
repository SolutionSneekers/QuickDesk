
import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Ticket } from "@/lib/data";
import TicketStatusBadge from "./ticket-status-badge";
import { formatDistanceToNow } from "date-fns";

interface TicketListItemProps {
  ticket: any; // Enriched ticket
}

export default function TicketListItem({ ticket }: TicketListItemProps) {
  return (
    <TableRow className="bg-background">
      <TableCell>
        <Link
          href={`/dashboard/tickets/${ticket.id}`}
          className="font-medium hover:underline"
        >
          {ticket.subject}
        </Link>
        <div className="hidden text-sm text-muted-foreground md:inline-block ml-2">
          #{ticket.id}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <TicketStatusBadge status={ticket.status} />
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {ticket.category?.name || 'N/A'}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {ticket.requester?.name || 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
      </TableCell>
    </TableRow>
  );
}
