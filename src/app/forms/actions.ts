"use server";

import { voiceBasedFormFiller, VoiceBasedFormFillerInput, VoiceBasedFormFillerOutput } from "@/ai/flows/voice-based-form-filler";

export async function voiceBasedFormFillerAction(
  input: VoiceBasedFormFillerInput
): Promise<{ filledFormData: Record<string, string> | null; confirmationMessage: string | null; error: string | null }> {
  try {
    const output = await voiceBasedFormFiller(input);
    return { ...output, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { filledFormData: null, confirmationMessage: null, error: `Failed to fill form: ${errorMessage}` };
  }
}
