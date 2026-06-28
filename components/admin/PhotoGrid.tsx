"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PhotoCard from "./PhotoCard";
import type { Photo } from "./types";
import PhotoFilters from "./PhotoFilters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  photos: Photo[];
};

export default function PhotoGrid({ photos }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [faceFilter, setFaceFilter] = useState("all");

  const filtered = useMemo(() => {
    return photos.filter((photo) => {
      const matchesSearch = photo.publicId
        .toLowerCase()
        .includes(query.toLowerCase());

      if (!matchesSearch) return false;

      switch (filter) {
        case "processed":
          if (!photo.processed) return false;
          break;

        case "faces":
          if (photo.faceCount <= 0) return false;
          break;

        case "failed":
          if (photo.processed) return false;
          break;
      }

      if (faceFilter !== "all" && photo.faceCount !== Number(faceFilter)) {
        return false;
      }

      return true;
    });
  }, [photos, query, filter, faceFilter]);

  return (
    <div className="space-y-6">
      <PhotoFilters value={filter} onChange={setFilter} />
      <div className="flex flex-wrap gap-4">
        <Select value={faceFilter} onValueChange={setFaceFilter}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Number of Faces" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Photos</SelectItem>

            {[...new Set(photos.map((p) => p.faceCount))]
              .sort((a, b) => a - b)
              .map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} Face{count !== 1 ? "s" : ""}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
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
