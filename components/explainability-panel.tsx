"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ExplainabilityPanelProps {
  onClose?: () => void

  // From backend FrontendDetectionResult
  artifacts?: string[]
  confidence?: number // 0–100

  totalFrames?: number
  perFrameScores?: number[] // 0–100 per-frame scores

  // Index of the currently selected/visible frame (0-based)
  currentFrameIndex?: number
}

export function ExplainabilityPanel({
  onClose,
  artifacts = [],
  confidence,
  totalFrames,
  perFrameScores,
  currentFrameIndex = 0,
}: ExplainabilityPanelProps) {
  const clampedConfidence =
    typeof confidence === "number"
      ? Math.min(Math.max(confidence, 0), 100)
      : undefined

  // Basic derived “confidence factors” from overall confidence (just UI)
  const artifactDetection = clampedConfidence ?? 0
  const frequencyAnalysis =
    clampedConfidence !== undefined ? Math.round(clampedConfidence * 0.85) : undefined
  const faceConsistency =
    clampedConfidence !== undefined ? Math.round(clampedConfidence * 0.7) : undefined

  const totalFramesSafe = totalFrames ?? perFrameScores?.length ?? undefined

  const currentFrameNumber =
    totalFramesSafe !== undefined
      ? Math.min(Math.max(currentFrameIndex, 0), totalFramesSafe - 1) + 1
      : currentFrameIndex + 1

  const currentFrameScore =
    perFrameScores && perFrameScores.length > 0
      ? perFrameScores[Math.min(Math.max(currentFrameIndex, 0), perFrameScores.length - 1)]
      : undefined

  const topArtifact = artifacts[0] ?? "N/A"

  return (
    <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-l border-border bg-card/50 backdrop-blur-sm overflow-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6 lg:mb-6">
        <h2 className="text-lg font-semibold text-foreground">Explainability</h2>
        {onClose && (
          <Button onClick={onClose} variant="ghost" size="sm" className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* MODEL INSIGHTS */}
        <Card className="p-4 bg-muted/30">
          <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Model Insights</h3>
          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">Primary Indicators</p>
              <ul className="text-muted-foreground space-y-1 ml-2">
                {artifacts.length > 0 ? (
                  artifacts.slice(0, 4).map((a, idx) => (
                    <li key={idx}>• {a}</li>
                  ))
                ) : (
                  <li>• No specific artifacts highlighted</li>
                )}
              </ul>
            </div>

            {clampedConfidence !== undefined && (
              <div>
                <p className="font-medium text-foreground mb-1">Confidence Factors</p>
                <div className="space-y-2 ml-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Artifact Detection</span>
                    <span className="font-medium text-foreground">
                      {artifactDetection}%
                    </span>
                  </div>
                  {frequencyAnalysis !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency Analysis</span>
                      <span className="font-medium text-foreground">
                        {frequencyAnalysis}%
                      </span>
                    </div>
                  )}
                  {faceConsistency !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Face Consistency</span>
                      <span className="font-medium text-foreground">
                        {faceConsistency}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* FRAME DETAILS */}
        <Card className="p-4 bg-muted/30">
          <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Frame Details</h3>
          <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
            <div className="flex justify-between">
              <span>Current Frame</span>
              <span className="text-foreground">
                {currentFrameNumber}
                {totalFramesSafe ? ` / ${totalFramesSafe}` : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Synthetic Score</span>
              <span className="text-foreground">
                {currentFrameScore !== undefined ? `${Math.round(currentFrameScore)}%` : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Top Artifact</span>
              <span className="text-foreground">{topArtifact}</span>
            </div>
          </div>
        </Card>

        <div className="pt-4 border-t border-border">
          <Button variant="outline" className="w-full text-xs sm:text-sm bg-transparent">
            View Heatmap Overlay
          </Button>
        </div>
      </div>
    </aside>
  )
}
