'use server';

/**
 * @fileOverview Predicts mandi prices using AI by analyzing mock data.
 *
 * - getMandiPrices - Fetches and predicts prices for various commodities.
 * - GetMandiPricesInput - The input type for the getMandiPrices function.
 * - GetMandiPricesOutput - The return type for the getMandiPrices function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// The output schema remains the same, as the final format is consistent.
const CommodityPriceSchema = z.object({
    commodity: z.string().describe("The name of the commodity."),
    market: z.string().describe("The market where the commodity is traded."),
    price: z.string().describe("The current price, formatted as 'Rupees X,XXX / Unit'."),
    prediction: z.string().describe("The predicted price for the next week."),
    justification: z.string().describe("A brief justification for the prediction."),
    trend: z.enum(["up", "down", "stable"]).describe("The predicted price trend."),
    unit: z.string().describe("The unit of measurement for the price."),
});

const GetMandiPricesOutputSchema = z.object({
  prices: z.array(CommodityPriceSchema),
});
export type GetMandiPricesOutput = z.infer<typeof GetMandiPricesOutputSchema>;

const GetMandiPricesInputSchema = z.object({
  location: z.string().describe("The state, e.g., 'Assam'"),
});
export type GetMandiPricesInput = z.infer<typeof GetMandiPricesInputSchema>;

// AI Prompt for making predictions based on mock data
const pricePredictionPrompt = ai.definePrompt({
    name: 'pricePredictionPrompt',
    input: { schema: z.object({
        commodity: z.string(),
        market: z.string(),
        currentPrice: z.number(),
        unit: z.string(),
    }) },
    output: { schema: z.object({
        prediction: z.number().describe("The predicted price for next week as a raw number."),
        justification: z.string().describe("A brief, one-sentence justification for the prediction, considering general market factors."),
        trend: z.enum(["up", "down", "stable"]).describe("The predicted price trend."),
    })},
    prompt: `You are an expert agricultural market analyst.
    Given the current price for "{{commodity}}" in the "{{market}}" market, predict next week's price.
    - Current Price: {{currentPrice}} per {{unit}}
    Analyze this information and provide a numerical price prediction, a justification, and the trend. Make a reasonable prediction based on typical market behavior.
    `
});

const getMandiPricesFlow = ai.defineFlow(
  {
    name: 'getMandiPricesFlow',
    inputSchema: GetMandiPricesInputSchema,
    outputSchema: GetMandiPricesOutputSchema,
  },
  async (input) => {
    // 1. Define a mock data set for reliable service
    const mockCommodities = [
        { name: 'Paddy', market: 'Guwahati', price: 1800, unit: 'Quintal' },
        { name: 'Potato', market: 'Dibrugarh', price: 1500, unit: 'Quintal' },
        { name: 'Jute', market: 'Silchar', price: 4500, unit: 'Quintal' },
        { name: 'Mustard', market: 'Jorhat', price: 5200, unit: 'Quintal' },
    ];

    // 2. Map mock data to the format expected by the prediction prompt
    const marketData = mockCommodities.map(item => ({
        commodity: item.name,
        market: item.market,
        currentPrice: item.price,
        unit: item.unit,
    }));

    // 3. Iterate through each commodity and call the prediction prompt
    const predictions = await Promise.all(
        marketData.map(async (item) => {
            const { output } = await pricePredictionPrompt(item);
            if (!output) {
                return {
                    ...item,
                    prediction: item.currentPrice, // Default to current price if prediction fails
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
    
    // 4. Format the data into the final shape
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
