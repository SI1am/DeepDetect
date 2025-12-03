"use client"

import { Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DetectionScore } from "@/components/detection-score"
import { FrameViewer } from "@/components/frame-viewer"
import { FrameTimeline } from "@/components/frame-timeline"

type VerdictType = "Real" | "Synthetic" | "Uncertain"

interface ResultsDashboardProps {
  onNewAnalysis: () => void

  // Core detection result (mapped from backend by parent)
  videoId?: string
  verdict: VerdictType
  /** 0–100 overall score (e.g. fake probability %) */
  score: number
  /** 0–100 confidence */
  confidence: number
  /** Total frames analyzed */
  totalFrames?: number
  /** Processing time in seconds */
  processingTime?: number
  /** Artifact descriptions from backend */
  artifacts?: string[]
}

export function ResultsDashboard({
  onNewAnalysis,
  videoId,
  verdict,
  score,
  confidence,
  totalFrames,
  processingTime,
  artifacts = [],
}: ResultsDashboardProps) {
  const videoLabel = videoId ? `Analysis complete – Video ID: ${videoId}` : "Analysis complete"

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Detection Results</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{videoLabel}</p>
        </div>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            className="gap-2 bg-transparent text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4" />
            Report
          </Button>
          <Button
            onClick={onNewAnalysis}
            className="gap-2 text-xs sm:text-sm flex-1 sm:flex-none"
          >
            <RefreshCw className="h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Detection score card */}
      <Card className="p-4 sm:p-6">
        <DetectionScore
          score={score}
          verdict={verdict}
          confidence={confidence}
          totalFrames={totalFrames}
          processingTime={processingTime}
          modelName="Deepfake Detection Model"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-4">
          <Card className="p-4 sm:p-6 overflow-x-auto">
            <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">
              Frame Viewer
            </h3>
            {/* Later you can pass per-frame data into FrameViewer when it’s wired */}
            <FrameViewer />
          </Card>

          <Card className="p-4 sm:p-6 overflow-x-auto">
            <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">
              Per-Frame Analysis
            </h3>
            {/* Same here – you can pass per-frame scores to FrameTimeline later */}
            <FrameTimeline />
          </Card>
        </div>

        {/* Artifacts panel driven by backend artifacts */}
        <Card className="p-4 sm:p-6 bg-muted/30">
          <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">
            Key Artifacts
          </h3>
          <div className="space-y-3">
            {artifacts.length > 0 ? (
              artifacts.map((artifact, idx) => (
                <div
                  key={idx}
                  className="text-xs sm:text-sm text-muted-foreground"
                >
                  <p className="font-medium text-foreground mb-1">
                    Artifact {idx + 1}
                  </p>
                  <p>{artifact}</p>
                </div>
              ))
            ) : (
              <div className="text-xs sm:text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  No strong artifacts detected
                </p>
                <p>
                  The model did not highlight any specific visual inconsistencies
                  for this video.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
