"use client"

import { useState } from "react"
import { UploadArea } from "@/components/upload-area"
import { DetectionProgress } from "@/components/detection-progress"
import { ResultsDashboard } from "@/components/results-dashboard"
import { useDetection } from "@/hooks/use-detection"

type DetectionPhase = "upload" | "processing" | "results"

export function MainContent() {
  const [phase, setPhase] = useState<DetectionPhase>("upload")
  const { uploadVideo, isUploading, error, result, detectionId, status } = useDetection()

  const handleUploadStart = () => {
    setPhase("processing")
  }

  const handleUploadComplete = () => {
    setPhase("results")
  }

  const handleNewAnalysis = () => {
    setPhase("upload")
  }

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 w-full">
      <div className="max-w-4xl mx-auto">
        {phase === "upload" && (
          <UploadArea
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            uploadVideo={uploadVideo}
            isUploading={isUploading}
            error={error}
          />
        )}
        {phase === "processing" && (
          <DetectionProgress
            progress={0} // You can update this based on upload progress if needed
            onComplete={handleUploadComplete}
            isUploading={isUploading}
            error={error}
            detectionId={detectionId}
            status={status}
          />
        )}
        {phase === "results" && result && (
          <ResultsDashboard
            onNewAnalysis={handleNewAnalysis}
            videoId={result.id}
            verdict={result.verdict}
            score={result.overallScore}
            confidence={result.confidence}
            totalFrames={result.totalFrames}
            processingTime={result.processingTime}
            artifacts={result.artifacts}
          />
        )}
      </div>
    </main>
  )
}
