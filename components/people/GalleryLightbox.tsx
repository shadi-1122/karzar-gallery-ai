"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Photo } from "@/components/admin/types";
import { Download, ZoomIn, ZoomOut, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeletePhotoDialog from "@/components/admin/DeletePhotoDialog";
import { ExternalLink, Copy } from "lucide-react";

import { toast } from "sonner";

type Props = {
  photos: Photo[];

  initialIndex: number;

  open: boolean;

  onClose: () => void;
};

export default function GalleryLightbox({
  photos,
  initialIndex,
  open,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setZoom(1);
  }, [index]);

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowLeft":
          previous();
          break;

        case "ArrowRight":
          next();
          break;
      }

      if (e.key === "+") {
        zoomIn();
      }

      if (e.key === "=" && e.shiftKey) {
        zoomIn();
      }

      if (e.key === "-") {
        zoomOut();
      }

      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();

        downloadCloudinary();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [open, index]);

  function next() {
    setIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }

  function previous() {
    setIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }

  const photo = photos[index];

  if (!photo) return null;

  async function downloadPhoto() {
    try {
      const response = await fetch(photo.imageUrl);

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `${photo.publicId}.jpg`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Download started.");
    } catch {
      toast.error("Download failed.");
    }
  }

  function zoomIn() {
    setZoom((prev) => Math.min(prev + 0.25, 4));
  }

  function zoomOut() {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  }

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(photo.imageUrl);

      toast.success("Image URL copied.");
    } catch {
      toast.error("Unable to copy URL.");
    }
  }

  function openOriginal() {
    window.open(photo.imageUrl, "_blank");
  }

  function downloadCloudinary() {
    const downloadUrl = photo.imageUrl.replace(
      "/image/upload/",
      "/image/upload/fl_attachment/",
    );

    window.open(downloadUrl, "_blank");

    toast.success("Download started.");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="h-screen w-screen border-0 bg-black p-0"
        showCloseButton={false}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={photo._id}
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
            className="relative flex h-full items-center justify-center"
          >
            <motion.div
              animate={{
                scale: zoom,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.publicId}
                width={photo.width || 1200}
                height={photo.height || 1600}
                className="max-h-[90vh] w-auto object-contain"
                priority
              />
            </motion.div>
            {/* Close */}

            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="absolute left-0 right-0 top-0 flex items-center justify-end gap-2 bg-black/50 p-4 backdrop-blur"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="secondary">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={zoomIn}>
                    <ZoomIn className="mr-2 h-4 w-4" />
                    <span>Zoom In</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={zoomOut}>
                    <ZoomOut className="mr-2 h-4 w-4" />
                    <span>Zoom Out</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={downloadPhoto}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={downloadCloudinary}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download Original</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={copyUrl}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy URL</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={openOriginal}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>Open Original</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="icon" variant="secondary" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Previous */}

            <Button
              size="icon"
              variant="secondary"
              className="absolute left-6 top-1/2 -translate-y-1/2"
              onClick={previous}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {/* Next */}

            <Button
              size="icon"
              variant="secondary"
              className="absolute right-6 top-1/2 -translate-y-1/2"
              onClick={next}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Counter */}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
              {index + 1} / {photos.length}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
      <DeletePhotoDialog
        photoId={photo._id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </Dialog>
  );
}
