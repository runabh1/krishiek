import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudDrizzle, CloudLightning, CircleDollarSign } from "lucide-react";

const alerts = [
  {
    icon: CloudDrizzle,
    title: "Rainfall Expected",
    description: "আজি গুৱাহাটীত বৰষুণৰ সম্ভাৱনা আছে। (Rain expected in Guwahati today.)",
    time: "2 hours ago",
    color: "text-blue-500",
  },
  {
    icon: CloudLightning,
    title: "Pest Outbreak Warning",
    description: "कीटों का प्रकोप: आपके क्षेत्र में धान के तना छेदक का खतरा बढ़ गया है। (Pest Outbreak: Rice stem borer threat has increased in your area.)",
    time: "1 day ago",
    color: "text-yellow-600",
  },
  {
    icon: CircleDollarSign,
    title: "Subsidy Deadline",
    description: "PM-Kisan: eKYC জমা দিয়াৰ অন্তিম তাৰিখ ৩১ জুলাই। (PM-Kisan: Last date to submit eKYC is 31st July.)",
    time: "3 days ago",
    color: "text-green-600",
  },
   {
    icon: CloudDrizzle,
    title: "Weather Update",
    description: "अगले 48 घंटों में हल्की से मध्यम बारिश की उम्मीद है। (Light to moderate rain expected in the next 48 hours.)",
    time: "5 days ago",
    color: "text-blue-500",
  },
];


export default function AlertsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Alerts & Notifications
          </CardTitle>
          <CardDescription>
            Personalized weather, subsidy, and pest alerts sent to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                {alerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <div className={`mt-1 h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full bg-muted ${alert.color}`}>
                           <alert.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{alert.title}</p>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
