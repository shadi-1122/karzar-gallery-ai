import JSZip from "jszip";
import axios from "axios";

import Photo from "@/models/Photo";

export async function createPhotoZip(photoIds: string[]): Promise<Buffer> {
  const photos = await Photo.find({
    _id: {
      $in: photoIds,
    },
  }).lean();

  const zip = new JSZip();

  const files = await Promise.all(
    photos.map(async (photo) => {
      try {
        const response = await axios.get<ArrayBuffer>(photo.imageUrl, {
          responseType: "arraybuffer",
        });

        return {
          photo,
          data: response.data,
        };
      } catch (error) {
        console.error(`Failed to download ${photo.imageUrl}`);

        console.error(error);

        return null;
      }
    }),
  );

  for (const file of files) {
    if (!file) continue;

    const extension =
      file.photo.imageUrl.split(".").pop()?.split("?")[0] ?? "jpg";

    const filename = `${file.photo.publicId.split("/").pop()}.${extension}`;

    zip.file(filename, file.data);
  }

  return await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9,
    },
  });
}
