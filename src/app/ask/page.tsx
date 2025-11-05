
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Bot, Loader2, Mic, User, Square } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdviceFromAudioAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Simplified state to only handle text
interface ResultState {
  transcript: string | null;
  advice: string | null;
}

export default function AskPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [language, setLanguage] = useState("Assamese");
  const [result, setResult] = useState<ResultState | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Removed all state and effects related to audio playback

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          submitAudioQuery(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setResult(null); // Clear previous results

    } catch (err) {
      console.error("Error accessing microphone:", err);
       let description = "Could not access the microphone. Please check your browser permissions.";
       if (err instanceof Error && err.name === 'NotAllowedError') {
        description = "Microphone access was denied. Please allow microphone access in your browser settings and try again.";
      }
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: description,
      });
    }
  };

  const submitAudioQuery = (audioDataUri: string) => {
    startTransition(async () => {
      // The action now only returns text and an error
      const { transcript, advice, error } = await getAdviceFromAudioAction({ audioDataUri, language });
      if (error) {
        if (error.includes("Quota") || error.includes("429")) {
             toast({ 
                variant: "destructive", 
                title: "Usage Limit Reached",
                description: "You've made too many requests in a short time. Please wait a minute and try again."
            });
        } else {
            toast({ variant: "destructive", title: "Error", description: error });
        }
        setResult(null);
      } else if (transcript && advice) {
        setResult({ transcript, advice }); // Set the simplified text-only result
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Mic className="h-6 w-6" /> Ask KrishiGPT
          </CardTitle>
          <CardDescription>
            Get instant advice on crops, cattle, and more by speaking in your native language.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Select Language</Label>
              <Select value={language} onValueChange={setLanguage} disabled={isRecording || isPending}>
                <SelectTrigger id="language" className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assamese">Assamese</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
                 <p className="text-muted-foreground text-sm">Click the button below and start speaking.</p>
                <Button
                  type="button"
                  className={`w-24 h-24 rounded-full flex flex-col gap-2 transition-all duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary/90'}`}
                  onClick={handleMicClick}
                  disabled={isPending}
                >
                    {isRecording ? <Square className="h-8 w-8"/> : <Mic className="h-8 w-8" />}
                    <span className="text-sm font-semibold">{isRecording ? 'Stop' : 'Speak'}</span>
                </Button>
                {isRecording && <p className="text-sm text-primary animate-pulse">Listening...</p>}
            </div>

          </div>

          {(isPending || result) && (
            <div className="mt-8 pt-6 border-t">
              {isPending && (
                <div className="flex flex-col items-center text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-muted-foreground">AI is thinking...</p>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold font-headline mb-4">Conversation</h3>
                    {result.transcript && (
                        <div className="flex items-start gap-4">
                            <Avatar className="w-8 h-8 border">
                                <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3 flex-1">
                                <p className="font-semibold text-sm">You asked:</p>
                                <p className="text-muted-foreground italic">"{result.transcript}"</p>
                            </div>
                        </div>
                    )}
                    {result.advice && (
                        <div className="flex items-start gap-4">
                            <Avatar className="w-8 h-8 border bg-primary text-primary-foreground">
                                <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                            </Avatar>
                            <div className="bg-primary/10 rounded-lg p-3 flex-1">
                               <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold text-sm text-primary">KrishiGPT replied:</p>
                                    {/* Audio playback controls are now completely removed */}
                                </div>
                                <p className="whitespace-pre-wrap">{result.advice}</p>
                            </div>
                        </div>
                    )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
