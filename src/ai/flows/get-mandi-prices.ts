'use server';

/**
 * @fileOverview Predicts mandi prices using AI by analyzing simulated market data.
 *
 * - getMandiPrices - Fetches and predicts prices for various commodities.
 * - GetMandiPricesInput - The input type for the getMandiPrices function.
 * - GetMandiPricesOutput - The return type for the getMandiPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CommodityPriceSchema = z.object({
    commodity: z.string().describe("The name of the commodity (e.g., 'Paddy (Common)')."),
    market: z.string().describe("The market where the commodity is traded."),
    price: z.string().describe("The current price per quintal (e.g., '₹2,183')."),
    prediction: z.string().describe("The predicted price for the next week (e.g., '₹2,210')."),
    justification: z.string().describe("A brief justification for the prediction, citing factors like weather or demand."),
    trend: z.enum(["up", "down", "stable"]).describe("The predicted price trend."),
});

export const GetMandiPricesInputSchema = z.object({
  location: z.string().describe("The general location or state, e.g., 'Assam'"),
});
export type GetMandiPricesInput = z.infer<typeof GetMandiPricesInputSchema>;

export const GetMandiPricesOutputSchema = z.object({
  prices: z.array(CommodityPriceSchema),
});
export type GetMandiPricesOutput = z.infer<typeof GetMandiPricesOutputSchema>;


// Mock data for the tool, updated to include Bhindi, Rice, etc.
const mockMandiData = [
  { commodity: "Rice (Joha)", market: "Sivasagar", price: 7000, historical: [6900, 6950, 7020], sentiment: "positive", weather: "favorable" },
  { commodity: "Bhindi (Okra)", market: "Guwahati", price: 2500, historical: [2600, 2550, 2520], sentiment: "negative", weather: "risk of heavy rain" },
  { commodity: "Potato", market: "Guwahati", price: 1850, historical: [1800, 1820, 1860], sentiment: "positive", weather: "normal" },
  { commodity: "Tomato", market: "Nalbari", price: 2200, historical: [2100, 2150, 2250], sentiment: "very positive", weather: "favorable" },
  { commodity: "Mustard", market: "Barpeta Road", price: 5450, historical: [5400, 5410, 5420], sentiment: "neutral", weather: "normal" },
  { commodity: "Jute", market: "Dhubri", price: 5000, historical: [5100, 5050, 5020], sentiment: "negative", weather: "normal" },
  { commodity: "Assam Lemon", market: "Tinsukia", price: 3600, historical: [3500, 3550, 3580], sentiment: "positive", weather: "favorable" },
  { commodity: "Cauliflower", market: "Jorhat", price: 1500, historical: [1600, 1550, 1480], sentiment: "negative", weather: "unseasonal rain" },
];


const getMarketDataTool = ai.defineTool(
  {
    name: 'getMarketData',
    description: 'Simulates fetching current and historical market data for agricultural commodities from various online sources.',
    inputSchema: z.object({ location: z.string() }),
    outputSchema: z.object({
      marketData: z.array(z.object({
        commodity: z.string(),
        market: z.string(),
        currentPrice: z.number(),
        historicalPrices: z.array(z.number()).describe("Prices from the last 3 weeks."),
        marketSentiment: z.string().describe("News and social media sentiment."),
        weatherForecast: z.string().describe("Relevant weather forecast for the crop."),
      }))
    }),
  },
  async ({ location }) => {
    // In a real app, this would scrape websites or call APIs.
    // Here, we return mock data.
    return {
      marketData: mockMandiData.map(d => ({
        commodity: d.commodity,
        market: d.market,
        currentPrice: d.price,
        historicalPrices: d.historical,
        marketSentiment: d.sentiment,
        weatherForecast: d.weather,
      }))
    };
  }
);

const prompt = ai.definePrompt({
  name: 'mandiPricePredictionPrompt',
  input: { schema: GetMandiPricesInputSchema },
  output: { schema: GetMandiPricesOutputSchema },
  tools: [getMarketDataTool],
  prompt: `You are an expert agricultural market analyst for the region of {{location}}.
  Your task is to predict the mandi prices for the next week for a list of commodities.

  1. Use the 'getMarketData' tool to fetch the latest market data for the specified location.
  2. For each commodity in the returned data, analyze the historical prices, market sentiment, and weather forecast.
  3. Based on your analysis, predict the price for the next week.
  4. Provide a brief, one-sentence justification for your prediction.
  5. Determine if the trend is 'up', 'down', or 'stable'.
  
  Format the current and predicted prices as a string with a currency symbol, like '₹2,183'. Prices are per quintal unless specified otherwise.

  Provide the final output strictly following the GetMandiPricesOutput schema.`,
});

const getMandiPricesFlow = ai.defineFlow(
  {
    name: 'getMandiPricesFlow',
    inputSchema: GetMandiPricesInputSchema,
    outputSchema: GetMandiPricesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function getMandiPrices(input: GetMandiPricesInput): Promise<GetMandiPricesOutput> {
  return getMandiPricesFlow(input);
}
