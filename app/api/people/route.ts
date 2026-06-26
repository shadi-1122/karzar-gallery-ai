import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Person from "@/models/Person";

export async function GET() {
  await connectDB();

  const people = await Person.find()
    .sort({
      photoCount: -1,
    })
    .lean();

  return NextResponse.json({
    success: true,

    people: people.map((person) => ({
      _id: person._id.toString(),

      representativePhoto: person.representativePhoto,

      representativeFace: person.representativeFace,

      photoCount: person.photoCount,
    })),
  });
}
