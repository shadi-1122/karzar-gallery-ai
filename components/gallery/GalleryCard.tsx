"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { GalleryPhoto } from "./types";

type Props = {
  photo: GalleryPhoto;
  onClick: () => void;
};

export default function GalleryCard({ photo, onClick }: Props) {
  const share = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (navigator.share) {
      await navigator.share({
        title: "Karzar Gallery",
        url: photo.imageUrl,
      });

      return;
    }

    await navigator.clipboard.writeText(photo.imageUrl);
  };

  const download = (e: React.MouseEvent) => {
    e.stopPropagation();

    const link = document.createElement("a");

    link.href = photo.imageUrl.replace("/upload/", "/upload/fl_attachment/");

    link.download = "";

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <Card
        className="
          overflow-hidden
          cursor-pointer
          group
          border-0
          shadow-md
        "
        onClick={onClick}
      >
        <div className="relative">
          <Image
            src={photo.imageUrl}
            alt=""
            width={photo.width}
            height={photo.height}
            className="
              h-auto
              w-full
              object-cover
              transition
              duration-300
              group-hover:scale-105
            "
          />

          {photo.score && (
            <Badge
              className="
                absolute
                top-3
                left-3
              "
            >
              {(photo.score * 100).toFixed(1)}%
            </Badge>
          )}

          <div
            className="
              absolute
              inset-0
              bg-black/40
              opacity-0
              group-hover:opacity-100
              transition
            "
          />

          <div
            className="
              absolute
              bottom-3
              right-3
              flex
              gap-2
              opacity-0
              group-hover:opacity-100
              transition
            "
          >
            <Button size="icon" variant="secondary" onClick={download}>
              <Download className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="secondary" onClick={share}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
