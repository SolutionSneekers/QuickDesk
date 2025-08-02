import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Ticket, Comment as CommentType } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import AIReplySuggester from "./ai-reply-suggester";

function Comment({ comment }: { comment: CommentType }) {
  return (
    <div className={cn("flex items-start gap-4", { "justify-end": comment.isAgent })}>
      {!comment.isAgent && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-xs md:max-w-md lg:max-w-lg", { "text-right": comment.isAgent })}>
        <div className={cn("rounded-lg p-3", comment.isAgent ? "bg-primary text-primary-foreground" : "bg-muted")}>
          <p className="text-sm">{comment.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {comment.author.name} • {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
        </p>
      </div>
       {comment.isAgent && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export default function TicketConversation({ ticket, isAgent }: { ticket: Ticket; isAgent: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="font-headline">Conversation</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsUp className="h-4 w-4" />
                </Button>
                <span>{ticket.upvotes}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThumbsDown className="h-4 w-4" />
                </Button>
                 <span>{ticket.downvotes}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {ticket.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {ticket.comments.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No comments yet.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full space-y-4">
          {isAgent && <AIReplySuggester ticket={ticket} />}
          <div className="relative">
            <Textarea placeholder="Type your reply here..." className="pr-16" rows={3}/>
            <Button type="submit" size="icon" className="absolute top-1/2 -translate-y-1/2 right-3">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
