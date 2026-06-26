"use client";

import { motion } from "framer-motion";

import type { GalleryPhoto } from "./types";

import GalleryCard from "./GalleryCard";

type Props = {
  photos: GalleryPhoto[];
  onOpen: (index: number) => void;
};

export default function Gallery({ photos, onOpen }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="
        columns-2
        md:columns-3
        xl:columns-4
        2xl:columns-5
        gap-4
        space-y-4
      "
    >
      {photos.map((photo, index) => (
        <div key={photo._id} className="break-inside-avoid">
          <GalleryCard photo={photo} onClick={() => onOpen(index)} />
        </div>
      ))}
    </motion.div>
  );
}
