"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  image?: string;

  loading: boolean;

  onRetake: () => void;
  onContinue: () => void;
};

export default function PreviewDialog({
  open,
  image,
  loading,
  onRetake,
  onContinue,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>

        {image && (
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={image}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" disabled={loading} onClick={onRetake}>
            Retake
          </Button>

          <Button disabled={loading} onClick={onContinue}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
