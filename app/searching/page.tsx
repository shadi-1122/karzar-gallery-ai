"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Sparkles, ScanFace, ImageIcon, Images } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useSearchStore } from "@/store/search-store";
import DetectLoader from "@/components/loader/Loader";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { selfie, setPhotos, setLoading } = useSearchStore();
  const router = useRouter();

  const search = useCallback(async () => {
    if (!selfie) return;

    try {
      setLoading(true);

      const form = new FormData();

      form.append("file", selfie, "selfie.jpg");

      const res = await fetch("/api/search", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        throw new Error(`Search failed (${res.status})`);
      }

      const data = await res.json();

      setPhotos(data.photos);

      router.replace("/results");
    } catch (err) {
      console.error(err);

      router.replace("/scan");
    } finally {
      setLoading(false);
    }
  }, [router, selfie, setLoading, setPhotos]);

  const steps = [
    {
      icon: ScanFace,
      text: "Detecting your face...",
    },
    {
      icon: ImageIcon,
      text: "Comparing with event gallery...",
    },
    {
      icon: Sparkles,
      text: "Ranking the best matches...",
    },
    {
      icon: Images,
      text: "Preparing your gallery...",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  useEffect(() => {
    if (!selfie) {
      router.replace("/");

      return;
    }

    search();
  }, [search, selfie, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md rounded-3xl shadow-xl">
        <CardHeader className="items-center text-center">
          <Badge className="mb-24">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Face Search
          </Badge>

          <DetectLoader />

          <CardTitle className="mt-6 text-3xl font-bold">
            Finding Your Photos
          </CardTitle>

          <CardDescription className="text-sm justify-center text-muted-foreground">
            Comparing your face with every uploaded photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-12">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -15,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="flex items-center justify-center gap-3"
              >
                <CurrentIcon className="h-5 w-5 text-primary" />

                <p className="text-sm">{steps[currentStep].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            This usually takes between
            <span className="font-semibold"> 2–10 seconds</span>.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
