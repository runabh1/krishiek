import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const crops = [
  { name: "Sali Paddy (Rice)", price: "₹2,183 / Quintal", location: "Nalbari, Assam", image: "https://placehold.co/600x400.png", hint: "rice paddy" },
  { name: "Assam Lemon (Kaji Nemu)", price: "₹40 / kg", location: "Dibrugarh, Assam", image: "https://placehold.co/600x400.png", hint: "lemons green" },
  { name: "Bhut Jolokia (Ghost Pepper)", price: "₹500 / kg", location: "Tezpur, Assam", image: "https://placehold.co/600x400.png", hint: "chili peppers" },
  { name: "Joha Rice (Aromatic)", price: "₹7,000 / Quintal", location: "Sivasagar, Assam", image: "https://placehold.co/600x400.png", hint: "rice bowl" },
];

const cattle = [
  { name: "Gir Cow (High Milker)", price: "₹65,000", location: "Guwahati, Assam", image: "https://placehold.co/600x400.png", hint: "gir cow" },
  { name: "Murrah Buffalo", price: "₹80,000", location: "Jorhat, Assam", image: "https://placehold.co/600x400.png", hint: "water buffalo" },
  { name: "Assam Local Goat", price: "₹8,500", location: "Barpeta, Assam", image: "https://placehold.co/600x400.png", hint: "goat farm" },
  { name: "Sahiwal Bull", price: "₹55,000", location: "Goalpara, Assam", image: "https://placehold.co/600x400.png", hint: "sahiwal bull" },
];

const equipment = [
    { name: "Power Tiller (Used)", price: "₹45,000", location: "Bongaigaon, Assam", image: "https://placehold.co/600x400.png", hint: "power tiller" },
    { name: "Paddy Thresher Machine", price: "₹22,000", location: "Dhemaji, Assam", image: "https://placehold.co/600x400.png", hint: "thresher farm" },
    { name: "Water Pump (5 HP)", price: "₹15,000", location: "Morigaon, Assam", image: "https://placehold.co/600x400.png", hint: "water pump" },
    { name: "Manual Seed Drill", price: "₹3,500", location: "Lakhimpur, Assam", image: "https://placehold.co/600x400.png", hint: "seed drill" },
]

export default function MarketplacePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Local Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell crops, cattle, and equipment near you.</p>
        </div>
        <Button>+ Add Listing</Button>
      </div>

      <Tabs defaultValue="crops" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="cattle">Cattle</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>
        <TabsContent value="crops">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {crops.map((item) => (
              <Card key={item.name}>
                <CardHeader className="p-0">
                    <div className="relative aspect-video">
                        <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={item.hint} />
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">Fresh Produce</Badge>
                  <h3 className="text-lg font-semibold font-headline">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center p-4 pt-0">
                  <p className="text-lg font-bold text-primary">{item.price}</p>
                  <Button variant="outline" size="sm">Contact Seller</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="cattle">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {cattle.map((item) => (
                <Card key={item.name}>
                    <CardHeader className="p-0">
                        <div className="relative aspect-video">
                            <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={item.hint} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">Livestock</Badge>
                        <h3 className="text-lg font-semibold font-headline">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.location}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-4 pt-0">
                        <p className="text-lg font-bold text-primary">{item.price}</p>
                        <Button variant="outline" size="sm">Contact Seller</Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="equipment">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {equipment.map((item) => (
                <Card key={item.name}>
                    <CardHeader className="p-0">
                        <div className="relative aspect-video">
                            <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-lg" data-ai-hint={item.hint} />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">Farm Machine</Badge>
                        <h3 className="text-lg font-semibold font-headline">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.location}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-4 pt-0">
                        <p className="text-lg font-bold text-primary">{item.price}</p>
                        <Button variant="outline" size="sm">Contact Seller</Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
