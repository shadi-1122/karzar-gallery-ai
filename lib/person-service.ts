import Person from "@/models/Person";

import { cosineSimilarity } from "./similarity";

const FACE_THRESHOLD =  0.62;

type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function findBestPerson(embedding: number[]) {
  const persons = await Person.find(
    {},
    {
      representativeEmbedding: 1,
      photoCount: 1,
    },
  ).lean();

  let bestPerson = null;

  let bestScore = Number.NEGATIVE_INFINITY;

  for (const person of persons) {
    const score = cosineSimilarity(embedding, person.representativeEmbedding);

    if (score > bestScore) {
      bestScore = score;
      bestPerson = person;
    }
  }

  return {
    person: bestPerson,
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
