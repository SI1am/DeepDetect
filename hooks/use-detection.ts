// hooks/use-detection.ts
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { DetectionResult } from "@/lib/api-client"

export function useDetection() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [detectionId, setDetectionId] = useState<string | null>(null)
  const [status, setStatus] = useState<DetectionResult | null>(null)

  const uploadVideo = async (file: File) => {
    try {
      setIsUploading(true)
      setError(null)
      setResult(null)

      const filename = file.name

      // ✅ This calls FastAPI: POST http://127.0.0.1:8000/detection/upload
      const detection = await apiClient.uploadVideo({
        videoFile: file,
        filename,
      })

      setResult(detection)
      setDetectionId(detection.id)
      setStatus(detection)
    } catch (err: any) {
      console.error("Upload failed:", err)
      setError(err?.response?.data?.detail || "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (!detectionId) return

    let cancelled = false
    const interval = setInterval(async () => {
      try {
        const s = await apiClient.getDetectionStatus(detectionId)
        if (cancelled) return
        setStatus(s)
        setResult(s)

        if (s.status === "completed" || s.status === "failed") {
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Failed to fetch detection status:", err)
      }
    }, 2000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [detectionId])

  return {
    uploadVideo,
    isUploading,
    error,
    result,
    detectionId,
    status,
  }
}
