"use client"

export function FrameTimeline() {
  const frames = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    score: Math.random() * 100,
  }))

  return (
    <div className="space-y-2">
      <div className="flex gap-1 h-16">
        {frames.map((frame) => (
          <div key={frame.id} className="flex-1 flex flex-col items-center justify-end gap-1 group cursor-pointer">
            <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              {Math.round(frame.score)}
            </div>
            <div
              className="w-full flex-1 bg-primary rounded-sm hover:opacity-80 transition-opacity"
              style={{
                opacity: Math.max(0.2, frame.score / 100),
                backgroundColor: frame.score > 70 ? "rgb(239, 68, 68)" : "rgb(16, 185, 129)",
              }}
              title={`Frame ${frame.id * 250}: ${Math.round(frame.score)}`}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Timeline shows synthetic probability per frame. Hover to see scores.
      </p>
    </div>
  )
}
