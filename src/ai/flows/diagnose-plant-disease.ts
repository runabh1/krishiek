'use server';

/**
 * @fileOverview A plant disease diagnosis AI agent.
 *
 * - diagnosePlantDisease - A function that handles the plant disease diagnosis process.
 * - DiagnosePlantDiseaseInput - The input type for the diagnosePlantDisease function.
 * - DiagnosePlantDiseaseOutput - The return type for the diagnosePlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a diseased plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  nativeLanguage: z.string().describe('The native language of the farmer.'),
});
export type DiagnosePlantDiseaseInput = z.infer<typeof DiagnosePlantDiseaseInputSchema>;

const DiagnosePlantDiseaseOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease.'),
  description: z.string().describe('A description of the disease.'),
  stepsToFix: z.string().describe('Steps to fix the disease in the native language.'),
  pesticideName: z.string().describe('The recommended pesticide to use.'),
  audioReplyUrl: z.string().optional().describe('Optional audio reply URL in the native language.'),
});
export type DiagnosePlantDiseaseOutput = z.infer<typeof DiagnosePlantDiseaseOutputSchema>;

export async function diagnosePlantDisease(input: DiagnosePlantDiseaseInput): Promise<DiagnosePlantDiseaseOutput> {
  return diagnosePlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantDiseasePrompt',
  input: {schema: DiagnosePlantDiseaseInputSchema},
  output: {schema: DiagnosePlantDiseaseOutputSchema},
  prompt: `You are an expert in plant pathology and will identify the disease in the
photo and suggest treatments in the user's native language.

Analyze the image and provide the following information:

1.  diseaseName: The common name of the plant disease.
2.  description: A detailed description of the disease.
3.  stepsToFix:  Steps the farmer can take to treat the disease, explained clearly in {{nativeLanguage}}.
4.  pesticideName: The name of the recommended pesticide for this disease.

Here is the photo of the diseased plant:

{{media url=photoDataUri}}
`,
});

const diagnosePlantDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnosePlantDiseaseFlow',
    inputSchema: DiagnosePlantDiseaseInputSchema,
    outputSchema: DiagnosePlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
