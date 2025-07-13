"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BarChart3, Download, Loader2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { generateReportAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  farmDetails: z.string().min(10, { message: "Please provide more details about your farm." }),
  historicalData: z.string().min(10, { message: "Please provide some historical data." }),
  soilQuality: z.string().min(10, { message: "Please describe your soil quality." }),
  marketTrends: z.string().min(10, { message: "Please mention current market trends." }),
});

export default function ReportsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farmDetails: "",
      historicalData: "",
      soilQuality: "",
      marketTrends: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { report, error } = await generateReportAction(values);

      if (error) {
        toast({
          variant: "destructive",
          title: "Report Generation Failed",
          description: error,
        });
      } else if (report) {
        toast({
          title: "Report Generated Successfully!",
          description: "Your AI-powered farm report is ready for download.",
        });
        // In a real app, you would trigger the download here.
        // For example, by creating a blob from the base64 string and a download link.
        const byteCharacters = atob(report);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Krishione_AI_Farm_Report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6" /> AI Farm Reports
          </CardTitle>
          <CardDescription>
            Provide details about your farm to generate a comprehensive PDF report with AI-driven insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="farmDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., 5 acres farm in Nalbari, growing Sali paddy and vegetables..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Data</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Last year's yield was 20 quintals/acre, fertilizer cost was..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilQuality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Quality</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Soil is loamy with good drainage, pH is around 6.5..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Trends</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Local demand for organic vegetables is high, paddy price is stable..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate & Download PDF Report
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
