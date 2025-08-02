'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TicketStatusBadge from '@/components/ticket-status-badge';
import { tickets, users } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, Clock, Star, Ticket } from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user.tsx';

export default function DashboardPage() {
  const { currentUser, isEndUser } = useCurrentUser();

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  const userTickets = tickets.filter(ticket => ticket.requester.id === currentUser?.id);

  const ticketStatusData = tickets.reduce((acc, ticket) => {
    const status = ticket.status;
    const existing = acc.find((item) => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const weeklyTicketData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const count = tickets.filter(
      (ticket) => new Date(ticket.createdAt).toDateString() === date.toDateString()
    ).length;
    return { name: day, tickets: count };
  }).reverse();

  if (isEndUser) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-headline">My Tickets</h1>
         <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Tickets</CardTitle>
            <CardDescription>
              Here are the tickets you've submitted recently.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTickets.length > 0 ? userTickets.map((ticket) => (
                   <TableRow key={ticket.id}>
                    <TableCell>
                       <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium hover:underline">
                        {ticket.subject}
                      </Link>
                    </TableCell>
                     <TableCell className="hidden sm:table-cell">
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {ticket.category.name}
                    </TableCell>
                     <TableCell className="text-right">
                       {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">You have not submitted any tickets.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-muted-foreground">+5 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5 hours</div>
            <p className="text-xs text-muted-foreground">Faster than average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Top 10% percentile</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role !== 'End User').length}</div>
            <p className="text-xs text-muted-foreground">Agents online</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Ticket Volume</CardTitle>
             <CardDescription>Tickets created in the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTicketData}>
                 <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Tickets by Status</CardTitle>
            <CardDescription>Current distribution of all tickets.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={ticketStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="hsl(var(--primary))" label />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>
              A quick look at the latest ticket updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Assignee
                  </TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTickets.map((ticket) => (
                   <TableRow key={ticket.id}>
                    <TableCell>
                       <Link href={`/dashboard/tickets/${ticket.id}`} className="font-medium hover:underline">
                        {ticket.subject}
                      </Link>
                    </TableCell>
                     <TableCell className="hidden sm:table-cell">
                      <TicketStatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {ticket.assignee?.name ?? 'Unassigned'}
                    </TableCell>
                     <TableCell className="text-right">
                       {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
