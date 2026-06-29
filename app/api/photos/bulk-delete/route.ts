import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { deletePhoto } from "@/lib/photo-service";

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

    const deleted: string[] = [];
    const failed: {
      id: string;
      error: string;
    }[] = [];

    for (const id of photoIds) {
      try {
        await deletePhoto(id);

        deleted.push(id);
      } catch (err) {
        failed.push({
          id,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      deleted,
      failed,
      total: photoIds.length,
      deletedCount: deleted.length,
      failedCount: failed.length,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Bulk delete failed.",
      },
      {
        status: 500,
      },
    );
  }
}
