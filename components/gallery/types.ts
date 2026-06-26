export interface GalleryPhoto {
  _id: string;
  imageUrl: string;
  width: number;
  height: number;
  score?: number;
  faceCount?: number;
  createdAt?: string;
}
