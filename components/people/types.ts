export type Person = {
  _id: string;

  photoCount: number;

  representativeFace: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  representativePhoto: {
    _id: string;
    imageUrl: string;
    width: number;
    height: number;
    publicId: string;
  };
};
