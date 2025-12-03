"use client"

import { useEffect, useRef } from "react"

export function FloatingOrbs() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const orbs = container.querySelectorAll(".orb")

    orbs.forEach((orb, index) => {
      const duration = 20 + index * 5
      const delay = index * 2

      orb.animate(
        [
          { transform: "translate(0, 0)", opacity: 0.3 },
          { transform: "translate(100px, -100px)", opacity: 0.5 },
          { transform: "translate(-100px, 100px)", opacity: 0.3 },
          { transform: "translate(0, 0)", opacity: 0.3 },
        ],
        {
          duration: duration * 1000,
          delay: delay * 1000,
          iterations: Number.POSITIVE_INFINITY,
          easing: "ease-in-out",
        },
      )
    })
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />

      {/* Floating orbs with subtle animation */}
      <div className="orb absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="orb absolute top-40 right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="orb absolute bottom-20 left-1/2 w-80 h-80 rounded-full bg-primary/3 blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
