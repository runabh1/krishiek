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
    
    // Step 1: Transcribe the audio
    const { output: transcript } = await ai.generate({
        prompt: [
            { text: `Transcribe the following audio from a farmer speaking in ${input.language}.` },
            { media: { url: input.audioDataUri } }
        ],
    });

    if (!transcript) {
        throw new Error("Failed to transcribe audio.");
    }

    // Step 2: Use the transcript to get advice
    const { output: advice } = await ai.generate({
        prompt: `You are an agricultural expert providing crop advice to farmers in India.
        A farmer has a question in their native language. Your task is to provide a clear, actionable answer in that same language.

        Language for Response: ${input.language}
        Farmer's Query: "${transcript}"

        Analyze the query and provide specific advice. For example, if the query is "मेरे धान के खेत में कीट लग गए हैं, क्या करूँ?", your response should be in Hindi with concrete steps.
        Return only the advice in the specified language.
        `
    });

    if (!advice) {
        throw new Error("Failed to generate advice from the transcript.");
    }
    
    return {
      transcript: transcript,
      advice: advice,
    };
  }
);
