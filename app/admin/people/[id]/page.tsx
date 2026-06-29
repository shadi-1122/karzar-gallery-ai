import { notFound } from "next/navigation";

import { connectDB } from "@/lib/mongodb";

import Person from "@/models/Person";
import Face from "@/models/Face";
import Photo from "@/models/Photo";

import PersonGallery from "@/components/people/PersonGallery";
// import PersonGalleryHeader from "@/components/people/PersonGalleryHeader";
// import PersonStats from "@/components/people/PersonStats";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PersonPage({ params }: Props) {
  await connectDB();

  const { id } = await params;

  const person = await Person.findById(id)
    .populate({
      path: "representativePhoto",
      select: "imageUrl width height publicId createdAt",
    })
    .lean();

  if (!person) {
    notFound();
  }

  // Get all photo ids where this person appears
  const photoIds = await Face.distinct("photoId", {
    personId: person._id,
  });

  const photos = await Photo.find({
    _id: {
      $in: photoIds,
    },
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedPhotos = photos.map((photo: any) => ({
    ...photo,

    _id: photo._id.toString(),
  }));

  const serializedPerson = {
    ...person,

    _id: person._id.toString(),

    representativePhoto: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(person.representativePhoto as any),

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: (person.representativePhoto as any)._id.toString(),
    },
  };

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl space-y-8 p-8">
        {/* <PersonGalleryHeader person={serializedPerson} /> */}

        {/* <PersonStats
          totalPhotos={serializedPhotos.length}
          firstSeen={
            serializedPhotos.length
              ? serializedPhotos[serializedPhotos.length - 1].createdAt
              : null
          }
          lastSeen={
            serializedPhotos.length ? serializedPhotos[0].createdAt : null
          } 
        />*/}

        <PersonGallery person={serializedPerson} photos={serializedPhotos} />
      </div>
    </main>
  );
}
