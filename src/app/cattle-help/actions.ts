"use server";

import { getCattleAdvice, GetCattleAdviceInput, GetCattleAdviceOutput } from "@/ai/flows/get-cattle-advice";

export async function getCattleAdviceAction(
  input: GetCattleAdviceInput
): Promise<{ advice: string | null; error: string | null }> {
  try {
    const output = await getCattleAdvice(input);
    return { advice: output.advice, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { advice: null, error: `Failed to get cattle advice: ${errorMessage}` };
  }
}
