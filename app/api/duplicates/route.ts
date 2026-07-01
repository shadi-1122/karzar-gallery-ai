import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";
import pLimit from "p-limit";

import { connectDB } from "@/lib/mongodb";
import Photo from "@/models/Photo";

const limit = pLimit(8);

export async function GET() {
  try {
    await connectDB();

    console.log("Loading photos...");

    const photos = await Photo.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(`${photos.length} photos found`);

    const groups = new Map<
      string,
      {
        hash: string;
        photos: typeof photos;
      }
    >();

    await Promise.all(
      photos.map((photo) =>
        limit(async () => {
          try {
            const response = await axios.get<ArrayBuffer>(photo.imageUrl, {
              responseType: "arraybuffer",
            });

            const hash = crypto
              .createHash("sha256")
              .update(Buffer.from(response.data))
              .digest("hex");

            if (!groups.has(hash)) {
              groups.set(hash, {
                hash,
                photos: [],
              });
            }

            groups.get(hash)!.photos.push(photo);
          } catch (err) {
            console.error("Failed:", photo.publicId);

            console.error(err);
          }
        }),
      ),
    );

    const duplicates = [...groups.values()]
      .filter((group) => group.photos.length > 1)
      .map((group) => ({
        hash: group.hash,

        count: group.photos.length,

        photos: group.photos.map((photo) => ({
          ...photo,

          _id: photo._id.toString(),
        })),
      }));

    console.log(`${duplicates.length} duplicate groups`);

    return NextResponse.json({
      success: true,

      totalGroups: duplicates.length,

      totalDuplicates: duplicates.reduce((sum, group) => sum + group.count, 0),

      groups: duplicates,
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
