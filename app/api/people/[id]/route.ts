import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Face from "@/models/Face";

import Photo from "@/models/Photo";

export async function GET(
  req: Request,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  await connectDB();

  const { id } = await params;

  const faces = await Face.find({
    personId: id,
  });

  const ids = [
    ...new Set(
      faces.map((face) =>
        face.photoId.toString(),
      ),
    ),
  ];

  const photos = await Photo.find({
    _id: {
      $in: ids,
    },
  });

  return NextResponse.json({
    success: true,

    photos,
  });
}