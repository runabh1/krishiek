import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CowIcon } from "@/components/icons";

export default function CattleHelpPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CowIcon className="h-6 w-6" /> Cattle Help
          </CardTitle>
          <CardDescription>
            AI-powered advice for your livestock is coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Feature Under Development</h2>
            <p className="text-muted-foreground mt-2">
              We are working hard to bring you an AI assistant for cattle health, treatment, and fertility tracking. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
