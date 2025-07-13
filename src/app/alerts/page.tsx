"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudDrizzle, CloudLightning, CircleDollarSign, Sun, Wind, Cloudy, Bell, Loader2 } from "lucide-react";
import { getWeatherAlertsAction } from "./actions";
import type { GetWeatherAlertsOutput } from "@/ai/flows/get-weather-alerts";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const iconMap = {
  CloudDrizzle: CloudDrizzle,
  CloudLightning: CloudLightning,
  CircleDollarSign: CircleDollarSign,
  Sun: Sun,
  Wind: Wind,
  Cloudy: Cloudy,
  Bell: Bell,
};

type IconName = keyof typeof iconMap;

export default function AlertsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<GetWeatherAlertsOutput | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const { result, error } = await getWeatherAlertsAction({ location: "Guwahati, Assam" });
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
      } else {
        setData(result);
      }
    });
  }, [toast]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Bell className="h-6 w-6" /> Alerts & Forecast
          </CardTitle>
          <CardDescription>
            Personalized weather, subsidy, and pest alerts for Guwahati, Assam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && !data && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Fetching latest alerts...</p>
            </div>
          )}

          {data && (
            <>
              <div>
                <h3 className="text-lg font-semibold font-headline mb-4">5-Day Forecast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {data.forecast.map((day, index) => {
                    const Icon = iconMap[day.icon as IconName] || Sun;
                    return (
                      <div key={index} className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                        <p className="font-semibold">{day.day}</p>
                        <Icon className="h-8 w-8 my-2 text-primary" />
                        <p className="font-semibold text-sm">{day.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Separator className="my-8" />
              <div>
                <h3 className="text-lg font-semibold font-headline mb-4">Notifications</h3>
                <div className="space-y-6">
                  {data.alerts.map((alert, index) => {
                    const Icon = iconMap[alert.icon as IconName] || Bell;
                    return(
                      <div key={index} className="flex items-start gap-4">
                          <div className={`mt-1 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-muted ${alert.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                              <p className="font-semibold">{alert.title}</p>
                              <p className="text-sm text-muted-foreground">{alert.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                          </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
