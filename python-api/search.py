import cv2
import numpy as np

from detector import detector


def search_face(image):
    print("🔍 Running face search...")

    faces = detector.model.get(image)

    print(f"Detected {len(faces)} face(s)")

    if len(faces) == 0:
        return None

    # Use the face with the highest confidence
    best_face = max(faces, key=lambda f: f.det_score)

    print(f"Best confidence: {best_face.det_score:.4f}")
    print(f"Embedding length: {len(best_face.embedding)}")
    print(f"BBox: {best_face.bbox}")

    return best_face.embedding.tolist()