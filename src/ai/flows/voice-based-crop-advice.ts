// src/ai/flows/voice-based-crop-advice.ts
'use server';
/**
 * @fileOverview Provides crop advice based on voice input in the user's native language.
 *
 * - getCropAdvice - A function that processes voice input and returns crop advice.
 * - GetCropAdviceInput - The input type for the getCropAdvice function.
 * - GetCropAdviceOutput - The return type for the getCropAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCropAdviceInputSchema = z.object({
  voiceQuery: z.string().describe('The voice query from the farmer in their native language.'),
  language: z.string().describe('The language of the voice query (e.g., Assamese, Hindi).'),
});
export type GetCropAdviceInput = z.infer<typeof GetCropAdviceInputSchema>;

const GetCropAdviceOutputSchema = z.object({
  advice: z.string().describe('The crop advice in the user’s native language.'),
});
export type GetCropAdviceOutput = z.infer<typeof GetCropAdviceOutputSchema>;

export async function getCropAdvice(input: GetCropAdviceInput): Promise<GetCropAdviceOutput> {
  return getCropAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropAdvicePrompt',
  input: {schema: GetCropAdviceInputSchema},
  output: {schema: GetCropAdviceOutputSchema},
  prompt: `You are an agricultural expert providing crop advice to farmers in India.
  A farmer has a question in their native language. Your task is to provide a clear, actionable answer in that same language.

  Language for Response: {{{language}}}
  Farmer's Query: {{{voiceQuery}}}

  Analyze the query and provide specific advice. For example, if the query is "मेरे धान के खेत में कीट लग गए हैं, क्या करूँ?", your response should be in Hindi with concrete steps.
  Return only the advice in the specified language.
  `,
});

const getCropAdviceFlow = ai.defineFlow(
  {
    name: 'getCropAdviceFlow',
    inputSchema: GetCropAdviceInputSchema,
    outputSchema: GetCropAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
