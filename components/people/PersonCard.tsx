"use client";

import Link from "next/link";
import Image from "next/image";

import { UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cloudinaryFace } from "@/lib/cloudinary-face";

import { Person } from "./types";

type Props = {
  person: Person;
};

export default function PersonCard({ person }: Props) {
  console.log(person.representativePhoto.imageUrl);
  return (
    <Link href={`/admin/people/${person._id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative">
          <Image
            src={cloudinaryFace(
              person.representativePhoto.imageUrl,
              person.representativeFace,
            )}
            alt="Person"
            width={300}
            height={300}
            className="aspect-square w-full object-cover"
          />

          <Badge className="absolute right-3 top-3">
            {person.photoCount} Photos
          </Badge>
        </div>

        <div className="flex items-center gap-2 p-4">
          <UserRound className="h-5 w-5 text-primary" />

          <span className="font-medium">Person</span>
        </div>
      </Card>
    </Link>
  );
}
