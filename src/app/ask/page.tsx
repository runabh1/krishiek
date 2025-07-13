
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Bot, Loader2, Mic, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCropAdviceAction } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Extend the Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const languageMap: { [key: string]: string } = {
  Assamese: "as-IN",
  Hindi: "hi-IN",
  English: "en-US",
};

export default function AskPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("Assamese");
  const [result, setResult] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const submitQuery = (currentQuery: string) => {
    if (!currentQuery) {
      toast({
        variant: "destructive",
        title: "Empty Query",
        description: "Please enter or speak your question.",
      });
      return;
    }

    startTransition(async () => {
      setResult(null);
      const { advice, error } = await getCropAdviceAction({ voiceQuery: currentQuery, language });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      } else {
        setResult(advice);
      }
    });
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSpeechRecognitionSupported(true);
        recognitionRef.current = new SpeechRecognition();
      } else {
        setIsSpeechRecognitionSupported(false);
      }
    }
  }, []);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.lang = languageMap[language] || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    
    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      toast({
        variant: "destructive",
        title: "Speech Recognition Error",
        description: event.error === "no-speech" 
          ? "No speech was detected. Please try again."
          : event.error,
      });
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      submitQuery(transcript);
    };

  }, [language, toast]);


  const handleMicClick = () => {
    if (!isSpeechRecognitionSupported) {
      toast({
        variant: "destructive",
        title: "Unsupported Browser",
        description: "Your browser does not support speech recognition.",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setQuery("");
      setResult(null);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Could not start recognition:", e);
        toast({
          variant: "destructive",
          title: "Recognition Error",
          description: "Could not start speech recognition. Please check your microphone permissions.",
        })
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitQuery(query);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Select Language</Label>
              <Select value={language} onValueChange={setLanguage}>
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
            <div className="space-y-2">
              <Label htmlFor="query">Your Question</Label>
              <div className="relative">
                <Textarea
                  id="query"
                  placeholder="e.g., 'Mur dhan khetit pok lagiye, ki korim?' or click the mic to speak."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-20"
                  rows={4}
                />
                <Button
                  type="button"
                  size="icon"
                  variant={isRecording ? "destructive" : "default"}
                  className="absolute bottom-2 right-2 rounded-full"
                  onClick={handleMicClick}
                  disabled={!isSpeechRecognitionSupported || isPending}
                  title={isSpeechRecognitionSupported ? "Record Voice" : "Speech recognition not supported"}
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Record Voice</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Advice...
                </>
              ) : (
                "Get Advice"
              )}
            </Button>
          </form>

          {isPending && (
             <div className="mt-6 flex flex-col items-center text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">AI is thinking...</p>
            </div>
          )}

          {result && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold font-headline mb-4">AI Assistant's Advice</h3>
              <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <Avatar className="w-8 h-8 border bg-primary text-primary-foreground">
                        <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                    </Avatar>
                    <div className="bg-primary/10 rounded-lg p-3 flex-1">
                        <p className="font-semibold text-sm text-primary">KrishiGPT replied:</p>
                        <p className="whitespace-pre-wrap">{result}</p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
