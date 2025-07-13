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

const mockAlerts = [
    {
        title: "Pest Outbreak: Rice Stem Borer",
        description: "कीटों का प्रकोप: आपके क्षेत्र में धान के तना छेदक का खतरा बढ़ गया है। (Pest Outbreak: Rice stem borer threat has increased in your area.)",
    },
    {
        title: "Heavy Rainfall Warning",
        description: "প্রবল বর্ষণের সতর্কতা: আগামী ২৪ ঘণ্টাত আপোনাৰ অঞ্চলত প্রবল বর্ষণ হোৱাৰ সম্ভাৱনা আছে। (Heavy Rainfall Warning: Heavy rainfall is expected in your area in the next 24 hours.)",
    },
    {
        title: "High Winds Advisory",
        description: "তেজ বতাহৰ পৰামৰ্শ: আজ আবেলি तेज বতাহ বলাৰ সম্ভাৱনা আছে, সাৱধান হওক। (High Winds Advisory: Strong winds are expected this afternoon, be careful.)",
    },
    {
        title: "Heatwave Alert",
        description: "গরমের लहर की चेतावनी: আগামী ৪৮ ঘণ্টা পর্যন্ত তাপপ্রবাহের সতর্কতা জারি করা হয়েছে। (Heatwave Alert: A heatwave warning has been issued for the next 48 hours.)"
    }
];

const mockForecastConditions = [
    { condition: "Light Rain", description: "পাতল বৰষুণৰ সম্ভাৱনা আছে। (Light rain expected.)" },
    { condition: "Thunderstorm", description: "বজ্ৰপাতৰ সৈতে ধুমুহা আহিব পাৰে। (Thunderstorms expected.)" },
    { condition: "Sunny", description: "বতৰ ফৰকাল থাকিব। (The weather will be clear.)" },
    { condition: "Cloudy", description: "ডাৱৰীয়া বতৰ থাকিব। (It will be cloudy.)" },
    { condition: "Windy", description: "বতাহ বলি থাকিব। (It will be windy.)" },
    { condition: "Partly Cloudy", description: "আংশিকভাৱে ডাৱৰীয়া বতৰ। (Partly cloudy weather.)" },
];

const getCurrentSubsidiesTool = ai.defineTool({
    name: 'getCurrentSubsidies',
    description: 'Get a list of currently active government subsidies for farmers in a given location.',
    inputSchema: z.object({ location: z.string() }),
    outputSchema: z.object({
        subsidies: z.array(z.object({
            name: z.string().describe("The official name of the subsidy or scheme."),
            details: z.string().describe("A brief overview of the subsidy, its benefits, and eligibility."),
        }))
    }),
}, async ({ location }) => {
    // In a real app, this would call a government API or database.
    return {
        subsidies: [
            {
                name: "PM-Kisan Samman Nidhi",
                details: "Provides income support of ₹6,000 per year in three equal installments to small and marginal farmer families. Eligibility depends on landholding.",
            },
            {
                name: "Kisan Credit Card (KCC) Scheme",
                details: "Offers short-term formal credit to farmers for their cultivation and other needs. Interest subvention is available.",
            }
        ]
    }
});


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
    // Here, we'll return dynamic mock data.

    // Generate random alerts
    const shuffledAlerts = [...mockAlerts].sort(() => 0.5 - Math.random());
    const selectedAlerts = shuffledAlerts.slice(0, Math.floor(Math.random() * 2) + 1); // 1 to 2 alerts
    const alerts = selectedAlerts.map(alert => ({
        ...alert,
        time: `${Math.floor(Math.random() * 24) + 1} hours ago`,
    }));

    // Generate 5-day forecast starting from today
    const forecast = Array.from({ length: 5 }).map((_, i) => {
        const date = addDays(new Date(), i);
        const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(date, 'EEEE');
        const randomCondition = mockForecastConditions[Math.floor(Math.random() * mockForecastConditions.length)];
        return {
            day: dayName,
            condition: randomCondition.condition,
            description: `${dayName} গুৱাহাটীত ${randomCondition.description}`,
        };
    });

    return { alerts, forecast };
});


export async function getWeatherAlerts(input: GetWeatherAlertsInput): Promise<GetWeatherAlertsOutput> {
  return getWeatherAlertsFlow(input);
}

const categorizeAlertsPrompt = ai.definePrompt({
    name: 'categorizeAlertsPrompt',
    input: { schema: z.object({
        alerts: z.array(z.object({
            title: z.string(),
            description: z.string(),
            time: z.string(),
        })),
        forecasts: z.array(z.object({
            day: z.string(),
            condition: z.string(),
            description: z.string(),
        })),
    })},
    output: { schema: GetWeatherAlertsOutputSchema },
    prompt: `You are a helpful assistant for farmers. Your task is to categorize alerts and forecasts.

- For each alert, determine the appropriate icon and Tailwind CSS color.
  - Rain/drizzle: icon "CloudDrizzle", color "text-blue-500".
  - Thunderstorm/lightning: icon "CloudLightning", color "text-yellow-600".
  - Subsidy/financial news: icon "CircleDollarSign", color "text-green-600".
  - Sunny/heatwave: icon "Sun", color "text-orange-500".
  - Windy: icon "Wind", color "text-gray-500".
  - Pest-related: icon "Bug", color "text-red-600".
  - General/other: icon "Cloudy", color "text-gray-500".

- For each forecast, determine the appropriate icon based on the condition.
  - "Light Rain" or "Partly Cloudy" -> "CloudDrizzle"
  - "Thunderstorm" -> "CloudLightning"
  - "Sunny" -> "Sun"
  - "Cloudy" -> "Cloudy"
  - "Windy" -> "Wind"

- The 'title' for each forecast item should be its 'condition'.

Format the final output according to the GetWeatherAlertsOutput schema.
`,
});


const getWeatherAlertsFlow = ai.defineFlow(
  {
    name: 'getWeatherAlertsFlow',
    inputSchema: GetWeatherAlertsInputSchema,
    outputSchema: GetWeatherAlertsOutputSchema,
  },
  async (input) => {
    // 1. Call tools to get raw data
    const weatherPromise = getCurrentWeatherTool(input);
    const subsidiesPromise = getCurrentSubsidiesTool(input);
    
    const [weatherResult, subsidiesResult] = await Promise.all([weatherPromise, subsidiesPromise]);
    
    // 2. Process and combine data
    const subsidyAlerts = subsidiesResult.subsidies.map(sub => ({
        title: sub.name,
        description: `${sub.details} To apply, visit your local agriculture office or the official government portal.`,
        time: "Ongoing"
    }));

    const allAlerts = [...weatherResult.alerts, ...subsidyAlerts];

    // 3. Call a simpler prompt for categorization
    const { output } = await categorizeAlertsPrompt({
        alerts: allAlerts,
        forecasts: weatherResult.forecast
    });

    if (!output) {
        throw new Error("Failed to categorize alerts and forecast.");
    }
    
    return output;
  }
);

    