// src/ai/flows/generate-ai-farm-reports.ts
'use server';
/**
 * @fileOverview Generates AI-driven farm reports as PDF documents.
 *
 * - generateAiFarmReport - A function that generates an AI farm report.
 * - GenerateAiFarmReportInput - The input type for the generateAiFarmReport function.
 * - GenerateAiFarmReportOutput - The return type for the generateAiFarmReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiFarmReportInputSchema = z.object({
  farmDetails: z.string().describe('Details about the farm, including size, location, and crops grown.'),
  historicalData: z.string().describe('Historical data about the farm, including yields, costs, and weather patterns.'),
  soilQuality: z.string().describe('Information about the soil quality of the farm.'),
  marketTrends: z.string().describe('Current market trends for the crops grown on the farm.'),
});
export type GenerateAiFarmReportInput = z.infer<typeof GenerateAiFarmReportInputSchema>;

const GenerateAiFarmReportOutputSchema = z.object({
  report: z.string().describe('The generated AI farm report in PDF format (base64 encoded).'),
});
export type GenerateAiFarmReportOutput = z.infer<typeof GenerateAiFarmReportOutputSchema>;

export async function generateAiFarmReport(input: GenerateAiFarmReportInput): Promise<GenerateAiFarmReportOutput> {
  return generateAiFarmReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiFarmReportPrompt',
  input: {schema: GenerateAiFarmReportInputSchema},
  output: {schema: GenerateAiFarmReportOutputSchema},
  prompt: `You are an AI assistant that generates farm reports in PDF format based on the provided farm details, historical data, soil quality, and market trends.

  Farm Details: {{{farmDetails}}}
  Historical Data: {{{historicalData}}}
  Soil Quality: {{{soilQuality}}}
  Market Trends: {{{marketTrends}}}

  Based on the above information, generate a comprehensive farm report that includes insights into farm health, productivity, and potential issues.
  Return the report as a PDF in base64 encoded format.
  `,
});

const generateAiFarmReportFlow = ai.defineFlow(
  {
    name: 'generateAiFarmReportFlow',
    inputSchema: GenerateAiFarmReportInputSchema,
    outputSchema: GenerateAiFarmReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
