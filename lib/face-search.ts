import Face from "@/models/Face";
import Photo from "@/models/Photo";

import { findBestPerson } from "./person-service";

export async function searchPhotos(embedding: number[]) {
  console.log("========== SEARCH ==========");

  console.log("Searching nearest person...");
  const { person, similarity } = await findBestPerson(embedding);

  if (!person) {
    console.log("No matching person.");

    return [];
  }

  console.log(`Matched Person ${person._id} (${similarity.toFixed(3)})`);

  const faces = await Face.find({
    personId: person._id,
  }).lean();

  console.log(`Found ${faces.length} face records`);

  if (!faces.length) {
    return [];
  }

  const uniquePhotoIds = [
    ...new Set(faces.map((face) => face.photoId.toString())),
  ];

  const photos = await Photo.find({
    _id: {
      $in: uniquePhotoIds,
    },
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  console.log(`Returning ${photos.length} photos`);

  return photos.map((photo) => ({
    _id: photo._id.toString(),

    imageUrl: photo.imageUrl,

    width: photo.width,

    height: photo.height,

    score: similarity,
  }));
}
