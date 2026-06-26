"use client";

import Lightbox from "yet-another-react-lightbox";

import Zoom from "yet-another-react-lightbox/plugins/zoom";

import Download from "yet-another-react-lightbox/plugins/download";

import "yet-another-react-lightbox/styles.css";

import type { GalleryPhoto } from "./types";

type Props = {
  photos: GalleryPhoto[];

  index: number;

  onClose: () => void;
};

export default function PhotoViewer({
  photos,
  index,
  onClose,
}: Props) {
  return (
    <Lightbox
      open={index >= 0}
      close={onClose}
      index={index}
      plugins={[
        Zoom,
        Download,
      ]}
      slides={photos.map((photo) => ({
        src: photo.imageUrl,
        download: photo.imageUrl,
      }))}
      carousel={{
        finite: false,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
      }}
    />
  );
}