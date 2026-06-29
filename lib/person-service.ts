import Person from "@/models/Person";

import { cosineSimilarity } from "./similarity";
import Face from "@/models/Face";

export const FACE_THRESHOLD = 0.6;

type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function findBestPerson(embedding: number[]) {
  const faces = await Face.find().lean();

  console.log("Faces:", faces.length);
  console.log(faces[0]);

  let bestFace = null;
  let bestScore = -1;

  for (const face of faces) {
    const score = cosineSimilarity(embedding, face.embedding);

    if (score > bestScore) {
      bestScore = score;
      bestFace = face;
    }
  }

  console.log("Best Score:", bestScore);
  console.log("Threshold:", FACE_THRESHOLD);
  console.log("Best Face:", bestFace?._id);

  // Reject weak matches
  if (!bestFace || bestScore < FACE_THRESHOLD) {
    return {
      person: null,
      similarity: bestScore,
    };
  }

  const person = await Person.findById(bestFace.personId);

  return {
    person,
    similarity: bestScore,
  };
}

export async function createPerson(
  embedding: number[],
  photoId: string,
  bbox: BBox,
) {
  return Person.create({
    representativeEmbedding: embedding,

    representativePhoto: photoId,

    representativeFace: bbox,

    photoCount: 1,
  });
}

export async function increasePhotoCount(personId: string) {
  await Person.findByIdAndUpdate(personId, {
    $inc: {
      photoCount: 1,
    },
  });
}

export async function findOrCreatePerson(
  embedding: number[],
  photoId: string,
  bbox: BBox,
) {
  const { person, similarity } = await findBestPerson(embedding);

  if (person && similarity >= FACE_THRESHOLD) {
    await increasePhotoCount(person._id.toString());

    console.log(`Matched Person ${person._id} (${similarity.toFixed(3)})`);

    return person;
  }

  console.log(`Creating New Person (Best Similarity ${similarity.toFixed(3)})`);

  return createPerson(embedding, photoId, bbox);
}
