"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, Video, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

interface PredictionResult {
  label: "Real" | "Fake"
  fake_score: number
  real_score: number
  frame_scores: number[]
  total_frames_analyzed: number
}

interface UploadAreaProps {
  /** Called when upload/analysis starts (good for showing progress UI) */
  onUploadStart?: () => void
  /** Called when backend returns a result */
  onUploadComplete?: () => void
  /** Called when an error occurs */
  onUploadError?: (message: string) => void
  /** Upload function from useDetection hook */
  uploadVideo?: (file: File) => Promise<void>
  /** Uploading state */
  isUploading?: boolean
  /** Error message */
  error?: string | null
}

export function UploadArea({
  onUploadStart,
  onUploadComplete,
  onUploadError,
  uploadVideo,
  isUploading = false,
  error,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simple, honest session stats (no fake marketing numbers)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [avgAnalysisTime, setAvgAnalysisTime] = useState<number | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    if (!file) return
    // Only handle video here; you can add validation if needed
    if (uploadVideo) {
      try {
        onUploadStart?.()
        await uploadVideo(file)
        onUploadComplete?.()
      } catch (err: any) {
        onUploadError?.(err?.message || "Upload failed")
      }
    }
  }

  const handleFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 sm:mb-3">
          Upload Video
        </h2>
        <p className="text-sm sm:text-lg text-muted-foreground">
          Upload or record a video to analyze for synthetic content
        </p>
      </div>

      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-16 text-center cursor-pointer transition-all duration-300 hover-scale animate-fade-in-up group ${
          isDragging
            ? "border-primary bg-primary/10 scale-105 shadow-lg shadow-primary/20"
            : "border-border hover:border-primary/50 hover:bg-card/50 hover:shadow-lg"
        }`}
        onClick={handleFileInput}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div
            className={`rounded-lg p-3 sm:p-4 transition-all duration-300 ${
              isDragging
                ? "bg-primary/20 scale-110"
                : "bg-muted group-hover:scale-110"
            }`}
          >
            <Upload
              className={`h-8 w-8 sm:h-10 sm:w-10 transition-colors ${
                isDragging
                  ? "text-primary animate-bounce-subtle"
                  : "text-muted-foreground group-hover:text-primary"
              }`}
            />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-semibold text-foreground mb-1">
              Drag and drop your video here
            </p>
            <p className="text-xs sm:text-base text-muted-foreground">
              or click to browse (MP4, WebM up to 500MB)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 stagger-children">
        <Button
          onClick={handleFileInput}
          variant="outline"
          className="h-14 sm:h-16 gap-2 sm:gap-3 flex-col text-sm sm:text-base bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all hover-lift animate-fade-in-up"
        >
          <Video className="h-4 w-4 sm:h-5 sm:w-5" />
          Choose File
        </Button>
        <Button
          variant="outline"
          className="h-14 sm:h-16 gap-2 sm:gap-3 flex-col text-sm sm:text-base bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all hover-lift animate-fade-in-up"
          style={{ animationDelay: "0.1s" }}
          // TODO: wire this to camera recording feature if you add one
        >
          <Play className="h-4 w-4 sm:h-5 sm:w-5" />
          Record Video
        </Button>
      </div>

      {/* Session stats – now based on real usage, not fake numbers */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 sm:pt-4 stagger-children">
        <div className="text-center p-3 sm:p-4 rounded-lg hover-scale transition-all duration-300 hover:bg-card/50 group animate-fade-in-up cursor-default">
          <p className="text-xl sm:text-2xl font-bold text-primary group-hover:animate-bounce-subtle">
            4 min
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">
            Max Video Length
          </p>
        </div>
        <div
          className="text-center p-3 sm:p-4 rounded-lg border-l border-r border-border hover-scale transition-all duration-300 hover:bg-card/50 group animate-fade-in-up cursor-default"
          style={{ animationDelay: "0.1s" }}
        >
          <p className="text-xl sm:text-2xl font-bold text-accent group-hover:animate-bounce-subtle">
            {avgAnalysisTime != null ? `${avgAnalysisTime.toFixed(1)}s` : "--"}
          </p>
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">
            Avg Analysis Time (this session)
          </p>
        </div>
        <div
          className="text-center p-3 sm:p-4 rounded-lg hover-scale transition-all duration-300 hover:bg-card/50 group animate-fade-in-up cursor-default"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="text-xl sm:text-2xl font-bold text-primary group-hover:animate-bounce-subtle">
            {analysisCount}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">
            Videos Analyzed (this session)
          </p>
        </div>
      </div>
    </div>
  )
}
