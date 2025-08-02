import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TicketList from "@/components/ticket-list";
import { tickets } from "@/lib/data";

export default function AllTicketsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-headline">All Tickets</h1>
        <Button size="sm" className="h-8 gap-1" asChild>
          <Link href="/dashboard/tickets/new">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              New Ticket
            </span>
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Ticket Overview</CardTitle>
          <CardDescription>A list of all tickets in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <TicketList tickets={tickets} />
        </CardContent>
      </Card>
    </>
  );
}
