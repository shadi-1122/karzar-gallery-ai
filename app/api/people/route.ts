import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Person from "@/models/Person";

export async function GET() {
  try {
    await connectDB();

    const people = await Person.find({
      active: true,
    })
      .populate({
        path: "representativePhoto",
        select: "imageUrl width height publicId",
      })
      .sort({
        photoCount: -1,
      })
      .lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized = people.map((person: any) => ({
      ...person,

      _id: person._id.toString(),

      representativePhoto: person.representativePhoto && {
        ...person.representativePhoto,

        _id: person.representativePhoto._id.toString(),
      },
    }));

    return NextResponse.json({
      success: true,

      total: serialized.length,

      people: serialized,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error: "Failed to fetch people.",
      },
      {
        status: 500,
      },
    );
  }
}
