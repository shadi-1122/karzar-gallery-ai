"use client";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Photo } from "@/components/admin/types";

import { Person } from "./types";

import GalleryLightbox from "./GalleryLightbox";
import GalleryImageCard from "./GalleryImageCard";

type Props = {
  person: Person;

  photos: Photo[];
};

export default function GalleryGrid({ person, photos }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <AnimatePresence>
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id}
              layout
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <GalleryImageCard
                person={person}
                photo={photo}
                onOpen={() => setSelectedIndex(index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {selectedIndex !== null && (
        <GalleryLightbox
          photos={photos}
          initialIndex={selectedIndex}
          open={selectedIndex !== null}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
