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
      ...new Set(faces.map((face) => String(face.personId))),
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
      const remainingFace = await Face.findOne({
        personId,
      })
        .populate({
          path: "photoId",
          select: "imageUrl publicId width height",
        })
        .session(session);

      if (!remainingFace) {
        await Person.findByIdAndDelete(personId, {
          session,
        });

        console.log(`Deleted Person ${personId}`);

        continue;
      }

      const photoCount = (
        await Face.distinct("photoId", {
          personId,
        })
      ).length;

      await Person.findByIdAndUpdate(
        personId,
        {
          photoCount,

          representativePhoto: remainingFace.photoId._id,

          representativeFace: remainingFace.bbox,

          representativeEmbedding: remainingFace.embedding,

          representativeImage: remainingFace.photoId.imageUrl,
        },
        {
          session,
        },
      );

      console.log(`Updated Person ${personId}`);
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
      await cloudinary.uploader.destroy(publicId);

      console.log("Deleted Cloudinary Image");

    } catch (error) {
      console.error("Cloudinary Delete Failed");

      console.error(error);
    }
  }

  return true;
}
