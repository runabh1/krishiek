// src/ai/flows/voice-based-form-filler.ts
'use server';

/**
 * @fileOverview A voice-based form filler AI agent.
 *
 * - voiceBasedFormFiller - A function that handles the form filling process using voice input.
 * - VoiceBasedFormFillerInput - The input type for the voiceBasedFormFiller function.
 * - VoiceBasedFormFillerOutput - The return type for the voiceBasedFormFiller function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceBasedFormFillerInputSchema = z.object({
  voiceQuery: z
    .string()
    .describe("The farmer's voice query in Assamese, Hindi, or other local language requesting to fill a specific government form."),
  formName: z.string().describe('The name of the government form to be filled.'),
});
export type VoiceBasedFormFillerInput = z.infer<typeof VoiceBasedFormFillerInputSchema>;

const VoiceBasedFormFillerOutputSchema = z.object({
  filledFormData: z.record(z.string(), z.string()).describe('A JSON object containing the filled form data, with field names as keys and extracted values as strings.'),
  confirmationMessage: z.string().describe('A confirmation message to be displayed to the user, summarizing the filled form data.'),
});
export type VoiceBasedFormFillerOutput = z.infer<typeof VoiceBasedFormFillerOutputSchema>;

export async function voiceBasedFormFiller(input: VoiceBasedFormFillerInput): Promise<VoiceBasedFormFillerOutput> {
  return voiceBasedFormFillerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceBasedFormFillerPrompt',
  input: {schema: VoiceBasedFormFillerInputSchema},
  output: {schema: VoiceBasedFormFillerOutputSchema},
  prompt: `You are an AI assistant specialized in filling government forms based on voice input from farmers.

  The farmer will provide a voice query and the name of the form they want to fill. Your task is to extract the necessary information from the voice query and generate a JSON object containing the filled form data.

  Form Name: {{{formName}}}
  Voice Query: {{{voiceQuery}}}

  Example Output:
  {
    "field1": "value1",
    "field2": "value2",
    ...
  }

  Based on the extracted data, create a confirmation message summarizing the filled form data to be displayed to the user.

  Output the filled form data as a JSON object and the confirmation message as a string.
  Make sure the filled form data contains all fields required for form specified by formName, and the confirmation message confirms the extracted data.
  `,
});

const voiceBasedFormFillerFlow = ai.defineFlow(
  {
    name: 'voiceBasedFormFillerFlow',
    inputSchema: VoiceBasedFormFillerInputSchema,
    outputSchema: VoiceBasedFormFillerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
