export function cloudinaryImage(url: string) {
  return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}
