'use server';
/**
 * @fileOverview Provides cattle advice based on a user's query.
 *
 * - getCattleAdvice - A function that processes the query and returns cattle advice.
 * - GetCattleAdviceInput - The input type for the getCattleAdvice function.
 * - GetCattleAdviceOutput - The return type for the getCattleAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCattleAdviceInputSchema = z.object({
  query: z.string().describe("The farmer's query about their cattle."),
  language: z.string().describe('The language of the query (e.g., Assamese, Hindi, English).'),
});
export type GetCattleAdviceInput = z.infer<typeof GetCattleAdviceInputSchema>;

const GetCattleAdviceOutputSchema = z.object({
  advice: z.string().describe('The advice for the cattle in the user’s native language.'),
});
export type GetCattleAdviceOutput = z.infer<typeof GetCattleAdviceOutputSchema>;

export async function getCattleAdvice(input: GetCattleAdviceInput): Promise<GetCattleAdviceOutput> {
  return getCattleAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cattleAdvicePrompt',
  input: {schema: GetCattleAdviceInputSchema},
  output: {schema: GetCattleAdviceOutputSchema},
  prompt: `You are a veterinary expert specializing in livestock, particularly cattle, in the Indian context.
A farmer has a question about their cattle. Provide a clear, actionable answer in their specified native language.

Language for Response: {{{language}}}
Farmer's Query: {{{query}}}

Provide specific and actionable advice based on the query, covering health, nutrition, or breeding.
For example, if the language is Hindi and the query is "मेरी गाय खाना नहीं खा रही है", your response must also be in Hindi.
Return only the advice in the user's native language.
`,
});

const getCattleAdviceFlow = ai.defineFlow(
  {
    name: 'getCattleAdviceFlow',
    inputSchema: GetCattleAdviceInputSchema,
    outputSchema: GetCattleAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
