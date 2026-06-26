"use client";

import { ArrowLeft, Images } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  count: number;
};

export default function GalleryHeader({ count }: Props) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <button
          onClick={() => router.back()}
          className="rounded-lg p-2 transition hover:bg-muted"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="text-center">
          <h1 className="font-semibold text-lg">Your Photos</h1>

          <p className="text-sm text-muted-foreground">{count} Photos Found</p>
        </div>

        <div className="rounded-lg bg-primary/10 p-2">
          <Images width={22} height={22} size={22} className="text-primary" />
        </div>
      </div>
    </header>
  );
}
