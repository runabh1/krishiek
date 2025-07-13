"use client";

import { useState, useTransition } from "react";
import { CheckCircle, FileText, Loader2 } from "lucide-react";

import { voiceBasedFormFillerAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type FilledFormData = Record<string, string>;

export default function FormFillerPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [formName, setFormName] = useState("PM-Kisan");
  const [voiceQuery, setVoiceQuery] = useState("");
  const [result, setResult] = useState<{
    filledFormData: FilledFormData;
    confirmationMessage: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!voiceQuery) {
       toast({
        variant: "destructive",
        title: "Empty Query",
        description: "Please provide your details.",
      });
      return;
    }

    startTransition(async () => {
      setResult(null);
      const { filledFormData, confirmationMessage, error } = await voiceBasedFormFillerAction({ formName, voiceQuery });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      } else if (filledFormData && confirmationMessage) {
        setResult({ filledFormData, confirmationMessage });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" /> AI Voice Form Filler
          </CardTitle>
          <CardDescription>
            Select a government form and speak your details to fill it automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="form-name">Select Form</Label>
              <Select value={formName} onValueChange={setFormName}>
                <SelectTrigger id="form-name" className="w-full">
                  <SelectValue placeholder="Select a form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PM-Kisan">PM-Kisan Samman Nidhi</SelectItem>
                  <SelectItem value="Kisan Credit Card">Kisan Credit Card</SelectItem>
                  <SelectItem value="PAN Card">PAN Card Application</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice-query">Your Details (Voice Input)</Label>
              <Textarea
                id="voice-query"
                placeholder="e.g., 'My name is Ramesh Das, my father's name is Suresh Das, my village is...'"
                value={voiceQuery}
                onChange={(e) => setVoiceQuery(e.target.value)}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Fill Form with AI"
              )}
            </Button>
          </form>

          {result && (
            <div className="mt-8 pt-6 border-t">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg space-y-2 mb-6">
                 <h3 className="font-semibold flex items-center gap-2"><CheckCircle /> Confirmation</h3>
                 <p className="text-sm">{result.confirmationMessage}</p>
              </div>

              <h3 className="text-lg font-semibold font-headline mb-4">Extracted Information</h3>
              <div className="space-y-4 rounded-md border p-4">
                {Object.entries(result.filledFormData).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor={key} className="capitalize text-right text-muted-foreground">
                      {key.replace(/_/g, ' ')}
                    </Label>
                    <Input id={key} value={value} readOnly className="col-span-2 bg-muted/50" />
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6">Submit Application</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
