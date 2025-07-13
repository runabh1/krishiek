"use server";

import { getMandiPrices, GetMandiPricesInput, GetMandiPricesOutput } from "@/ai/flows/get-mandi-prices";

export async function getMandiPricesAction(
  input: GetMandiPricesInput
): Promise<{ result: GetMandiPricesOutput | null; error: string | null }> {
  try {
    const output = await getMandiPrices(input);
    return { result: output, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { result: null, error: `Failed to get mandi prices: ${errorMessage}` };
  }
}
