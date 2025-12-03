"use client"

import { useState, useEffect } from "react"
import { Shield, Eye, Zap, AlertCircle, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FloatingOrbs } from "@/components/floating-orbs"

interface HomePageProps {
  onStartAnalysis: () => void
}

export function HomePage({ onStartAnalysis }: HomePageProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingOrbs />

      <section className="relative z-10 min-h-[90vh] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto text-center w-full">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block mb-4 sm:mb-6 animate-fade-in-up">
              <span className="glass-effect px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover-glow cursor-pointer transition-all hover:scale-105">
                Advanced Video Forensics
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 tracking-tight animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Detect <span className="gradient-text animate-gradient-shift">Deepfakes</span> with Confidence
            </h1>

            <p
              className="text-sm sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              DeepDetect uses state-of-the-art AI to analyze videos and identify synthetic or manipulated content with
              scientific precision.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up px-2"
              style={{ animationDelay: "0.3s" }}
            >
              <Button
                onClick={onStartAnalysis}
                size="lg"
                className="gap-2 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 hover-lift group w-full sm:w-auto"
              >
                Start Analysis
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-8 bg-transparent hover-scale w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Understanding Deepfakes</h2>
            <p className="text-sm sm:text-xl text-muted-foreground px-2">
              Learn about the technology, its implications, and how we detect it
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 stagger-children">
            {/* What are Deepfakes */}
            <Card className="p-6 sm:p-8 border-border/50 hover:border-primary/50 transition-all duration-500 hover-scale hover-glow group overflow-hidden relative animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-4 sm:mb-6 inline-block">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">What Are Deepfakes?</h3>
                <p className="text-xs sm:text-base text-muted-foreground">
                  Deepfakes are synthetic media created using deep learning technology to replace or manipulate video
                  and audio, often used to create convincing but false content.
                </p>
              </div>
            </Card>

            {/* Why It Matters */}
            <Card
              className="p-6 sm:p-8 border-border/50 hover:border-primary/50 transition-all duration-500 hover-scale hover-glow group overflow-hidden relative animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-4 sm:mb-6 inline-block">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Why It Matters</h3>
                <p className="text-xs sm:text-base text-muted-foreground">
                  Deepfakes pose significant risks to public trust, security, and democratic processes. Early detection
                  is critical in combating misinformation and fraud.
                </p>
              </div>
            </Card>

            {/* How We Detect */}
            <Card
              className="p-6 sm:p-8 border-border/50 hover:border-primary/50 transition-all duration-500 hover-scale hover-glow group overflow-hidden relative animate-fade-in-up sm:col-span-2 lg:col-span-1"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="mb-4 sm:mb-6 inline-block">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Our Detection Method</h3>
                <p className="text-xs sm:text-base text-muted-foreground">
                  We use advanced neural networks trained on diverse video datasets to identify artifacts,
                  inconsistencies, and digital signatures of manipulation.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
            <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Powerful Analysis Features</h2>
            <p className="text-sm sm:text-xl text-muted-foreground px-2">
              Comprehensive deepfake detection with actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 stagger-children">
            {/* Feature 1 */}
            <div className="flex gap-3 sm:gap-4 animate-fade-in-up group">
              <div className="flex-shrink-0 mt-1">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-125 group-hover:animate-glow transition-all duration-300">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  Real-time Detection
                </h3>
                <p className="text-xs sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Analyze videos efficiently with our optimized AI pipeline and get results as soon as processing is
                  complete.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-3 sm:gap-4 animate-fade-in-up group" style={{ animationDelay: "0.1s" }}>
              <div className="flex-shrink-0 mt-1">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-125 group-hover:animate-glow transition-all duration-300">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  Frame-by-Frame Analysis
                </h3>
                <p className="text-xs sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Detailed per-frame analysis shows where synthetic content is detected, along with confidence scores.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-3 sm:gap-4 animate-fade-in-up group" style={{ animationDelay: "0.2s" }}>
              <div className="flex-shrink-0 mt-1">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-125 group-hover:animate-glow transition-all duration-300">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-accent transition-colors">
                  Visual Heatmaps
                </h3>
                <p className="text-xs sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  See where manipulation may have occurred with intuitive heat-map style visualizations on the video.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-3 sm:gap-4 animate-fade-in-up group" style={{ animationDelay: "0.3s" }}>
              <div className="flex-shrink-0 mt-1">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-125 group-hover:animate-glow transition-all duration-300">
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 group-hover:text-accent transition-colors">
                  Model Explainability
                </h3>
                <p className="text-xs sm:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  Understand why content is flagged with explanations of detected artifacts and anomalies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect p-8 sm:p-12 rounded-2xl border hover-lift animate-fade-in-up group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 group-hover:gradient-text transition-all text-center">
                Ready to Detect Deepfakes?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 group-hover:text-foreground/70 transition-colors text-center">
                Upload a video to start your analysis and get instant results
              </p>
              <div className="flex justify-center px-2">
                <Button
                  onClick={onStartAnalysis}
                  size="lg"
                  className="gap-2 text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-12 hover-lift group/btn w-full sm:w-auto"
                >
                  Start Analyzing Now
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      <footer className="relative z-10 border-t border-border/40 py-6 sm:py-8 px-4 mt-12 sm:mt-20 animate-fade-in-up">
        <div className="max-w-6xl mx-auto text-center text-xs sm:text-sm text-muted-foreground">
          <p>DeepDetect © 2025. Advanced video forensics powered by AI.</p>
        </div>
      </footer>
    </main>
  )
}
