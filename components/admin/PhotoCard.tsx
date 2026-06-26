"use client";

import Image from "next/image";

import { Calendar, UserRound, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import type { Photo } from "./types";

type Props = {
  photo: Photo;
};

export default function PhotoCard({ photo }: Props) {
  return (
    <Card className="overflow-hidden transition hover:shadow-xl">
      <div className="relative">
        <Image
          src={photo.imageUrl}
          alt="Photo"
          width={photo.width || 1200}
          height={photo.height || 1600}
          className="aspect-square w-full object-cover"
        />

        <Badge className="absolute left-3 top-3">
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
