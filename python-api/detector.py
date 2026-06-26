import cv2
import numpy as np
import requests

from insightface.app import FaceAnalysis


class FaceDetector:

    def __init__(self):
        self.model = FaceAnalysis()

        # Use CPU
        self.model.prepare(ctx_id=-1)


detector = FaceDetector()


def detect_faces(url):
    response = requests.get(url)
    print(response.status_code)

    image = np.asarray(bytearray(response.content), dtype=np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)

    print(image.shape)

    try:
        faces = detector.model.get(image)
        print(f"Detected {len(faces)} faces")
    except Exception as e:
        print("ERROR:", e)
        import traceback
        traceback.print_exc()
        raise

    results = []

    for face in faces:
        results.append({
            "embedding": face.embedding.tolist(),
            "confidence": float(face.det_score),
            "bbox": {
                "x": float(face.bbox[0]),
                "y": float(face.bbox[1]),
                "width": float(face.bbox[2] - face.bbox[0]),
                "height": float(face.bbox[3] - face.bbox[1]),
            },
        })

    return results