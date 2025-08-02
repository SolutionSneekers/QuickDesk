
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Ticket } from "@/lib/data";
import TicketListItem from "./ticket-list-item";

interface TicketListProps {
  tickets: any[]; // Using any because the shape will be enriched
}

export default function TicketList({ tickets }: TicketListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden sm:table-cell">Category</TableHead>
          <TableHead className="hidden md:table-cell">Requester</TableHead>
          <TableHead className="text-right">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <TicketListItem key={ticket.id} ticket={ticket} />
            ))
        ) : (
            <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                    No tickets found.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
