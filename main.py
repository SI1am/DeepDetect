import os
import uuid
import shutil
import time
from typing import List, Literal, Dict, Optional

import numpy as np
import cv2

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tensorflow import keras


# ======================================================================
# CONFIG
# ======================================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "enhanced_10k_model.keras")
TEMP_VIDEO_DIR = os.path.join(BASE_DIR, "temp_videos")

IMG_SIZE = (128, 128)
FAKE_THRESHOLD = 0.5
MAX_VIDEO_DURATION_SECONDS = 4 * 60     # max allowed = 4 min
FRAME_STEP = 2                          # extract every 2nd frame
BATCH_SIZE = 64                         # for fast + memory safe prediction

os.makedirs(TEMP_VIDEO_DIR, exist_ok=True)


# ======================================================================
# LOAD MODEL
# ======================================================================

print("Loading deepfake model from:", MODEL_PATH)
model = keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")


# ======================================================================
# FASTAPI APP
# ======================================================================

app = FastAPI(
    title="Deepfake Video Detection API",
    description="Backend API for Deepfake Detection System.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # for dev; lock down in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================================================
# SCHEMAS
# ======================================================================

class PredictionResult(BaseModel):
    """
    Internal result format for /api/predict-video and /api/predict-image
    """
    label: str
    fake_score: float
    real_score: float
    frame_scores: List[float]
    total_frames_analyzed: int


class FrontendDetectionResult(BaseModel):
    """
    Format expected by your React frontend's DetectionResult type.
    """
    id: str
    status: Literal["processing", "completed", "failed"]
    modelName: Optional[str] = None
    overallScore: float
    verdict: Literal["Real", "Synthetic", "Uncertain"]
    confidence: float
    totalFrames: int
    perFrameScores: List[float]
    artifacts: List[str]
    processingTime: float


# ======================================================================
# IN-MEMORY STORE (for status/history)
# ======================================================================

DETECTION_STORE: Dict[str, FrontendDetectionResult] = {}


# ======================================================================
# HELPERS
# ======================================================================

def get_video_duration_seconds(video_path: str) -> float:
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return 0.0

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    cap.release()

    if fps <= 0:
        return 0.0

    return frame_count / fps


def preprocess_frame(frame: np.ndarray) -> np.ndarray:
    """Convert BGR→RGB, resize, normalize."""
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, IMG_SIZE)
    return frame.astype("float32") / 255.0


