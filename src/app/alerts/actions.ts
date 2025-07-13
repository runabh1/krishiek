"use server";

import { getWeatherAlerts, GetWeatherAlertsInput, GetWeatherAlertsOutput } from "@/ai/flows/get-weather-alerts";

export async function getWeatherAlertsAction(
  input: GetWeatherAlertsInput
): Promise<{ result: GetWeatherAlertsOutput | null; error: string | null }> {
  try {
    const output = await getWeatherAlerts(input);
    return { result: output, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { result: null, error: `Failed to get weather alerts: ${errorMessage}` };
  }
}
