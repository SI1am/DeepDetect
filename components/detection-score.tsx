"use client"

interface DetectionScoreProps {
  /** 0–100 overall score (e.g. fake probability in %) */
  score: number
  verdict: "Real" | "Synthetic" | "Uncertain"
  /** 0–100 confidence from backend */
  confidence: number
  /** Total frames analyzed (from backend.totalFrames) */
  totalFrames?: number
  /** Processing time in seconds (from backend.processingTime) */
  processingTime?: number
  /** Optional: model name to display */
  modelName?: string
}

export function DetectionScore({
  score,
  verdict,
  confidence,
  totalFrames,
  processingTime,
  modelName = "Deepfake Detection Model",
}: DetectionScoreProps) {
  const getVerdictColor = (v: string) => {
    if (v === "Real") return "text-green-600"
    if (v === "Synthetic") return "text-red-600"
    return "text-yellow-600"
  }

  const getScoreColor = (s: number) => {
    if (s < 33) return "bg-green-600"
    if (s < 66) return "bg-yellow-600"
    return "bg-red-600"
  }

  // Clamp values defensively
  const clampedScore = Math.min(Math.max(score, 0), 100)
  const clampedConfidence = Math.min(Math.max(confidence, 0), 100)

  // Fallbacks if backend didn’t send these (just to avoid blanks)
  const framesText =
    typeof totalFrames === "number" ? totalFrames.toLocaleString() : "N/A"

  const processingText =
    typeof processingTime === "number"
      ? `${Math.round(processingTime)} seconds`
      : "N/A"

  return (
    <div className="flex items-center gap-8">
      <div className="flex-1">
        <div className="relative h-40 w-40 mx-auto">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted"
            />
            {/* Progress circle – 345 is ~circumference; score is 0–100 */}
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${(clampedScore / 100) * 345} 345`}
              strokeLinecap="round"
              className={getScoreColor(clampedScore)}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-foreground">
              {Math.round(clampedScore)}
            </div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Verdict</p>
          <p className={`text-3xl font-bold ${getVerdictColor(verdict)}`}>
            {verdict}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">
            Confidence Level
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${clampedConfidence}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {Math.round(clampedConfidence)}%
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <p className="text-sm font-medium text-foreground">
            Analysis Summary
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {framesText} frames analyzed</li>
            <li>• Processing time: {processingText}</li>
            <li>• Model: {modelName}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
