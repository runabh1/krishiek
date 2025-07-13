"use server";

import { generateAiFarmReport, GenerateAiFarmReportInput } from "@/ai/flows/generate-ai-farm-reports";

export async function generateReportAction(
  input: GenerateAiFarmReportInput
): Promise<{ report: string | null; error: string | null }> {
  try {
    const output = await generateAiFarmReport(input);
    return { report: output.report, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { report: null, error: `Failed to generate report: ${errorMessage}` };
  }
}
