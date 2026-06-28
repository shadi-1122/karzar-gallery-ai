import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import { deletePhoto } from "@/lib/photo-service";

export async function DELETE(
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

    await deletePhoto(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Delete failed.",
      },
      {
        status: 500,
      },
    );
  }
}
