import Link from "next/link";
import { PlusCircle, File } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TicketList from "@/components/ticket-list";
import { tickets } from "@/lib/data";

export default function DashboardPage() {
  const openTickets = tickets.filter((ticket) => ticket.status === "Open");
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  );
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved"
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">Tickets</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" asChild>
            <Link href="/dashboard/tickets/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Ticket
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        <Card className="mt-4">
          <CardContent className="p-0">
            <TabsContent value="all" className="m-0">
              <TicketList tickets={tickets} />
            </TabsContent>
            <TabsContent value="open" className="m-0">
              <TicketList tickets={openTickets} />
            </TabsContent>
            <TabsContent value="in-progress" className="m-0">
              <TicketList tickets={inProgressTickets} />
            </TabsContent>
            <TabsContent value="resolved" className="m-0">
              <TicketList tickets={resolvedTickets} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </>
  );
}
