"use client"

import { useEffect, useState } from "react"
import type { DetectionResult } from "@/lib/api-client"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DetectionProgressProps {
  progress: number
  onComplete: () => void
  isUploading?: boolean
  error?: string | null
  detectionId?: string | null
  status?: DetectionResult | null
}

export function DetectionProgress({ progress, onComplete, detectionId, status }: DetectionProgressProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [statusText, setStatusText] = useState("Uploading...")
  const [processedFrames, setProcessedFrames] = useState(0)
  const [totalFrames, setTotalFrames] = useState(0)

  // Update UI based on real backend `status` object when available
  useEffect(() => {
    if (!status) return

    const processed = status.perFrameScores?.length ?? 0
    const total = status.totalFrames ?? processed

    setProcessedFrames(processed)
    setTotalFrames(total)

    if (status.status === "completed" || status.status === "failed") {
      setCurrentProgress(100)
      setStatusText("Analysis Complete")
      setTimeout(onComplete, 500)
      return
    }

    if (status.status === "processing") {
      setStatusText("Processing frames...")
      if (total > 0) {
        const pct = Math.min(100, Math.round((processed / total) * 100))
        setCurrentProgress(pct)
      }
    }
  }, [status, onComplete])

  // Fallback to fake progress if no detectionId
  useEffect(() => {
    if (detectionId) return

    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        const next = prev + Math.random() * 15
        if (next >= 100) {
          clearInterval(interval)
          setStatusText("Analysis Complete")
          setTimeout(onComplete, 500)
          return 100
        }

        if (next < 30) setStatusText("Uploading...")
        else if (next < 60) setStatusText("Processing frames...")
        else if (next < 90) setStatusText("Analyzing patterns...")
        else setStatusText("Finalizing results...")

        return next
      })
    }, 300)

    return () => clearInterval(interval)
  }, [detectionId, onComplete])

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Card className="w-full max-w-md p-8 animate-fade-in-up hover-glow">
        <div className="space-y-6">
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-foreground mb-2">Analyzing Video</h2>
            <p className="text-muted-foreground animate-pulse-subtle">{statusText}</p>
          </div>

          <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <Progress value={Math.min(currentProgress, 99)} className="h-2" />
            <p className="text-sm text-muted-foreground text-center animate-pulse-subtle">
              {Math.round(Math.min(currentProgress, 99))}%
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex justify-between hover:text-foreground/80 transition-colors">
              <span>Frames processed</span>
              <span className="font-mono">{`${processedFrames.toLocaleString()} / ${totalFrames.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between hover:text-foreground/80 transition-colors">
              <span>Detection model</span>
              <span className="font-mono animate-pulse">{status?.modelName ?? "XceptionNet v2"}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
