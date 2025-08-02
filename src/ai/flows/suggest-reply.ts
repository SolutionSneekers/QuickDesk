// This file holds the Genkit flow for suggesting replies to support agents.
//
//  - suggestReply - A function that suggests replies to agents.
//  - SuggestReplyInput - The input type for the suggestReply function.
//  - SuggestReplyOutput - The return type for the suggestReply function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReplyInputSchema = z.object({
  ticketDescription: z.string().describe('The description of the support ticket.'),
  customerMessage: z.string().describe('The latest message from the customer.'),
  agentMessages: z.array(z.string()).describe('Previous messages from the agent.'),
});
export type SuggestReplyInput = z.infer<typeof SuggestReplyInputSchema>;

const SuggestReplyOutputSchema = z.object({
  suggestedReply: z.string().describe('The AI-suggested reply for the agent.'),
});
export type SuggestReplyOutput = z.infer<typeof SuggestReplyOutputSchema>;

export async function suggestReply(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
  return suggestReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReplyPrompt',
  input: {schema: SuggestReplyInputSchema},
  output: {schema: SuggestReplyOutputSchema},
  prompt: `You are a helpful AI assistant designed to suggest replies for support agents.

  Given the following ticket description, the latest customer message, and previous agent messages, suggest a reply that is helpful, professional, and concise.

  Ticket Description: {{{ticketDescription}}}
  Latest Customer Message: {{{customerMessage}}}
  Previous Agent Messages: {{#each agentMessages}}{{{this}}}\n{{/each}}

  Suggested Reply:`, 
});

const suggestReplyFlow = ai.defineFlow(
  {
    name: 'suggestReplyFlow',
    inputSchema: SuggestReplyInputSchema,
    outputSchema: SuggestReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
