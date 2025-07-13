"use server";

import { diagnosePlantDisease, DiagnosePlantDiseaseInput, DiagnosePlantDiseaseOutput } from "@/ai/flows/diagnose-plant-disease";

export async function diagnosePlantDiseaseAction(
  input: DiagnosePlantDiseaseInput
): Promise<{ diagnosis: DiagnosePlantDiseaseOutput | null; error: string | null }> {
  try {
    const output = await diagnosePlantDisease(input);
    return { diagnosis: output, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { diagnosis: null, error: `Failed to diagnose plant disease: ${errorMessage}` };
  }
}
