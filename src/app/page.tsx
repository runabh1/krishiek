"use client";

import { BarChart, Bell, CircleDollarSign, CloudDrizzle, HeartPulse, LineChart, List, Sun, Thermometer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const moodData = [
  { day: "Mon", level: 5 },
  { day: "Tue", level: 6 },
  { day: "Wed", level: 7 },
  { day: "Thu", level: 6 },
  { day: "Fri", level: 8 },
  { day: "Sat", level: 9 },
  { day: "Sun", level: 7 },
];

const moodChartConfig = {
  level: {
    label: "Stress Level",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


const fertilityData = [
  { name: 'Fertile', value: 12, fill: 'hsl(var(--primary))' },
  { name: 'Not Fertile', value: 5, fill: 'hsl(var(--muted))' },
]

const fertilityChartConfig = {
  cows: {
    label: "Cows",
  },
  fertile: {
    label: "Fertile",
    color: "hsl(var(--primary))",
  },
  "not-fertile": {
    label: "Not Fertile",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, Farmer!
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weather Forecast
            </CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28°C, Sunny</div>
            <p className="text-xs text-muted-foreground">
              Guwahati, Assam
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subsidies
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Available</div>
            <p className="text-xs text-muted-foreground">
              PM-Kisan deadline approaching
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cattle Health</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17/17 Healthy</div>
            <p className="text-xs text-muted-foreground">
              No new issues reported
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mandi Prices (Paddy)
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,183/Quintal</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Mood & Stress Tracker</CardTitle>
            <CardDescription>Your stress level over the past week.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={moodChartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={moodData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  domain={[0, 10]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar dataKey="level" fill="var(--color-level)" radius={8} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Soil Quality</CardTitle>
            <CardDescription>Plot A-1, Last Tested: 2 weeks ago</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                  <Thermometer />
                  <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Nitrogen (N)</p>
                      <p className="text-sm text-muted-foreground">140 kg/ha (Optimal)</p>
                  </div>
              </div>
               <div className="flex items-center space-x-4 rounded-md border p-4">
                  <CloudDrizzle />
                  <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">pH Level</p>
                      <p className="text-sm text-muted-foreground">6.8 (Slightly Acidic)</p>
                  </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                  <BarChart />
                  <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Phosphorus (P)</p>
                      <p className="text-sm text-muted-foreground">25 kg/ha (Sufficient)</p>
                  </div>
              </div>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                  <List />
                  <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Organic Carbon</p>
                      <p className="text-sm text-muted-foreground">0.7% (Medium)</p>
                  </div>
              </div>
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Cattle Fertility Cycle</CardTitle>
             <CardDescription>Overview of your herd's fertility status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
                config={fertilityChartConfig}
                className="mx-auto aspect-square h-[250px]"
              >
              <RechartsPieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={fertilityData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                   {fertilityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                </Pie>
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="font-headline">Recent Notifications</CardTitle>
                <CardDescription>Updates on your farm and government schemes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar" data-ai-hint="government building" />
                            <AvatarFallback>GOV</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">PM-Kisan: eKYC Update Required</p>
                            <p className="text-sm text-muted-foreground">Please update your eKYC by July 31st to continue receiving benefits.</p>
                            <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                    </div>
                     <div className="flex items-start space-x-4">
                        <Avatar className="h-9 w-9">
                            <Bell className="h-full w-full p-2 text-primary" />
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">Pest Alert: Rice Stem Borer</p>
                            <p className="text-sm text-muted-foreground">Increased activity detected in your region. Monitor your paddy fields closely.</p>
                             <p className="text-xs text-muted-foreground">4 days ago</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
