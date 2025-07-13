'use server';

/**
 * @fileOverview A plant disease diagnosis AI agent.
 *
 * - diagnosePlantDisease - A function that handles the plant disease diagnosis process.
 * - DiagnosePlantDiseaseInput - The input type for the diagnosePlantDisease function.
 * - DiagnosePlantDiseaseOutput - The return type for the diagnosePlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import wav from 'wav';

const DiagnosePlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a diseased plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  nativeLanguage: z.string().describe('The native language of the farmer.'),
});
export type DiagnosePlantDiseaseInput = z.infer<typeof DiagnosePlantDiseaseInputSchema>;

const DiagnosePlantDiseaseOutputSchema = z.object({
  diseaseName: z.string().describe('The name of the identified disease.'),
  description: z.string().describe('A description of the disease.'),
  stepsToFix: z.string().describe('Steps to fix the disease in the native language.'),
  pesticideName: z.string().describe('The recommended pesticide to use.'),
  audioReplyUrl: z.string().optional().describe('Optional audio reply URL in the native language.'),
  textForSpeech: z.string().describe("The full text of the diagnosis, to be used for text-to-speech fallback."),
});
export type DiagnosePlantDiseaseOutput = z.infer<typeof DiagnosePlantDiseaseOutputSchema>;

export async function diagnosePlantDisease(input: DiagnosePlantDiseaseInput): Promise<DiagnosePlantDiseaseOutput> {
  return diagnosePlantDiseaseFlow(input);
}


const diagnosisPrompt = ai.definePrompt({
  name: 'diagnosePlantDiseasePrompt',
  input: {schema: DiagnosePlantDiseaseInputSchema},
  output: {schema: z.object({
      diseaseName: z.string().describe('The name of the identified disease.'),
      description: z.string().describe('A description of the disease.'),
      stepsToFix: z.string().describe('Steps to fix the disease in the native language.'),
      pesticideName: z.string().describe('The recommended pesticide to use.'),
  })},
  prompt: `You are an expert in plant pathology and will identify the disease in the
photo and suggest treatments in the user's native language.

Analyze the image and provide the following information:

1.  diseaseName: The common name of the plant disease.
2.  description: A detailed description of the disease.
3.  stepsToFix:  Steps the farmer can take to treat the disease, explained clearly in {{nativeLanguage}}.
4.  pesticideName: The name of the recommended pesticide for this disease.

Here is the photo of the diseased plant:

{{media url=photoDataUri}}
`,
});

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const diagnosePlantDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnosePlantDiseaseFlow',
    inputSchema: DiagnosePlantDiseaseInputSchema,
    outputSchema: DiagnosePlantDiseaseOutputSchema,
  },
  async input => {
    // 1. Get the text-based diagnosis first.
    const { output: diagnosisText } = await diagnosisPrompt(input);
    if (!diagnosisText) {
        throw new Error("Failed to generate initial diagnosis.");
    }

    // 2. Combine the text for speech generation.
    const textForSpeech = `Disease found: ${diagnosisText.diseaseName}. Description: ${diagnosisText.description}. To fix this, ${diagnosisText.stepsToFix}. We recommend using ${diagnosisText.pesticideName}.`;

    let audioReplyUrl: string | undefined = undefined;

    try {
        // 3. Try to generate the audio. This might fail due to quota.
        const { media } = await ai.generate({
            model: googleAI.model('gemini-2.5-flash-preview-tts'),
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Algenib' },
                    },
                },
            },
            prompt: textForSpeech,
        });

        if (media) {
            const audioBuffer = Buffer.from(
                media.url.substring(media.url.indexOf(',') + 1),
                'base64'
            );
            const wavBase64 = await toWav(audioBuffer);
            audioReplyUrl = 'data:audio/wav;base64,' + wavBase64;
        }

    } catch (error) {
        console.warn("AI voice generation failed, likely due to quota. Proceeding without audio.", error);
        // We will proceed without the audioReplyUrl. The frontend will handle this.
    }

    // 4. Return the full result, including the generated audio URL if successful.
    return {
        ...diagnosisText,
        textForSpeech, // Always return the text for the fallback.
        audioReplyUrl,
    };
  }
);
