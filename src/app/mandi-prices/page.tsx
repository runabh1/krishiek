"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle } from "lucide-react";
import axios from "axios";

// Define the structure of a mandi price record
interface MandiPrice {
    id: string;
    state: string;
    market: string;
    commodity: string;
    variety: string;
    min_price: number;
    max_price: number;
    modal_price: number;
    arrival_date: string;
}

const API_KEY = "579b464db66ec23bdd000001857093021f5041a25572411fe89dcd3d";
const API_URL = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&offset=0&limit=1000`;

export default function MandiPricesPage() {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stateFilter, setStateFilter] = useState("");
  const [commodityFilter, setCommodityFilter] = useState("");

  useEffect(() => {
    const fetchPrices = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data && response.data.records) {
                const pricesList = response.data.records.map((record: any, index: number) => ({
                    id: `${record.market}-${record.commodity}-${index}`,
                    state: record.state,
                    market: record.market,
                    commodity: record.commodity,
                    variety: record.variety,
                    min_price: Number(record.min_price),
                    max_price: Number(record.max_price),
                    modal_price: Number(record.modal_price),
                    arrival_date: record.arrival_date,
                }));
                setPrices(pricesList);
                setFilteredPrices(pricesList);
            } else {
                setError("The API did not return any records. Please try again later.");
            }
        } catch (err) {
            setError("Unable to fetch mandi prices. Please check your connection and try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    let filtered = prices;

    if (stateFilter) {
        filtered = filtered.filter(price => price.state.toLowerCase().includes(stateFilter.toLowerCase()));
    }

    if (commodityFilter) {
        filtered = filtered.filter(price => price.commodity.toLowerCase().includes(commodityFilter.toLowerCase()));
    }

    setFilteredPrices(filtered);

  }, [stateFilter, commodityFilter, prices]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            Live Mandi Prices
          </CardTitle>
          <CardDescription>
            Real-time mandi prices for agricultural commodities across India, fetched directly from data.gov.in.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex gap-4 mb-4">
                <Input placeholder="Filter by state..." onChange={(e) => setStateFilter(e.target.value)} />
                <Input placeholder="Filter by commodity..." onChange={(e) => setCommodityFilter(e.target.value)} />
            </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Fetching live market data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
                <AlertTriangle className="h-12 w-12 text-destructive"/>
                <h3 className="text-xl font-semibold text-foreground">Unable to Fetch Prices</h3>
                <p className="text-muted-foreground max-w-sm">
                    {error}
                </p>
            </div>
          ) : filteredPrices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Variety</TableHead>
                    <TableHead className="text-right">Min Price</TableHead>
                    <TableHead className="text-right">Max Price</TableHead>
                    <TableHead className="text-right">Modal Price</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>{price.state}</TableCell>
                      <TableCell>{price.market}</TableCell>
                      <TableCell>{price.commodity}</TableCell>
                      <TableCell>{price.variety}</TableCell>
                      <TableCell className="text-right">{price.min_price}</TableCell>
                      <TableCell className="text-right">{price.max_price}</TableCell>
                      <TableCell className="text-right font-semibold">{price.modal_price}</TableCell>
                      <TableCell>{price.arrival_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
                <h3 className="text-xl font-semibold text-foreground">No Mandi Prices Found</h3>
                <p className="text-muted-foreground max-w-sm">
                    We couldn't find any mandi prices for your search. Please try a different filter.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
