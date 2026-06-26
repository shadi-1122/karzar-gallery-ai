"use client";

import { useRouter } from "next/navigation";

import Hero from "@/components/guest/Hero";
import FeatureCard from "@/components/guest/FeatureCard";

import { Camera, Download, Sparkles } from "lucide-react";

export default function GuestPage() {
  const router = useRouter();

  return (
    <main>
      <Hero onScan={() => router.push("/scan")} />

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        <FeatureCard
          icon={Camera}
          title="AI Face Recognition"
          description="Take one selfie and we'll find every photo that contains you."
        />

        <FeatureCard
          icon={Download}
          title="Download Originals"
          description="Download high-resolution fest photos instantly."
        />

        <FeatureCard
          icon={Sparkles}
          title="Automatic Matching"
          description="Powered by AI, no manual searching required."
        />
      </section>
    </main>
  );
}
