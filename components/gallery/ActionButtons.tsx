"use client";

import { Download, Share2 } from "lucide-react";

import type { GalleryPhoto } from "./types";

type Props = {
  photo: GalleryPhoto;
};

export default function ActionButtons({ photo }: Props) {
  const download = () => {
    window.open(photo.imageUrl, "_blank");
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "KARZAR Gallery",
        url: photo.imageUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(photo.imageUrl);

    alert("Photo link copied.");
  };

  return (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={download}
        className="rounded-full bg-white p-2 shadow-lg transition hover:scale-110"
      >
        <Download size={18} />
      </button>

      <button
        onClick={share}
        className="rounded-full bg-white p-2 shadow-lg transition hover:scale-110"
      >
        <Share2 size={18} />
      </button>
    </div>
  );
}
