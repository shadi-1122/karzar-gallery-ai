"use client";

import Image from "next/image";

import { motion } from "framer-motion";

import { Calendar, UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cloudinaryImage } from "@/lib/cloudinary-image";

import { Person } from "./types";
import { Photo } from "@/components/admin/types";
import { useState } from "react";
import {
  MoreVertical,
  Download,
  ExternalLink,
  Copy,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeletePhotoDialog from "@/components/admin/DeletePhotoDialog";

import { toast } from "sonner";

type Props = {
  person: Person;

  photo: Photo;

  onOpen: () => void;
};

export default function GalleryImageCard({ person, photo, onOpen }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const downloadUrl = photo.imageUrl.replace(
    "/image/upload/",
    "/image/upload/fl_attachment/",
  );

  window.open(downloadUrl);

  async function downloadImage(e: React.MouseEvent) {
    e.stopPropagation();

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

  async function copyUrl(e: React.MouseEvent) {
    e.stopPropagation();

    await navigator.clipboard.writeText(photo.imageUrl);

    toast.success("Image URL copied.");
  }

  function openOriginal(e: React.MouseEvent) {
    e.stopPropagation();

    window.open(photo.imageUrl, "_blank");
  }
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <Card
        onClick={onOpen}
        className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all hover:shadow-xl"
      >
        <div className="relative overflow-hidden">
          <Image
            src={cloudinaryImage(photo.imageUrl)}
            alt={photo.publicId}
            width={photo.width || 1200}
            height={photo.height || 1600}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <Badge className="absolute left-3 top-3 gap-1">
            <UserRound className="h-3 w-3" />

            {photo.faceCount}
          </Badge>

          <div className="absolute right-3 top-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={openOriginal}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Original
                </DropdownMenuItem>

                <DropdownMenuItem onClick={downloadImage}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>

                <DropdownMenuItem onClick={copyUrl}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy URL
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();

                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3">
            <p className="truncate text-sm font-medium text-white">
              {photo.publicId}
            </p>

            <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
              <Calendar className="h-3.5 w-3.5" />

              {new Date(photo.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>

      <DeletePhotoDialog
        photoId={photo._id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </motion.div>
  );
}
