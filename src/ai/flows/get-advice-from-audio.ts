'use server';

/**
 * @fileOverview Provides crop advice by transcribing audio input and then generating a response.
 *
 * - getAdviceFromAudio - A function that handles the entire audio -> text -> advice process.
 * - GetAdviceFromAudioInput - The input type for the function.
 * - GetAdviceFromAudioOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAdviceFromAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A voice query from the farmer, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The native language of the farmer (e.g., Assamese, Hindi, English).'),
});
export type GetAdviceFromAudioInput = z.infer<typeof GetAdviceFromAudioInputSchema>;

const GetAdviceFromAudioOutputSchema = z.object({
  transcript: z.string().nullable().describe("The transcribed text from the farmer's audio query."),
  advice: z.string().nullable().describe('The generated crop advice in the user’s native language.'),
});
export type GetAdviceFromAudioOutput = z.infer<typeof GetAdviceFromAudioOutputSchema>;


export async function getAdviceFromAudio(input: GetAdviceFromAudioInput): Promise<GetAdviceFromAudioOutput> {
  return getAdviceFromAudioFlow(input);
}

const getAdviceFromAudioFlow = ai.defineFlow(
  {
    name: 'getAdviceFromAudioFlow',
    inputSchema: GetAdviceFromAudioInputSchema,
    outputSchema: GetAdviceFromAudioOutputSchema,
  },
  async (input) => {
    
    const { output } = await ai.generate({
        prompt: [
            { text: `You are an agricultural expert providing crop advice to farmers in India.` },
            { text: `The user's query is in ${input.language}. First, transcribe the attached audio. Second, based on the transcription, provide a clear, actionable answer in ${input.language}.` },
            { text: `Return a single JSON object with two keys: "transcript" containing the exact text you heard, and "advice" containing your expert reply.`},
            { media: { url: input.audioDataUri } }
        ],
        output: {
            schema: GetAdviceFromAudioOutputSchema,
            format: 'json'
        },
        model: 'googleai/gemini-2.5-flash'
    });

    if (!output) {
        throw new Error("Failed to get advice from audio.");
    }
    
    return output;
  }
);
