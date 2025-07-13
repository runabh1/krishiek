import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function MandiPricesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <LineChart className="h-6 w-6" /> Mandi Prices
          </CardTitle>
          <CardDescription>
            Live market rates for your crops are coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Feature Under Development</h2>
            <p className="text-muted-foreground mt-2">
              We are working to bring you real-time Mandi prices from your local markets. Please check back later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
