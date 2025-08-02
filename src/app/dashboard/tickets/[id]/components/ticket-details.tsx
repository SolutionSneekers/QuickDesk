import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Ticket } from "@/lib/data";
import { format } from "date-fns";
import TicketStatusBadge from "@/components/ticket-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TicketDetails({ ticket }: { ticket: Ticket }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="font-headline">{ticket.subject}</CardTitle>
        <CardDescription>
          Ticket #{ticket.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground">{ticket.description}</div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium">Status</p>
                    <TicketStatusBadge status={ticket.status} />
                </div>
                 <div>
                    <p className="font-medium">Category</p>
                    <p className="text-muted-foreground">{ticket.category.name}</p>
                </div>
                 <div>
                    <p className="font-medium">Created</p>
                    <p className="text-muted-foreground">{format(new Date(ticket.createdAt), 'PPpp')}</p>
                </div>
                 <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-muted-foreground">{format(new Date(ticket.updatedAt), 'PPpp')}</p>
                </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
                <p className="font-medium">Requester</p>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={ticket.requester.avatar} />
                        <AvatarFallback>{ticket.requester.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p>{ticket.requester.name}</p>
                        <p className="text-xs text-muted-foreground">{ticket.requester.email}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <p className="font-medium">Assignee</p>
                {ticket.assignee ? (
                     <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={ticket.assignee.avatar} />
                            <AvatarFallback>{ticket.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{ticket.assignee.name}</p>
                            <p className="text-xs text-muted-foreground">{ticket.assignee.email}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Unassigned</p>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
