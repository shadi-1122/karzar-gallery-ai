"use client";

import { Camera, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-lg border shadow-lg">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-12 w-12 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">No Photos Found</h1>

          <p className="mt-4 max-w-sm text-muted-foreground">
            We couldn&apos;t find any matching photos for your face. Try taking
            another selfie in good lighting with your face clearly visible.
          </p>

          <div className="mt-8 flex gap-3 sm:flex-row">
            <Button size="lg" onClick={() => router.push("/scan")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan Again
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>

          <div className="mt-10 w-full rounded-lg bg-muted p-4 text-left text-muted-foreground">
            <p className="font-semibold text-md text-foreground mb-2">
              Tips for better results
            </p>

            <ul className="space-y-1">
              <li className="text-sm">• Face the camera directly.</li>
              <li className="text-sm">• Ensure good lighting.</li>
              <li className="text-sm">• Remove sunglasses or face coverings.</li>
              <li className="text-sm">• Only one person should be in the selfie.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
