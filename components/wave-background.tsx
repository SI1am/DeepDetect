"use client"

export function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-background via-background to-background">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Center point for radial pulse waves */}
        <defs>
          <radialGradient id="pulseGradient" cx="50%" cy="30%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.15)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.02)" />
          </radialGradient>
        </defs>

        {/* Pulsating radial circles - sends pulse every 5 seconds */}
        <circle
          cx="600"
          cy="80"
          r="100"
          fill="none"
          stroke="rgba(147, 51, 234, 0.3)"
          strokeWidth="2"
          className="animate-pulse-wave-1"
        />
        <circle
          cx="600"
          cy="80"
          r="100"
          fill="none"
          stroke="rgba(147, 51, 234, 0.2)"
          strokeWidth="2"
          className="animate-pulse-wave-2"
        />
        <circle
          cx="600"
          cy="80"
          r="100"
          fill="none"
          stroke="rgba(147, 51, 234, 0.1)"
          strokeWidth="2"
          className="animate-pulse-wave-3"
        />

        {/* First wave - slower animation */}
        <path
          d="M0,100 Q300,50 600,100 T1200,100 L1200,300 L0,300 Z"
          fill="rgba(147, 51, 234, 0.05)"
          className="animate-wave-1"
        />

        {/* Second wave - medium speed */}
        <path
          d="M0,150 Q300,100 600,150 T1200,150 L1200,300 L0,300 Z"
          fill="rgba(147, 51, 234, 0.08)"
          className="animate-wave-2"
        />

        {/* Third wave - fastest animation */}
        <path
          d="M0,120 Q300,70 600,120 T1200,120 L1200,300 L0,300 Z"
          fill="rgba(147, 51, 234, 0.12)"
          className="animate-wave-3"
        />

        {/* Fourth wave - very subtle */}
        <path
          d="M0,180 Q300,130 600,180 T1200,180 L1200,300 L0,300 Z"
          fill="rgba(147, 51, 234, 0.03)"
          className="animate-wave-4"
        />

        {/* Background glow from center */}
        <ellipse cx="600" cy="100" rx="400" ry="200" fill="url(#pulseGradient)" className="animate-pulse-glow" />
      </svg>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
    </div>
  )
}
