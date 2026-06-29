import cv2
import numpy as np

from detector import detector


def search_face(image):
    print("🔍 Running face search...")

    # Make preprocessing identical to upload
    h, w = image.shape[:2]

    max_size = 1000

    if max(h, w) > max_size:
        scale = max_size / max(h, w)

        image = cv2.resize(
            image,
            (int(w * scale), int(h * scale))
        )

        print(f"Resized image to: {image.shape}")

    # Detect faces
    faces = detector.model.get(image)

    print(f"Detected {len(faces)} face(s)")

    if len(faces) == 0:
        return None

    # Select the face with the highest detection confidence
    best_face = max(faces, key=lambda f: f.det_score)

    print(f"Best confidence: {best_face.det_score:.4f}")
    print(f"Embedding length: {len(best_face.embedding)}")
    print(f"BBox: {best_face.bbox}")

    # Print first few embedding values for debugging
    print("Embedding preview:", best_face.embedding[:10])

    return best_face.embedding.tolist()