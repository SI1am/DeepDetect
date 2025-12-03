# Deepfake Video Detection System

A full-stack web application for detecting deepfake videos using deep learning. The system combines a **React/Next.js frontend** with a **FastAPI backend** to analyze videos and determine their authenticity.

## 📹 Demo

Watch the system in action:

E:\deepFrontend\Working.mp4

https://github.com/SI1am/DeepDetect/Working.mp4

**Video File**: `Working.mp4` - Full walkthrough of the project workflow and detection capabilities.

## 🎯 Features

- **Video Upload & Analysis**: Upload videos for real-time deepfake detection
- **Frame-by-Frame Processing**: Analyzes every Nth frame of the video for consistent detection
- **Real-Time Progress Tracking**: Live progress bar and frame count updates during analysis
- **Detailed Results Dashboard**: Comprehensive verdict, confidence scores, and artifact detection
- **Detection History**: Track all previous analyses
- **Responsive UI**: Modern, accessible interface with dark mode support
- **Model Integration**: Uses Enhanced CNN model trained on 10k+ images for high accuracy

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI component library
- **HTTP Client**: Axios for API communication
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React hooks (useState, useEffect)
- **Charts**: Recharts for data visualization

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Deep Learning**: TensorFlow/Keras
- **Video Processing**: OpenCV
- **API**: RESTful endpoints with CORS support

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **pip** (Python package manager)

### Frontend Setup

1. **Install dependencies**:
   ```powershell
   npm install
   ```

2. **Configure API endpoint** (optional):
   Create `.env.local` in the project root:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   ```
   (Default: uses same origin if not set)

3. **Start development server**:
   ```powershell
   npm run dev
   ```
   Access at `http://localhost:3000`

### Backend Setup

1. **Install Python dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

2. **Ensure model file exists**:
   - Required: `enhanced_10k_model.keras` in project root
   - Alternative: `enhanced_10k_deepfake_model.keras`

3. **Start FastAPI server**:
   ```powershell
   uvicorn main:app --reload --port 8000
   ```
   API available at `http://127.0.0.1:8000`

## 📁 Project Structure

```
deepFrontend/
├── app/                        # Next.js app directory
│   ├── api/                    # API routes (mock endpoints)
│   │   └── detection/
│   │       ├── upload/         # Video upload endpoint
│   │       ├── status/         # Detection status polling
│   │       └── history/        # Detection history
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                 # React components
│   ├── pages/                  # Full page components
│   │   ├── home-page.tsx
│   │   └── dashboard-page.tsx
│   ├── ui/                     # Reusable UI components (Radix + custom)
│   ├── upload-area.tsx         # Video upload interface
│   ├── detection-progress.tsx  # Progress tracking
│   ├── results-dashboard.tsx   # Results display
│   ├── explainability-panel.tsx # Model explanation UI
│   ├── frame-viewer.tsx        # Video frame display
│   ├── frame-timeline.tsx      # Frame timeline
│   ├── detection-score.tsx     # Score visualization
│   └── ...                     # Other components
├── hooks/                      # React hooks
│   ├── use-detection.ts        # Detection logic
│   ├── use-history.ts          # History management
│   ├── use-mobile.ts           # Mobile detection
│   └── use-toast.ts            # Toast notifications
├── lib/                        # Utilities & types
│   ├── api-client.ts           # Axios API client
│   ├── types.ts                # TypeScript types
│   ├── utils.ts                # Helper functions
│   └── mock-data.ts            # Mock data for testing
├── public/                     # Static assets
├── styles/                     # CSS stylesheets
├── main.py                     # FastAPI backend
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.mjs          # Tailwind CSS config
├── next.config.mjs             # Next.js config
└── README.md                   # This file
```

## 🔌 API Endpoints

### Frontend-Facing Endpoints (Next.js)

- **POST** `/detection/upload` - Upload video for analysis
  - Form data: `video` (File), `filename` (string)
  - Returns: `FrontendDetectionResult`

- **GET** `/detection/status/{id}` - Get detection status
  - Returns: `FrontendDetectionResult`

- **GET** `/detection/history` - Get all detection records
  - Returns: `FrontendDetectionResult[]`

### Backend Endpoints (FastAPI at :8000)

- **POST** `/detection/upload` - Process video (same as above)
- **GET** `/detection/status/{id}` - Fetch detection result
- **GET** `/detection/history` - Get detection history

- **POST** `/api/predict-video` - Legacy video prediction endpoint
  - Returns: `PredictionResult`

