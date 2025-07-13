"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { BarChart, Bug, FlaskConical, Loader2, NotebookText, HeartPulse } from "lucide-react";

import { diagnoseAnimalDiseaseAction } from "./actions";
import type { DiagnoseAnimalDiseaseOutput } from "@/ai/flows/diagnose-animal-disease";
import { useToast } from "@/hooks/use-toast";
import { ImageUploader } from "@/components/features/image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AnimalDiagnosePage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<DiagnoseAnimalDiseaseOutput | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      setImagePreview(dataUri);
      setResult(null); // Clear previous results

      startTransition(async () => {
        const { diagnosis, error } = await diagnoseAnimalDiseaseAction({
          photoDataUri: dataUri,
          nativeLanguage: "English", // This could be dynamic based on user settings
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Diagnosis Failed",
            description: error,
          });
          setImagePreview(null);
        } else if (diagnosis) {
          setResult(diagnosis);
        }
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <HeartPulse className="h-6 w-6" /> AI Animal Disease Diagnosis
          </CardTitle>
          <CardDescription>
            Upload a photo of a sick animal, and our AI will identify the issue and suggest a solution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader onFileSelect={handleImageUpload} disabled={isPending} />

          {(isPending || imagePreview) && (
            <div className="mt-6">
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div>
                  <h3 className="font-semibold font-headline mb-2">Your Upload</h3>
                  <div className="relative aspect-square w-full max-w-sm mx-auto rounded-lg overflow-hidden border">
                    {imagePreview && <Image src={imagePreview} alt="Uploaded animal" layout="fill" objectFit="cover" data-ai-hint="sick animal" />}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold font-headline mb-2">AI Diagnosis</h3>
                  {isPending && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                      <p className="text-lg font-semibold">Analyzing Image...</p>
                      <p className="text-muted-foreground">Our AI Vet is examining the photo. This may take a moment.</p>
                    </div>
                  )}
                  {result && (
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-bold text-xl text-primary flex items-center gap-2">
                            <Bug /> {result.diseaseName}
                        </h4>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <NotebookText className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <h5 className="font-semibold">Description</h5>
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <BarChart className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <h5 className="font-semibold">Treatment Steps</h5>
                            <p className="text-sm text-muted-foreground">{result.stepsToFix}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FlaskConical className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <h5 className="font-semibold">Recommended Medicine</h5>
                            <p className="text-sm text-muted-foreground">{result.medicineName}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
