import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeroProps = {
  onScan: () => void;
};

export default function Hero({ onScan }: HeroProps) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white">
          <Camera className="h-10 w-10" />
        </div>

        <h1 className="text-5xl font-bold tracking-tight">
          KARZAR Gallery
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          Instantly find every fest photo that contains you. No scrolling. No
          searching.
        </p>

        <Button size="lg" className="mt-10 h-14 px-10 text-lg" onClick={onScan}>
          Scan My Face
        </Button>
      </div>
    </section>
  );
}
