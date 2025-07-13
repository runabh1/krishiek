'use server';
/**
 * @fileOverview A weather alert AI agent.
 *
 * - getWeatherAlerts - A function that gets weather alerts for a location.
 * - GetWeatherAlertsInput - The input type for the getWeatherAlerts function.
 * - GetWeatherAlertsOutput - The return type for the getWeatherAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format, addDays } from 'date-fns';

const GetWeatherAlertsInputSchema = z.object({
  location: z.string().describe('The location for which to get weather alerts.'),
});
export type GetWeatherAlertsInput = z.infer<typeof GetWeatherAlertsInputSchema>;

const DailyForecastSchema = z.object({
    day: z.string().describe("The day of the week (e.g., Monday)."),
    icon: z.enum(["CloudDrizzle", "CloudLightning", "Sun", "Cloudy", "Wind"]).describe("An icon name representing the weather condition."),
    title: z.string().describe("A short title for the weather (e.g., 'Light Rain')."),
    description: z.string().describe("A brief description of the forecast in a local language and English."),
});

const AlertSchema = z.object({
    icon: z.enum(["CloudDrizzle", "CloudLightning", "CircleDollarSign", "Sun", "Wind", "Cloudy", "Bug"]).describe("An icon name representing the alert type."),
    title: z.string().describe("The title of the alert."),
    description: z.string().describe("The description of the alert in a local language and English."),
    time: z.string().describe("How long ago the alert was issued (e.g., '2 hours ago')."),
    color: z.string().describe("A Tailwind CSS text color class (e.g., 'text-blue-500').")
});

const GetWeatherAlertsOutputSchema = z.object({
  alerts: z.array(AlertSchema),
  forecast: z.array(DailyForecastSchema).describe("A 5-day weather forecast."),
});
export type GetWeatherAlertsOutput = z.infer<typeof GetWeatherAlertsOutputSchema>;

export async function getWeatherAlerts(input: GetWeatherAlertsInput): Promise<GetWeatherAlertsOutput> {
  return getWeatherAlertsFlow(input);
}

const generateAlertsPrompt = ai.definePrompt({
    name: 'generateAlertsPrompt',
    input: { schema: GetWeatherAlertsInputSchema },
    output: { schema: GetWeatherAlertsOutputSchema },
    prompt: `You are a helpful AI assistant for farmers in India. Your task is to generate a set of realistic, localized alerts and a 5-day weather forecast for the user's location.

Location: {{location}}

Generate the following:
1.  **A 5-day weather forecast:**
    - Start from "Today", then "Tomorrow", then the names of the weekdays.
    - Create realistic weather conditions (e.g., 'Light Rain', 'Sunny', 'Thunderstorm').
    - Assign an appropriate icon for each day: "CloudDrizzle", "CloudLightning", "Sun", "Cloudy", "Wind".
    - Write a brief description in a local language relevant to Assam and in English.

2.  **A list of 2-3 alerts:**
    - The alerts should be a mix of weather warnings, active government subsidies, and potential pest threats relevant to agriculture in Assam.
    - Assign an icon for each alert: "CloudDrizzle" (rain), "CloudLightning" (storms), "CircleDollarSign" (money/subsidy), "Sun" (heat), "Wind", "Cloudy", or "Bug" (pests).
    - Assign a Tailwind CSS text color class for each alert based on its type (e.g., 'text-blue-500' for rain, 'text-green-600' for subsidy, 'text-red-600' for pests).
    - Give a realistic time for when the alert was issued (e.g., '2 hours ago', 'Ongoing').

Format the entire output as a single JSON object matching the GetWeatherAlertsOutput schema.
`,
});


const getWeatherAlertsFlow = ai.defineFlow(
  {
    name: 'getWeatherAlertsFlow',
    inputSchema: GetWeatherAlertsInputSchema,
    outputSchema: GetWeatherAlertsOutputSchema,
  },
  async (input) => {
    const { output } = await generateAlertsPrompt(input);

    if (!output) {
        throw new Error("Failed to generate alerts and forecast from AI.");
    }
    
    return output;
  }
);
