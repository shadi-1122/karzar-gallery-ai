import { connectDB } from "@/lib/mongodb";

import PhotoModel from "@/models/Photo";

import PhotoGrid from "@/components/admin/PhotoGrid";
import { Photo } from "@/components/admin/types";
import PhotoStats from "@/components/admin/PhotoStats";

export default async function PhotosPage() {
  await connectDB();

  const photos = await PhotoModel.find()
    .sort({
      createdAt: -1,
    })
    .lean();

  const serialized = photos.map((photo: Photo) => ({
    ...photo,
    _id: photo._id.toString(),
  }));

  const totalFaces = serialized.reduce((sum, p) => sum + p.faceCount, 0);

  const processed = serialized.filter((p) => p.processed).length;

  const failed = serialized.filter((p) => !p.processed).length;

  return (
    <main className="min-h-screen bg-muted/30 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Event Photos</h1>

          <p className="mt-2 text-muted-foreground">
            Manage uploaded event photos.
          </p>
        </div>

        <PhotoStats
          total={serialized.length}
          faces={totalFaces}
          processed={processed}
          failed={failed}
        />

        <PhotoGrid photos={serialized} />
      </div>
    </main>
  );
}
