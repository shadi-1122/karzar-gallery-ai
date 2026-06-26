"use client";

import { useState } from "react";

import Gallery from "@/components/gallery/Gallery";
import GalleryHeader from "@/components/gallery/GalleryHeader";
import EmptyState from "@/components/gallery/EmptyState";
import PhotoViewer from "@/components/gallery/PhotoViewer";

import { useSearchStore } from "@/store/search-store";

export default function ResultsPage() {
  const photos = useSearchStore((state) => state.photos);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  if (!photos.length) {
    return <EmptyState />;
  }

  return (
    <main>
      <GalleryHeader count={photos.length} />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <Gallery photos={photos} onOpen={setSelectedIndex} />
      </div>

      <PhotoViewer
        photos={photos}
        index={selectedIndex}
        onClose={() => setSelectedIndex(-1)}
      />
    </main>
  );
}