def extract_frames_every_n(video_path: str, step: int = FRAME_STEP) -> List[np.ndarray]:
    """Extract every nth frame from the video."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError("Could not open video file.")

    frames: List[np.ndarray] = []
    idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if idx % step == 0:
            frames.append(frame)
        idx += 1

    cap.release()

    if len(frames) == 0:
        raise RuntimeError("No frames extracted from video.")

    return frames


def run_model_on_frames(frames: List[np.ndarray], batch_size: int = BATCH_SIZE) -> PredictionResult:
    """Run predictions in batches (memory-safe), return internal format."""
    fake_scores: List[float] = []
    real_scores: List[float] = []

    for i in range(0, len(frames), batch_size):
        batch = frames[i:i + batch_size]
        processed = np.array([preprocess_frame(f) for f in batch])
        preds = model.predict(processed, verbose=0)

        fake_scores.extend(preds[:, 1].astype(float))
        real_scores.extend(preds[:, 0].astype(float))

    fake_scores_np = np.array(fake_scores, dtype=float)
    real_scores_np = np.array(real_scores, dtype=float)

    mean_fake = float(fake_scores_np.mean())
    mean_real = float(real_scores_np.mean())

    label = "Fake" if mean_fake >= FAKE_THRESHOLD else "Real"

    return PredictionResult(
        label=label,
        fake_score=mean_fake,
        real_score=mean_real,
        frame_scores=fake_scores_np.tolist(),
        total_frames_analyzed=len(fake_scores_np),
    )


def map_prediction_to_frontend(
    pred: PredictionResult,
    processing_time: float,
    filename: str,
    detection_id: Optional[str] = None,
) -> FrontendDetectionResult:
    """
    Convert internal PredictionResult -> DetectionResult format used in frontend.
    """
    overall_score = pred.fake_score * 100.0       # fake probability in %
    confidence = max(pred.fake_score, pred.real_score) * 100.0

    # verdict mapping
    if pred.fake_score >= 0.7:
        verdict: Literal["Real", "Synthetic", "Uncertain"] = "Synthetic"
    elif pred.fake_score <= 0.3:
        verdict = "Real"
    else:
        verdict = "Uncertain"

    artifacts: List[str] = []
    if verdict == "Synthetic":
        artifacts.append("Inconsistent facial textures")
        artifacts.append("Temporal inconsistencies across frames")
    elif verdict == "Real":
        artifacts.append("No strong deepfake artifacts detected")
    else:
        artifacts.append("Mixed indicators; manual review recommended")

    result_id = detection_id or str(uuid.uuid4())

    return FrontendDetectionResult(
        id=result_id,
        status="completed",
        modelName="Enhanced CNN (10k images)",
        overallScore=overall_score,
        verdict=verdict,
        confidence=confidence,
        totalFrames=pred.total_frames_analyzed,
        perFrameScores=pred.frame_scores,
        artifacts=artifacts,
        processingTime=processing_time,
    )


# ======================================================================
# ROUTES
# ======================================================================

@app.get("/")
def root():
    return {
        "message": "Deepfake Detection API Running 🚀",
        "endpoints": {
            "video_json": "/api/predict-video",
            "image_json": "/api/predict-image",
            "upload_frontend": "/detection/upload",
            "status_frontend": "/detection/status/{id}",
            "history_frontend": "/detection/history",
        },
    }


# -------------------- ORIGINAL JSON API: VIDEO --------------------

@app.post("/api/predict-video", response_model=PredictionResult)
async def predict_video(file: UploadFile = File(...)):
    """
    Simple JSON API: expects `file` (video), returns PredictionResult.
    """
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Please upload a video file.")

    ext = os.path.splitext(file.filename)[1]
    temp_name = f"{uuid.uuid4()}{ext}"
    temp_path = os.path.join(TEMP_VIDEO_DIR, temp_name)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        duration = get_video_duration_seconds(temp_path)
        if duration <= 0:
            raise HTTPException(status_code=400, detail="Invalid video (duration = 0).")

        if duration > MAX_VIDEO_DURATION_SECONDS:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Video too long ({duration:.1f}s). "
                    f"Max allowed is {MAX_VIDEO_DURATION_SECONDS} seconds (4 minutes)."
                ),
            )

        frames = extract_frames_every_n(temp_path, step=FRAME_STEP)
        result = run_model_on_frames(frames)
        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video processing error: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# -------------------- ORIGINAL JSON API: IMAGE --------------------

@app.post("/api/predict-image", response_model=PredictionResult)
async def predict_image(file: UploadFile = File(...)):
    """
    Simple JSON API: expects `file` (image), returns PredictionResult.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file.")

    try:
        file_bytes = np.frombuffer(await file.read(), np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Failed to decode the image.")

        frame = preprocess_frame(img)
        batch = np.expand_dims(frame, axis=0)

        preds = model.predict(batch, verbose=0)[0]

        real_score = float(preds[0])
        fake_score = float(preds[1])
        label = "Fake" if fake_score >= FAKE_THRESHOLD else "Real"

        return PredictionResult(
            label=label,
            fake_score=fake_score,
            real_score=real_score,
            frame_scores=[fake_score],
            total_frames_analyzed=1,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing error: {str(e)}")


# -------------------- FRONTEND-COMPATIBLE UPLOAD --------------------

@app.post("/detection/upload", response_model=FrontendDetectionResult)
async def detection_upload(
    video: UploadFile = File(...),
    filename: str = Form(...),
):
    """
    Endpoint matching what your Next.js frontend uses:
    - POST /detection/upload with multipart form:
      - "video": File
      - "filename": string
    """
    if not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Please upload a video file.")

    ext = os.path.splitext(video.filename or filename)[1]
    temp_name = f"{uuid.uuid4()}{ext}"
    temp_path = os.path.join(TEMP_VIDEO_DIR, temp_name)

    start_time = time.time()
    detection_id = str(uuid.uuid4())

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

        duration = get_video_duration_seconds(temp_path)
        if duration <= 0:
            raise HTTPException(status_code=400, detail="Invalid video (duration = 0).")

        if duration > MAX_VIDEO_DURATION_SECONDS:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Video too long ({duration:.1f}s). "
                    f"Max allowed is {MAX_VIDEO_DURATION_SECONDS} seconds (4 minutes)."
                ),
            )

        frames = extract_frames_every_n(temp_path, step=FRAME_STEP)
        pred = run_model_on_frames(frames)
        processing_time = time.time() - start_time

        result = map_prediction_to_frontend(
            pred,
            processing_time,
            filename,
            detection_id=detection_id,
        )

        # store for status/history
        DETECTION_STORE[detection_id] = result

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video processing error: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# -------------------- STATUS & HISTORY --------------------

@app.get("/detection/status/{detection_id}", response_model=FrontendDetectionResult)
async def detection_status(detection_id: str):
    """
    Frontend polls this using the id returned from /detection/upload.
    """
    result = DETECTION_STORE.get(detection_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Detection ID not found")
    return result


@app.get("/detection/history", response_model=List[FrontendDetectionResult])
async def detection_history():
    """
    Very simple in-memory history of all detections since server start.
    """
    return list(DETECTION_STORE.values())
