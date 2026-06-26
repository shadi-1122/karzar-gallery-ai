"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PhotoCard from "./PhotoCard";
import type { Photo } from "./types";
import PhotoFilters from "./PhotoFilters";

type Props = {
  photos: Photo[];
};

export default function PhotoGrid({ photos }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch = photo.publicId
        .toLowerCase()
        .includes(query.toLowerCase());

      if (!matchesSearch) return false;

      switch (filter) {
        case "processed":
          return photo.processed;

        case "faces":
          return photo.faceCount > 0;

        case "failed":
          return !photo.processed;

        default:
          return true;
      }
    });
  }, [photos, query, filter]);

  return (
    <div className="space-y-6">
      <PhotoFilters value={filter} onChange={setFilter} />
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search Public ID..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((photo) => (
          <PhotoCard key={photo._id} photo={photo} />
        ))}
      </div>
    </div>
  );
}
