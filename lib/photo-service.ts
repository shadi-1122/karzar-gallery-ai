import mongoose from "mongoose";

import cloudinary from "@/lib/cloudinary";

import Photo from "@/models/Photo";
import Face from "@/models/Face";
import Person from "@/models/Person";

export async function deletePhoto(photoId: string) {
  const session = await mongoose.startSession();

  let publicId: string | null = null;

  try {
    session.startTransaction();

    // -------------------------
    // Find Photo
    // -------------------------

    const photo = await Photo.findById(photoId).session(session);

    if (!photo) {
      throw new Error("Photo not found.");
    }

    publicId = photo.publicId;

    // -------------------------
    // Find all faces
    // -------------------------

    const faces = await Face.find({
      photoId: photo._id,
    }).session(session);

    const affectedPeople = [
      ...new Set(faces.map((face) => face.personId.toString())),
    ];

    // -------------------------
    // Delete Faces
    // -------------------------

    await Face.deleteMany({
      photoId: photo._id,
    }).session(session);

    // -------------------------
    // Update Persons
    // -------------------------

    for (const personId of affectedPeople) {
      const count = await Face.countDocuments({
        personId,
      }).session(session);

      if (count === 0) {
        await Person.findByIdAndDelete(personId, {
          session,
        });

        console.log(`Deleted Person ${personId}`);
      } else {
        await Person.findByIdAndUpdate(
          personId,
          {
            photoCount: count,
          },
          {
            session,
          },
        );

        console.log(`Updated Person ${personId} (${count} photos)`);
      }
    }

    // -------------------------
    // Delete Photo
    // -------------------------

    await Photo.findByIdAndDelete(photo._id, {
      session,
    });

    console.log(`Deleted Photo ${photo._id}`);

    // -------------------------
    // Commit MongoDB
    // -------------------------

    await session.commitTransaction();

    console.log("MongoDB Transaction Committed");
  } catch (error) {
    await session.abortTransaction();

    console.error("MongoDB Transaction Rolled Back");

    throw error;
  } finally {
    session.endSession();
  }

  // -------------------------
  // Delete Cloudinary
  // -------------------------

  if (publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      console.log("Cloudinary:", result);
    } catch (error) {
      console.error("Cloudinary Delete Failed");

      console.error(error);
    }
  }

  return true;
}
