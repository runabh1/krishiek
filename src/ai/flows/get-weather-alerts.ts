'use server';
/**
 * @fileOverview A weather alert AI agent that now includes real-time news.
 *
 * - getWeatherAlerts - A function that gets weather alerts and news for a location.
 * - GetWeatherAlertsInput - The input type for the getWeatherAlerts function.
 * - GetWeatherAlertsOutput - The return type for the getWeatherAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
    icon: z.enum(["CloudDrizzle", "CloudLightning", "CircleDollarSign", "Sun", "Wind", "Cloudy", "Bug", "Newspaper"]).describe("An icon name representing the alert type."),
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

// The prompt is now focused on generating weather and non-news alerts.
const generateAlertsPrompt = ai.definePrompt({
    name: 'generateAlertsPrompt',
    input: { schema: GetWeatherAlertsInputSchema },
    output: { schema: GetWeatherAlertsOutputSchema }, // The output schema still includes all alerts.
    prompt: `You are a helpful AI assistant for farmers in India. Your task is to generate a set of realistic, localized alerts and a 5-day weather forecast for the user's location.

Location: {{location}}

Generate the following:
1.  **A 5-day weather forecast:**
    - Start from "Today", then "Tomorrow", then the names of the weekdays.
    - Create realistic weather conditions for Assam (e.g., 'Light Rain', 'Sunny', 'Thunderstorm').
    - Assign an appropriate icon for each day: "CloudDrizzle", "CloudLightning", "Sun", "Cloudy", "Wind".
    - Write a brief description in a local language relevant to Assam and in English.

2.  **A list of 2-3 alerts (excluding news):**
    - The alerts should be a mix of weather warnings, active government subsidies, and potential pest threats relevant to agriculture in Assam.
    - Assign an icon for each alert: "CloudDrizzle" (rain), "CloudLightning" (storms), "CircleDollarSign" (money/subsidy), "Sun" (heat), "Wind", "Cloudy", or "Bug" (pests).
    - Assign a Tailwind CSS text color class for each alert based on its type.
    - Give a realistic time for when the alert was issued (e.g., '2 hours ago', 'Ongoing').

Format the entire output as a single JSON object. The 'alerts' array in your output will be combined with real-time news alerts.
`,
});

const getWeatherAlertsFlow = ai.defineFlow(
  {
    name: 'getWeatherAlertsFlow',
    inputSchema: GetWeatherAlertsInputSchema,
    outputSchema: GetWeatherAlertsOutputSchema,
  },
  async (input) => {
    const newsApiKey = 'd0f3eedcd7e2449898fde5a4b9eb7b40';
    const query = 'agriculture pests schemes diseases Assam';
    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${newsApiKey}&language=en&sortBy=publishedAt&pageSize=3`;

    let newsAlerts: z.infer<typeof AlertSchema>[] = [];

    try {
        const newsResponse = await fetch(newsUrl);
        if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            newsAlerts = newsData.articles.map((article: any) => ({
                icon: "Newspaper",
                title: article.title,
                description: article.description || 'No description available.',
                time: new Date(article.publishedAt).toLocaleDateString(),
                color: 'text-gray-600',
            }));
        } else {
          console.error('News API request failed:', newsResponse.statusText);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }

    // Generate weather and other alerts from the AI.
    const { output: aiOutput } = await generateAlertsPrompt(input);

    if (!aiOutput) {
        throw new Error("Failed to generate alerts and forecast from AI.");
    }

    // Combine the real-time news alerts with the AI-generated alerts.
    const combinedAlerts = [...newsAlerts, ...aiOutput.alerts];
    
    return {
        alerts: combinedAlerts,
        forecast: aiOutput.forecast,
    };
  }
);

export async function getWeatherAlerts(input: GetWeatherAlertsInput): Promise<GetWeatherAlertsOutput> {
  return getWeatherAlertsFlow(input);
}
