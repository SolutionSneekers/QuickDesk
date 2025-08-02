
"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { suggestReply, SuggestReplyInput } from "@/ai/flows/suggest-reply";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIReplySuggester({ ticket }: { ticket: any }) {
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestReply = async () => {
    setIsLoading(true);
    setSuggestion("");
    try {
      const customerMessages = ticket.comments?.filter((c: any) => !c.isAgent) || [];
      const agentMessages = ticket.comments?.filter((c: any) => c.isAgent).map((c: any) => c.content) || [];

      const input: SuggestReplyInput = {
        ticketDescription: ticket.description,
        customerMessage: customerMessages.length > 0 ? customerMessages[customerMessages.length - 1].content : "No recent customer message.",
        agentMessages: agentMessages,
      };

      const result = await suggestReply(input);
      setSuggestion(result.suggestedReply);
    } catch (error) {
      console.error("Failed to suggest reply:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate a suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleSuggestReply} disabled={isLoading} variant="outline" size="sm">
        <Sparkles className="mr-2 h-4 w-4" />
        {isLoading ? "Generating..." : "Suggest Reply with AI"}
      </Button>

      {isLoading && (
         <Card className="border-dashed">
            <CardHeader>
                <Skeleton className="h-5 w-3/5" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </CardContent>
         </Card>
      )}

      {suggestion && !isLoading && (
        <Card className="bg-accent/50 border-dashed">
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> AI Suggestion
                </CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-sm text-foreground">{suggestion}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" size="sm" onClick={() => setSuggestion('')}>Discard</Button>
                    <Button variant="default" size="sm" onClick={() => {
                        const replyTextarea = document.querySelector('textarea[placeholder="Type your reply here..."]') as HTMLTextAreaElement;
                        if(replyTextarea) {
                            replyTextarea.value = suggestion;
                        }
                         toast({ title: "Suggestion applied." });
                    }}>Use this reply</Button>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
