'use server';

/**
 * @fileOverview An animal disease diagnosis AI agent.
 *
 * - diagnoseAnimalDisease - A function that handles the animal disease diagnosis process.
 * - DiagnoseAnimalDiseaseInput - The input type for the diagnoseAnimalDisease function.
 * - DiagnoseAnimalDiseaseOutput - The return type for the diagnoseAnimalDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseAnimalDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a diseased animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  nativeLanguage: z.string().describe('The native language of the farmer.'),
});
export type DiagnoseAnimalDiseaseInput = z.infer<typeof DiagnoseAnimalDiseaseInputSchema>;

const DiagnoseAnimalDiseaseOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease.'),
  description: z.string().describe('A description of the disease.'),
  stepsToFix: z.string().describe('Steps to fix the disease in the native language.'),
  medicineName: z.string().describe('The recommended medicine to use.'),
});
export type DiagnoseAnimalDiseaseOutput = z.infer<typeof DiagnoseAnimalDiseaseOutputSchema>;

export async function diagnoseAnimalDisease(input: DiagnoseAnimalDiseaseInput): Promise<DiagnoseAnimalDiseaseOutput> {
  return diagnoseAnimalDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseAnimalDiseasePrompt',
  input: {schema: DiagnoseAnimalDiseaseInputSchema},
  output: {schema: DiagnoseAnimalDiseaseOutputSchema},
  prompt: `You are an expert veterinarian and will identify the disease in the
animal from the photo and suggest treatments in the user's native language.

Analyze the image and provide the following information:

1.  diseaseName: The common name of the animal disease.
2.  description: A detailed description of the disease, its symptoms, and causes.
3.  stepsToFix:  Steps the farmer can take to treat the disease, including care and isolation procedures, explained clearly in {{nativeLanguage}}.
4.  medicineName: The name of the recommended medicine or veterinary drug for this disease.

Here is the photo of the diseased animal:

{{media url=photoDataUri}}
`,
});

const diagnoseAnimalDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseAnimalDiseaseFlow',
    inputSchema: DiagnoseAnimalDiseaseInputSchema,
    outputSchema: DiagnoseAnimalDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
