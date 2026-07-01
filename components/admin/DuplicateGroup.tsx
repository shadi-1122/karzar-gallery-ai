"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Trash2 } from "lucide-react";

type Photo = {
  _id: string;
  imageUrl: string;
  publicId: string;
  createdAt: string;
  faceCount: number;
  width: number;
  height: number;
};

type Group = {
  hash: string;
  count: number;
  photos: Photo[];
};

type Props = {
  groups: Group[];
};

export default function DuplicateGroups({ groups }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState<string | null>(null);

  async function deletePhoto(id: string) {
    try {
      setLoading(id);

      const res = await fetch(`/api/photos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(data.error);
      }

      router.refresh();
    } catch (err) {
      console.error(err);

      alert("Delete failed.");
    } finally {
      setLoading(null);
    }
  }

  if (!groups.length) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <h2 className="text-2xl font-bold">🎉 No Duplicate Photos</h2>

        <p className="mt-3 text-muted-foreground">
          Every uploaded image is unique.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((group, index) => {
        const photos = [...group.photos].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

        return (
          <div
            key={group.hash}
            className="space-y-5 rounded-xl border bg-background p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Duplicate Group {index + 1}
                </h2>

                <p className="text-sm text-muted-foreground">
                  {photos.length} identical photos
                </p>
              </div>

              <Badge>SHA256</Badge>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {photos.map((photo, photoIndex) => (
                <div
                  key={photo._id}
                  className="overflow-hidden rounded-xl border"
                >
                  <div className="relative">
                    <Image
                      src={photo.imageUrl}
                      alt=""
                      width={photo.width}
                      height={photo.height}
                      className="aspect-square w-full object-cover"
                    />

                    {photoIndex === 0 && (
                      <Badge className="absolute left-3 top-3">Keep</Badge>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <p className="truncate text-sm">{photo.publicId}</p>

                    <p className="text-xs text-muted-foreground">
                      Faces: {photo.faceCount}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(photo.createdAt).toLocaleString()}
                    </p>

                    {photoIndex > 0 && (
                      <Button
                        className="w-full"
                        variant="destructive"
                        disabled={loading === photo._id}
                        onClick={() => deletePhoto(photo._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
