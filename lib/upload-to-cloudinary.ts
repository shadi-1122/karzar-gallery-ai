import cloudinary from "./cloudinary";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
};

export async function uploadToCloudinary(buffer: Buffer): Promise<CloudinaryUploadResult> {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "photo-event-ai",
        },
        (err, result) => {
          if (err) return reject(err);

          if (!result) {
            return reject(new Error("Cloudinary returned no result."));
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      )
      .end(buffer);
  });
}
