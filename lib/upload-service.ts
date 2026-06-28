import Photo from "@/models/Photo";
import Face from "@/models/Face";

import { uploadToCloudinary } from "./upload-to-cloudinary";
import { detectFaces } from "./face-service";
import { findOrCreatePerson } from "./person-service";
import { cloudinaryImage } from "./cloudinary-image";

type ProcessUploadResult =
  | {
      success: true;
      photo: InstanceType<typeof Photo>;
      facesDetected: number;
    }
  | {
      success: false;
      file: string;
      error: string;
    };

export async function processUpload(file: File): Promise<ProcessUploadResult> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    console.log(`Uploading ${file.name}`);

    const upload = await uploadToCloudinary(buffer);

    console.log(`Uploaded ${file.name}`);

    const photo = await Photo.create({
      imageUrl: upload.secure_url,
      publicId: upload.public_id,

      width: upload.width,
      height: upload.height,

      processed: false,
      faceCount: 0,
    });

    // const detectedFaces = await detectFaces(upload.secure_url);
    const detectedFaces = await detectFaces(cloudinaryImage(upload.secure_url));

    console.log(`${file.name}: ${detectedFaces.length} faces detected`);

    for (const detectedFace of detectedFaces) {
      const person = await findOrCreatePerson(
        detectedFace.embedding,

        photo._id.toString(),

        detectedFace.bbox,
      );

      await Face.create({
        photoId: photo._id,

        personId: person._id,

        embedding: detectedFace.embedding,

        confidence: detectedFace.confidence,

        bbox: detectedFace.bbox,
      });

      console.log(`Face linked to Person ${person._id}`);
    }

    photo.faceCount = detectedFaces.length;

    photo.processed = true;

    await photo.save();

    console.log(`${file.name} completed.`);

    return {
      success: true,
      photo,
      facesDetected: detectedFaces.length,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,

      file: file.name,

      error: err instanceof Error ? err.message : "Unknown Error",
    };
  }
}
