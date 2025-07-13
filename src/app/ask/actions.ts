"use server";

import { getCropAdvice, GetCropAdviceInput } from "@/ai/flows/voice-based-crop-advice";
import { getAdviceFromAudio, GetAdviceFromAudioInput, GetAdviceFromAudioOutput } from "@/ai/flows/get-advice-from-audio";

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


export async function getAdviceFromAudioAction(
  input: GetAdviceFromAudioInput
): Promise<GetAdviceFromAudioOutput & { error: string | null }> {
  try {
    const output = await getAdviceFromAudio(input);
    return { ...output, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { transcript: null, advice: null, error: `Failed to get advice from audio: ${errorMessage}` };
  }
}
