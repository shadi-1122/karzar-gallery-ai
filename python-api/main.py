from fastapi import FastAPI

from pydantic import BaseModel

from detector import detect_faces

from fastapi import UploadFile, File

import cv2
import numpy as np

from search import search_face

app = FastAPI()

class DetectRequest(BaseModel):

    imageUrl:str

@app.post("/detect")

def detect(data:DetectRequest):

    print("Received:", data.imageUrl)

    faces = detect_faces(data.imageUrl)

    print("Faces:", len(faces))

    print("Returning", len(faces), "faces")

    return {
        "faces": faces
    }
    
    
@app.post("/search")
async def search(file: UploadFile = File(...)):
    try:
        print("\n==============================")
        print("📸 New Search Request")
        print("==============================")

        print(f"Filename: {file.filename}")
        print(f"Content Type: {file.content_type}")

        image_bytes = await file.read()
        print(f"Received {len(image_bytes)} bytes")

        image = cv2.imdecode(
            np.frombuffer(image_bytes, np.uint8),
            cv2.IMREAD_COLOR,
        )

        if image is None:
            print("❌ Failed to decode image")
            raise HTTPException(status_code=400, detail="Invalid image")

        print(f"Image Shape: {image.shape}")

        embedding = search_face(image)

        if embedding is None:
            print("❌ No face detected")
            return {
                "success": False,
                "embedding": None,
            }

        print(f"✅ Embedding Generated ({len(embedding)} values)")
        print("==============================\n")

        return {
            "success": True,
            "embedding": embedding,
        }

    except Exception as e:
        print("🔥 SEARCH ERROR")
        print(type(e).__name__)
        print(e)

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )