"use server";

import { getCropAdvice, GetCropAdviceInput } from "@/ai/flows/voice-based-crop-advice";

export async function getCropAdviceAction(
  input: GetCropAdviceInput
): Promise<{ advice: string | null; error: string | null }> {
  try {
    const output = await getCropAdvice(input);
    return { advice: output.advice, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { advice: null, error: `Failed to get advice: ${errorMessage}` };
  }
}
