import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, ArrowUp, ArrowDown, Minus } from "lucide-react";

const mandiData = [
  {
    commodity: "Paddy (Common)",
    market: "Nalbari",
    price: "₹2,183",
    change: 1.2,
  },
  {
    commodity: "Jute",
    market: "Dhubri",
    price: "₹5,050",
    change: -0.5,
  },
  {
    commodity: "Potato",
    market: "Guwahati",
    price: "₹1,800",
    change: 2.1,
  },
  {
    commodity: "Mustard",
    market: "Barpeta Road",
    price: "₹5,400",
    change: 0,
  },
   {
    commodity: "Assam Lemon",
    market: "Tinsukia",
    price: "₹3,500",
    change: 3.5,
  },
  {
    commodity: "Black Gram (Matikalai)",
    market: "Nagaon",
    price: "₹7,800",
    change: -1.8,
  },
];


export default function MandiPricesPage() {
  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <span className="flex items-center text-green-600">
          <ArrowUp className="h-4 w-4 mr-1" /> {change.toFixed(1)}%
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="flex items-center text-red-600">
          <ArrowDown className="h-4 w-4 mr-1" /> {Math.abs(change).toFixed(1)}%
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-muted-foreground">
          <Minus className="h-4 w-4 mr-1" /> 0.0%
        </span>
      );
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <LineChart className="h-6 w-6" /> Live Mandi Prices
          </CardTitle>
          <CardDescription>
            Real-time market rates for various commodities in Assam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Market</TableHead>
                <TableHead className="text-right">Price (per Quintal)</TableHead>
                <TableHead className="text-right">Change (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mandiData.map((item) => (
                <TableRow key={item.commodity}>
                  <TableCell className="font-medium">{item.commodity}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.market}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{item.price}</TableCell>
                  <TableCell className="text-right">{getChangeIndicator(item.change)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
