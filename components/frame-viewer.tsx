"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FrameViewer() {
  const [currentFrame, setCurrentFrame] = useState(1000)
  const totalFrames = 2500

  return (
    <div className="space-y-4">
      {/* Video frame placeholder */}
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-muted-foreground mb-2">▶</div>
          <p className="text-muted-foreground">Frame {currentFrame}</p>
        </div>
      </div>

      {/* Frame scrubber */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Frame</span>
          <span>
            {currentFrame} / {totalFrames}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max={totalFrames}
          value={currentFrame}
          onChange={(e) => setCurrentFrame(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentFrame(Math.max(1, currentFrame - 10))}
          className="flex-1 gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentFrame(Math.min(totalFrames, currentFrame + 10))}
          className="flex-1 gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
