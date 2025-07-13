"use server";

import { diagnoseAnimalDisease, DiagnoseAnimalDiseaseInput, DiagnoseAnimalDiseaseOutput } from "@/ai/flows/diagnose-animal-disease";

export async function diagnoseAnimalDiseaseAction(
  input: DiagnoseAnimalDiseaseInput
): Promise<{ diagnosis: DiagnoseAnimalDiseaseOutput | null; error: string | null }> {
  try {
    const output = await diagnoseAnimalDisease(input);
    return { diagnosis: output, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { diagnosis: null, error: `Failed to diagnose animal disease: ${errorMessage}` };
  }
}
