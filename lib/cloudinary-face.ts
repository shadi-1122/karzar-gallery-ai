export type FaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function cloudinaryFace(imageUrl: string, face: FaceBox, size = 320) {
  if (!imageUrl) return "";

  return imageUrl.replace(
    "/image/upload/",
    `/image/upload/c_crop,x_${Math.round(face.x)},y_${Math.round(
      face.y,
    )},w_${Math.round(face.width)},h_${Math.round(
      face.height,
    )},c_fill,w_${size},h_${size},f_auto,q_auto/`,
  );
}
