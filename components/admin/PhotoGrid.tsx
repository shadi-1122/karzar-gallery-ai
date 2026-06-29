"use client";

import { useEffect, useMemo, useState } from "react";
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
import BulkToolbar from "./BulkToolbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  photos: Photo[];
};

export default function PhotoGrid({ photos }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [faceFilter, setFaceFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  function toggleSelection(photoId: string, checked: boolean) {
    if (checked && !selectedIds.includes(photoId)) {
      setSelectedIds((prev) =>
        prev.includes(photoId) ? prev : [...prev, photoId],
      );
    } else if (!checked) {
      setSelectedIds((prev) => prev.filter((id) => id !== photoId));
    }
  }

  function selectAll() {
    setSelectedIds([...new Set(filtered.map((p) => p._id))]);
  }

  function clearSelection() {
    if (!selectedIds.length) return;

    setSelectedIds([]);
  }

  async function bulkDelete() {
    if (selectedIds.length === 0) return;

    if (!confirm(`Delete ${selectedIds.length} selected photos?`)) {
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/photos/bulk-delete", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          photoIds: selectedIds,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Bulk delete failed.");
      }

      toast.success(`${selectedIds.length} photos deleted.`);

      clearSelection();

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Bulk delete failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function downloadZip() {
    if (selectedIds.length === 0) return;

    try {
      setLoading(true);

      const res = await fetch("/api/photos/download", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          photoIds: selectedIds,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate ZIP.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "photos.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl + A
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();

        selectAll();
      }

      // Escape
      if (e.key === "Escape") {
        clearSelection();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filtered]);

  function openPhoto(photo: Photo) {
    if (selectedIds.length > 0) {
      toggleSelection(photo._id, !selectedIds.includes(photo._id));

      return;
    }

    console.log("Preview:", photo);

    // Lightbox comes later
  }

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
      {selectedIds.length > 0 && (
        <BulkToolbar
          selected={selectedIds.length}
          total={filtered.length}
          loading={loading}
          onDelete={bulkDelete}
          onDownload={downloadZip}
          onCancel={clearSelection}
          onSelectAll={selectAll}
        />
      )}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search Public ID..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-xl bg-background p-8 shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />

            <p className="mt-5 text-center font-medium">Processing...</p>
          </div>
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((photo) => (
          <PhotoCard
            key={photo._id}
            photo={photo}
            selected={selectedIds.includes(photo._id)}
            onSelect={(checked) => toggleSelection(photo._id, checked)}
            onOpen={() => openPhoto(photo)}
          />
        ))}
      </div>
    </div>
  );
}
