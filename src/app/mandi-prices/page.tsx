"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, ArrowUp, ArrowDown, Minus, Loader2, BrainCircuit } from "lucide-react";
import { getMandiPricesAction } from "./actions";
import type { GetMandiPricesOutput } from "@/ai/flows/get-mandi-prices";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


export default function MandiPricesPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<GetMandiPricesOutput | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const { result, error } = await getMandiPricesAction({ location: "Assam" });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to fetch AI predictions: ${error}`,
        });
      } else {
        setData(result);
      }
    });
  }, [toast]);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-5 w-5 text-green-600" />;
      case "down":
        return <ArrowDown className="h-5 w-5 text-red-600" />;
      case "stable":
        return <Minus className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <LineChart className="h-6 w-6" /> AI Mandi Price Prediction
          </CardTitle>
          <CardDescription>
            AI-powered price forecasts for key commodities in Assam markets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && !data ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing market data and generating predictions...</p>
            </div>
          ) : (
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead className="text-right">Current Price</TableHead>
                    <TableHead className="text-right">AI Predicted Price (1wk)</TableHead>
                    <TableHead className="text-center">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.prices.map((item) => (
                    <TableRow key={item.commodity}>
                      <TableCell className="font-medium">{item.commodity}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.market}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{item.price}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="flex items-center justify-end gap-2 cursor-help">
                                    <BrainCircuit className="h-4 w-4 text-primary/70"/> {item.prediction}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs">{item.justification}</p>
                            </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">{getTrendIcon(item.trend)}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
