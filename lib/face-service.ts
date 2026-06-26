import axios from "axios";

type FaceDetectionResponse = {
  faces?: FaceDetectionResult[];
};

type FaceDetectionResult = {
  embedding: number[];
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export async function detectFaces(url: string): Promise<FaceDetectionResult[]> {
  try {
    const response = await axios.post(`${process.env.PYTHON_API}/detect`, {
      imageUrl: url,
    });

    console.log("PYTHON RESPONSE");
    console.dir(response.data, { depth: null });

    return response.data.faces ?? [];
  } catch {
    return [];
  }
}
