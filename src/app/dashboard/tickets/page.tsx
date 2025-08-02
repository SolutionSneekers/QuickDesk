'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import TicketList from '@/components/ticket-list';
import { tickets, Ticket } from '@/lib/data';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function AllTicketsPage() {
  const { currentUser, isEndUser } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'All'>('All');

  const ticketsToShow = isEndUser
    ? tickets.filter(ticket => ticket.requester.id === currentUser?.id)
    : tickets;

  const filteredTickets = ticketsToShow
    .filter((ticket) => {
      if (statusFilter === 'All') return true;
      return ticket.status === statusFilter;
    })
    .filter((ticket) =>
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const openTickets = filteredTickets.filter((ticket) => ticket.status === "Open");
  const inProgressTickets = filteredTickets.filter(
    (ticket) => ticket.status === "In Progress"
  );
  const resolvedTickets = filteredTickets.filter(
    (ticket) => ticket.status === "Resolved"
  );
   const closedTickets = filteredTickets.filter(
    (ticket) => ticket.status === "Closed"
  );


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">
          {isEndUser ? 'My Tickets' : 'All Tickets'}
        </h1>
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
           <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <div>
                 <CardTitle className="font-headline">Ticket Overview</CardTitle>
                <CardDescription>
                  {isEndUser ? 'A list of all tickets you have submitted.' : 'A list of all tickets in the system.'}
                </CardDescription>
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search by subject..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="All" onValueChange={(value) => setStatusFilter(value as any)}>
            <div className="px-6">
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Open">Open</TabsTrigger>
                    <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                    <TabsTrigger value="Resolved">Resolved</TabsTrigger>
                    <TabsTrigger value="Closed">Closed</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="All" className="m-0">
              <TicketList tickets={filteredTickets} />
            </TabsContent>
            <TabsContent value="Open" className="m-0">
              <TicketList tickets={openTickets} />
            </TabsContent>
            <TabsContent value="In Progress" className="m-0">
              <TicketList tickets={inProgressTickets} />
            </TabsContent>
            <TabsContent value="Resolved" className="m-0">
              <TicketList tickets={resolvedTickets} />
            </TabsContent>
             <TabsContent value="Closed" className="m-0">
              <TicketList tickets={closedTickets} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
