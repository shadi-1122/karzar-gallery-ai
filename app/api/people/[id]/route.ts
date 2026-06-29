import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Person from "@/models/Person";
import Face from "@/models/Face";
import Photo from "@/models/Photo";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await params;

    const person = await Person.findById(id)
      .populate({
        path: "representativePhoto",
        select: "imageUrl width height publicId",
      })
      .lean();

    if (!person) {
      return NextResponse.json(
        {
          success: false,

          error: "Person not found.",
        },
        {
          status: 404,
        },
      );
    }

    // Get unique photo ids directly from MongoDB
    const photoIds = await Face.distinct("photoId", {
      personId: person._id,
    });

    const photos = await Photo.find({
      _id: {
        $in: photoIds,
      },
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serializedPhotos = photos.map((photo: any) => ({
      ...photo,

      _id: photo._id.toString(),
    }));

    return NextResponse.json({
      success: true,

      person: {
        ...person,

        _id: person._id.toString(),

        representativePhoto: person.representativePhoto && {
          ...person.representativePhoto,

          _id: person.representativePhoto._id.toString(),
        },
      },

      photos: serializedPhotos,

      totalPhotos: serializedPhotos.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error: "Failed to fetch person.",
      },
      {
        status: 500,
      },
    );
  }
}
