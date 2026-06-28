"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Calendar,
  UserRound,
  CheckCircle2,
  MoreVertical,
  Download,
  Trash2,
  ExternalLink,
  Copy,
} from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import DeletePhotoDialog from "./DeletePhotoDialog";

import type { Photo } from "./types";
import { cloudinaryImage } from "@/lib/cloudinary-image";

type Props = {
  photo: Photo;
};

export default function PhotoCard({ photo }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function downloadImage() {
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

  async function copyUrl() {
    await navigator.clipboard.writeText(photo.imageUrl);

    toast.success("Image URL copied.");
  }

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-xl">
        <div className="relative">
          <Image
            src={cloudinaryImage(photo.imageUrl)}
            alt={photo.publicId}
            width={photo.width || 1200}
            height={photo.height || 1600}
            className="aspect-square w-full object-cover"
          />

          <Badge className="absolute left-3 top-3 gap-1">
            <UserRound className="h-3 w-3" />
            {photo.faceCount}
          </Badge>

          <div className="absolute right-3 top-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => window.open(photo.imageUrl, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open
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
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="pt-4">
          <p className="truncate font-medium">{photo.publicId}</p>
        </CardContent>

        <CardFooter className="justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />

            {new Date(photo.createdAt).toLocaleDateString()}
          </div>

          {photo.processed && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Ready
            </Badge>
          )}
        </CardFooter>
      </Card>

      <DeletePhotoDialog
        photoId={photo._id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
