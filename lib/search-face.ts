import Face from "@/models/Face";
import Photo from "@/models/Photo";

import { cosineSimilarity } from "./similarity";
import { FACE_THRESHOLD } from "./person-service";

export async function searchEmbedding(embedding: number[]) {
  const faces = await Face.find().lean();

  const best = new Map<string, number>();

  for (const face of faces) {
    const score = cosineSimilarity(
      embedding,

      face.embedding,
    );

    if (score < FACE_THRESHOLD) continue;

    const id = face.photoId.toString();

    if (!best.has(id)) {
      best.set(
        id,

        score,
      );
    } else {
      best.set(
        id,

        Math.max(
          best.get(id)!,

          score,
        ),
      );
    }
  }

  const sorted = [...best.entries()].sort((a, b) => b[1] - a[1]);

  const ids = sorted.map((x) => x[0]);

  const photos = await Photo.find({
    _id: {
      $in: ids,
    },
  });

  return photos.map((photo) => ({
    ...photo.toObject(),

    score: best.get(photo._id.toString()),
  }));
}
