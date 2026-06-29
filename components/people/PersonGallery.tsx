"use client";

import { useMemo, useState } from "react";

import { Photo } from "@/components/admin/types";

import { Person } from "./types";

import GalleryToolbar from "./GalleryToolbar";
import GalleryGrid from "./GalleryGrid";
// import GalleryEmptyState from "./GalleryEmptyState";

type Props = {
  person: Person;

  photos: Photo[];
};

export default function PersonGallery({ person, photos }: Props) {
  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    const result = photos.filter((photo) =>
      photo.publicId.toLowerCase().includes(search.toLowerCase()),
    );

    result.sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return result;
  }, [photos, search, sort]);

  return (
    <div className="space-y-6">
      <GalleryToolbar
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={(value) => setSort(value)}
      />

      {filtered.length === 0 ? (
        // <GalleryEmptyState />
        <div>found nothing</div>
      ) : (
        <GalleryGrid person={person} photos={filtered} />
      )}
    </div>
  );
}
