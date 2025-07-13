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

const GetWeatherAlertsOutputSchema = z.object({
  alerts: z.array(z.object({
    icon: z.enum(["CloudDrizzle", "CloudLightning", "CircleDollarSign", "Sun", "Wind", "Cloudy"]).describe("An icon name representing the alert type."),
    title: z.string().describe("The title of the alert."),
    description: z.string().describe("The description of the alert in a local language and English."),
    time: z.string().describe("How long ago the alert was issued (e.g., '2 hours ago')."),
    color: z.string().describe("A Tailwind CSS text color class (e.g., 'text-blue-500').")
  })),
  forecast: z.array(DailyForecastSchema).describe("A 5-day weather forecast."),
});
export type GetWeatherAlertsOutput = z.infer<typeof GetWeatherAlertsOutputSchema>;

const getCurrentWeatherTool = ai.defineTool({
    name: 'getCurrentWeather',
    description: 'Get the current weather and a 5-day forecast for a given location.',
    inputSchema: z.object({ location: z.string() }),
    outputSchema: z.object({
        alerts: z.array(z.object({
            title: z.string(),
            description: z.string(),
            time: z.string(),
        })),
        forecast: z.array(z.object({
            day: z.string(),
            condition: z.string(),
            description: z.string(),
        }))
    }),
}, async ({ location }) => {
    // In a real app, this would call a weather API.
    // Here, we'll return mock data.
    return {
        alerts: [
            {
                title: "Pest Outbreak Warning",
                description: "कीटों का प्रकोप: आपके क्षेत्र में धान के तना छेदक का खतरा बढ़ गया है। (Pest Outbreak: Rice stem borer threat has increased in your area.)",
                time: "1 day ago",
            },
            {
                title: "Subsidy Deadline",
                description: "PM-Kisan: eKYC জমা দিয়াৰ অন্তিম তাৰিখ ৩১ জুলাই। (PM-Kisan: Last date to submit eKYC is 31st July.)",
                time: "3 days ago",
            },
        ],
        forecast: [
            { day: "Today", condition: "Light Rain", description: "আজি গুৱাহাটীত পাতল বৰষুণৰ সম্ভাৱনা আছে। (Light rain expected in Guwahati today.)" },
            { day: "Tomorrow", condition: "Thunderstorm", description: "কালি বজ্ৰপাতৰ সৈতে ধুমুহা আহিব পাৰে। (Thunderstorms expected tomorrow.)" },
            { day: "Wednesday", condition: "Sunny", description: "বুধবাৰে বতৰ ফৰকাল থাকিব। (The weather will be clear on Wednesday.)" },
            { day: "Thursday", condition: "Cloudy", description: "বৃহস্পতিবাৰে ডাৱৰীয়া বতৰ থাকিব। (It will be cloudy on Thursday.)" },
            { day: "Friday", condition: "Windy", description: "শুকুৰবাৰে বতাহ বলি থাকিব। (It will be windy on Friday.)" },
        ]
    };
});


export async function getWeatherAlerts(input: GetWeatherAlertsInput): Promise<GetWeatherAlertsOutput> {
  return getWeatherAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherAlertsPrompt',
  input: {schema: GetWeatherAlertsInputSchema},
  output: {schema: GetWeatherAlertsOutputSchema},
  tools: [getCurrentWeatherTool],
  prompt: `You are a helpful assistant for farmers. Get the weather alerts and a 5-day forecast for the specified location using the available tool.

Location: {{{location}}}

Based on the weather data, determine the appropriate icon and Tailwind CSS color for each alert.
- For rain or drizzle, use "CloudDrizzle" and "text-blue-500".
- For thunderstorms or lightning, use "CloudLightning" and "text-yellow-600".
- For subsidy or financial news, use "CircleDollarSign" and "text-green-600".
- For sunny weather, use "Sun".
- For windy weather, use "Wind".
- For cloudy weather, use "Cloudy".

Format the output according to the GetWeatherAlertsOutput schema.
`,
});

const getWeatherAlertsFlow = ai.defineFlow(
  {
    name: 'getWeatherAlertsFlow',
    inputSchema: GetWeatherAlertsInputSchema,
    outputSchema: GetWeatherAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
