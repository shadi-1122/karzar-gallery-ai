import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { searchPhotos } from "@/lib/face-search";
import { generateEmbedding } from "@/lib/python-search";

export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();

    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded",
        },
        {
          status: 400,
        },
      );
    }

    const embedding = await generateEmbedding(file);

    const photos = await searchPhotos(embedding);

    return NextResponse.json({
      success: true,

      count: photos.length,

      photos,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
