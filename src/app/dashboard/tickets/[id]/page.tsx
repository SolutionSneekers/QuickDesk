'use client'

import Link from "next/link";
import {
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { tickets } from "@/lib/data";
import { notFound } from "next/navigation";
import TicketDetails from "./components/ticket-details";
import TicketConversation from "./components/ticket-conversation";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { isEndUser } = useCurrentUser();
  const ticket = tickets.find((t) => t.id === params.id);

  if (!ticket) {
    notFound();
  }
  
  const isAgent = !isEndUser;

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                    <Link href="/dashboard">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
                    Ticket Details
                </h1>
            </div>
            <TicketDetails ticket={ticket} />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <TicketConversation ticket={ticket} isAgent={isAgent}/>
        </div>
    </div>
  );
}