- **POST** `/api/predict-image` - Single image prediction
  - Returns: `PredictionResult`

## 🎬 How It Works

### Video Upload & Processing Flow

1. **User uploads video** via `UploadArea` component
2. **Frontend sends request** to `/detection/upload` with video file
3. **Backend processes video**:
   - Validates video format and duration (max 4 minutes)
   - Extracts frames at regular intervals (every 2nd frame)
   - Preprocesses frames (resize to 128×128, normalize)
   - Runs Enhanced CNN model on batch of frames
   - Computes per-frame scores and overall verdict
   - Stores result in memory with unique ID
4. **Frontend receives detection ID** and starts polling `/detection/status/{id}`
5. **Progress component** updates with real-time frame counts
6. **Results dashboard** displays verdict, confidence, and artifacts
7. **History** tracks all analyses for the session

### Detection Model

- **Architecture**: Enhanced CNN trained on 10k+ deepfake/real video images
- **Input**: 128×128 RGB frame images
- **Output**: Per-frame fake probability scores
- **Verdict Logic**:
  - **Synthetic**: Mean fake score ≥ 70%
  - **Real**: Mean fake score ≤ 30%
  - **Uncertain**: Between 30% and 70%

## ⚙️ Configuration

### Frontend Configuration

**Environment Variables** (`.env.local`):
```
# API base URL (leave empty to use same origin)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Or use FastAPI backend directly
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Backend Configuration

Edit `main.py`:
```python
IMG_SIZE = (128, 128)                    # Frame size
FAKE_THRESHOLD = 0.5                     # Fake score threshold
MAX_VIDEO_DURATION_SECONDS = 4 * 60      # Max 4 minutes
FRAME_STEP = 2                           # Extract every 2nd frame
BATCH_SIZE = 64                          # Batch size for predictions
```

## 📊 Component Architecture

### Main Components

- **`MainContent`**: Orchestrates the three phases (upload → processing → results)
- **`UploadArea`**: Handles file selection and upload
- **`DetectionProgress`**: Real-time progress tracking with frame count
- **`ResultsDashboard`**: Displays final verdict and artifacts
- **`ExplainabilityPanel`**: Model explanation and confidence breakdown
- **`FrameViewer`**: Displays individual frames from analysis
- **`FrameTimeline`**: Visual timeline of frame scores

### State Management

**`useDetection` hook**:
```typescript
const {
  uploadVideo,     // Function to upload video
  isUploading,     // Upload in progress
  error,           // Error message if any
  result,          // Final detection result
  detectionId,     // ID for polling
  status,          // Current status from polling
} = useDetection()
```

**`useHistory` hook**:
```typescript
const {
  history,         // Array of past detections
  addDetection,    // Add new detection to history
  clearHistory,    // Clear all history
} = useHistory()
```

## 🧪 Testing & Development

### Build for Production

```powershell
npm run build
npm start
```

### Type Checking

```powershell
npx tsc --noEmit
```

### Linting

```powershell
npm run lint
```

## 🛠️ Troubleshooting

### 404 Errors from `/detection/status/{id}`

**Cause**: Frontend and backend are on different ports or don't share API state.

**Solution**:
- Ensure `NEXT_PUBLIC_API_BASE_URL` points to the correct backend
- If using Next.js mock API, leave `NEXT_PUBLIC_API_BASE_URL` empty
- If using FastAPI, set it to `http://127.0.0.1:8000`

### Video Upload Fails

**Cause**: Backend not running or video format unsupported.

**Check**:
- Backend is running on port 8000
- Video format is supported (MP4, MOV, AVI, etc.)
- Video duration is under 4 minutes
- File size is reasonable (< 1GB recommended)

### Model Not Loading

**Cause**: `enhanced_10k_model.keras` not found.

**Solution**:
- Ensure model file is in project root
- Check file path in `main.py`: `MODEL_PATH`
- Verify TensorFlow is installed: `pip install tensorflow`

## 📝 Development Notes

### Adding New Components

1. Create component in `components/`
2. Use Radix UI for base components from `components/ui/`
3. Apply Tailwind CSS classes for styling
4. Export from component index if needed

### Modifying Detection Logic

1. Update `hooks/use-detection.ts` for state management
2. Modify `lib/api-client.ts` for API calls
3. Update types in `lib/types.ts` if schema changes
4. Adjust `main.py` backend if processing logic changes

## 📄 License

This project is private and for internal use only.

## 👥 Contributing

For issues or improvements, please contact the development team.

---

**Last Updated**: December 2025
**Version**: 0.1.0
