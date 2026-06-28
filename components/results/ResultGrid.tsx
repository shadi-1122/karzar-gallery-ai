"use client";

import Image from "next/image";
import type { Photo } from "@/store/search-store";
import { cloudinaryImage } from "@/lib/cloudinary-image";

type Props = {
  photos: Photo[];
};

export default function ResultGrid({ photos }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {photos.map((photo) => (
        <div
          key={photo._id}
          className="relative aspect-[3/4] overflow-hidden rounded-xl"
        >
          <Image
            src={cloudinaryImage(photo.imageUrl)}
            alt="Photo"
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
