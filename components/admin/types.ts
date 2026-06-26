export interface Photo {
  _id: string;
  imageUrl: string;
  publicId: string;
  width: number;
  height: number;
  faceCount: number;
  processed: boolean;
  createdAt: string;
}
