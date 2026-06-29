import { NextResponse } from "next/server";
import JSZip from "jszip";
import axios from "axios";
import { connectDB } from "@/lib/mongodb";
import Photo from "@/models/Photo";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { photoIds } = await req.json();

    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No photos selected.",
        },
        {
          status: 400,
        },
      );
    }

    const photos = await Photo.find({
      _id: {
        $in: photoIds,
      },
    }).lean();

    const zip = new JSZip();

    for (const photo of photos) {
      try {
        const response = await axios.get<ArrayBuffer>(photo.imageUrl, {
          responseType: "arraybuffer",
        });

        const extension =
          photo.imageUrl.split(".").pop()?.split("?")[0] ?? "jpg";

        const filename = `${photo.publicId.split("/").pop()}.${extension}`;

        zip.file(filename, response.data);
      } catch (error) {
        console.error(`Failed to download ${photo.imageUrl}`);

        console.error(error);
      }
    }

    const content = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 9,
      },
    });

    const body = new Uint8Array(content);

    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="photos.zip"',
      },
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Download failed.",
      },
      {
        status: 500,
      },
    );
  }
}
