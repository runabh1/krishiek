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
    price: z.string().describe("The current price, formatted as 'Rupees X,XXX / Unit'."),
    prediction: z.string().describe("The predicted price for the next week, formatted as 'Rupees X,XXX / Unit'."),
    justification: z.string().describe("A brief justification for the prediction, citing factors like weather or demand."),
    trend: z.enum(["up", "down", "stable"]).describe("The predicted price trend."),
    unit: z.string().describe("The unit of measurement for the price (e.g., 'Quintal', 'kg')."),
});

const GetMandiPricesOutputSchema = z.object({
  prices: z.array(CommodityPriceSchema),
});
export type GetMandiPricesOutput = z.infer<typeof GetMandiPricesOutputSchema>;


const GetMandiPricesInputSchema = z.object({
  location: z.string().describe("The general location or state, e.g., 'Assam'"),
});
export type GetMandiPricesInput = z.infer<typeof GetMandiPricesInputSchema>;

// Mock data for the tool, updated to include Bhindi, Rice, etc. and units.
const mockMandiData = [
  { commodity: "Rice (Joha)", market: "Sivasagar", price: 7000, unit: "Quintal", historical: [6900, 6950, 7020], sentiment: "positive", weather: "favorable" },
  { commodity: "Bhindi (Okra)", market: "Guwahati", price: 25, unit: "kg", historical: [26, 25.5, 25.2], sentiment: "negative", weather: "risk of heavy rain" },
  { commodity: "Potato", market: "Guwahati", price: 1850, unit: "Quintal", historical: [1800, 1820, 1860], sentiment: "positive", weather: "normal" },
  { commodity: "Tomato", market: "Nalbari", price: 22, unit: "kg", historical: [21, 21.5, 22.5], sentiment: "very positive", weather: "favorable" },
  { commodity: "Mustard", market: "Barpeta Road", price: 5450, unit: "Quintal", historical: [5400, 5410, 5420], sentiment: "neutral", weather: "normal" },
  { commodity: "Jute", market: "Dhubri", price: 5000, unit: "Quintal", historical: [5100, 5050, 5020], sentiment: "negative", weather: "normal" },
  { commodity: "Assam Lemon", market: "Tinsukia", price: 3, unit: "piece", historical: [2.8, 3.1, 3], sentiment: "positive", weather: "favorable" },
  { commodity: "Cauliflower", market: "Jorhat", price: 15, unit: "piece", historical: [16, 15.5, 14.8], sentiment: "negative", weather: "unseasonal rain" },
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
        currentPrice: z.number(), // Use number for raw data
        unit: z.string(),
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
        unit: d.unit,
        historicalPrices: d.historical,
        marketSentiment: d.sentiment,
        weatherForecast: d.weather,
      }))
    };
  }
);


const pricePredictionPrompt = ai.definePrompt({
    name: 'pricePredictionPrompt',
    input: { schema: z.object({
        commodity: z.string(),
        market: z.string(),
        currentPrice: z.number(),
        unit: z.string(),
        historicalPrices: z.array(z.number()),
        marketSentiment: z.string(),
        weatherForecast: z.string(),
    }) },
    output: { schema: z.object({
        prediction: z.number().describe("The predicted price for next week as a raw number."),
        justification: z.string().describe("A brief, one-sentence justification for your prediction."),
        trend: z.enum(["up", "down", "stable"]).describe("The predicted price trend."),
    })},
    prompt: `You are an expert agricultural market analyst.
    
    Given the data for "{{commodity}}" in the "{{market}}" market, predict next week's price.
    - Current Price: {{currentPrice}} per {{unit}}
    - Historical Prices (last 3 weeks): {{historicalPrices}}
    - Market Sentiment: {{marketSentiment}}
    - Weather Forecast: {{weatherForecast}}

    Analyze all factors and provide a numerical price prediction, a justification, and the trend.
    `
});

const getMandiPricesFlow = ai.defineFlow(
  {
    name: 'getMandiPricesFlow',
    inputSchema: GetMandiPricesInputSchema,
    outputSchema: GetMandiPricesOutputSchema,
  },
  async (input) => {
    // 1. Fetch raw data using the tool
    const { marketData } = await getMarketDataTool(input);

    if (!marketData) {
        throw new Error("Could not fetch market data.");
    }

    // 2. Iterate through each commodity and call the prediction prompt
    const predictions = await Promise.all(
        marketData.map(async (item) => {
            const { output } = await pricePredictionPrompt(item);
            if (!output) {
                // Return a default or error state for this item
                return {
                    ...item,
                    prediction: item.currentPrice,
                    justification: "AI prediction failed, showing current price.",
                    trend: "stable",
                };
            }
            return {
                ...item,
                ...output
            };
        })
    );
    
    // 3. Format the data into the final shape
    const formatPrice = (value: number, unit: string) => {
        const numberFormatter = new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
        return `Rupees ${numberFormatter.format(value)} / ${unit}`;
    }

    const formattedPrices = predictions.map(p => ({
        commodity: p.commodity,
        market: p.market,
        price: formatPrice(p.currentPrice, p.unit),
        prediction: formatPrice(p.prediction, p.unit),
        justification: p.justification,
        trend: p.trend,
        unit: p.unit
    }));

    return { prices: formattedPrices };
  }
);

export async function getMandiPrices(input: GetMandiPricesInput): Promise<GetMandiPricesOutput> {
  return getMandiPricesFlow(input);
}
