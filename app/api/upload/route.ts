import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { processUpload } from "@/lib/upload-service";
import pLimit from "p-limit";

const limit = pLimit(5); // Process 5 files simultaneously

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    const files = formData
      .getAll("files")
      .filter((file): file is File => file instanceof File);

    if (!files.length) {
      return NextResponse.json(
        {
          success: false,
          error: "No files uploaded.",
        },
        {
          status: 400,
        },
      );
    }

    const uploaded = await Promise.all(
      files.map((file) => limit(() => processUpload(file))),
    );

    return NextResponse.json({
      success: true,
      uploaded,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Upload failed.",
      },
      {
        status: 500,
      },
    );
  }
}
