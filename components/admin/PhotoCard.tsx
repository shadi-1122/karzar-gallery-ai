"use client";

import Image from "next/image";

import { Calendar, UserRound, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { Photo } from "./types";

type Props = {
  photo: Photo;

  selected: boolean;

  onSelect: (checked: boolean) => void;

  onOpen: () => void;
};

export default function PhotoCard({
  photo,
  selected,
  onSelect,
  onOpen,
}: Props) {
  return (
    <Card
      onClick={onOpen}
      className={`group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl ${
        selected ? "ring-2 ring-primary shadow-lg" : ""
      }`}
    >
      {/* Selection */}

      <div
        className="absolute left-3 top-3 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(Boolean(checked))}
        />
      </div>

      {/* Image */}

      <div className="relative">
        <Image
          src={photo.imageUrl}
          alt="Photo"
          width={photo.width || 1200}
          height={photo.height || 1600}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Selected Overlay */}

        {selected && <div className="absolute inset-0 bg-primary/20" />}

        {/* Face Count */}

        <Badge className="absolute right-3 top-3">
          <UserRound className="mr-1 h-3 w-3" />

          {photo.faceCount}
        </Badge>
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
  );
}
