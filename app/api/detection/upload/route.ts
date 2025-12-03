import { type NextRequest, NextResponse } from "next/server"
import { generateMockDetectionResult, detectionStore } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("video") as File
    const filename = formData.get("filename") as string

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Generate mock detection result
    const result = generateMockDetectionResult(filename)

    // Store in memory
    detectionStore.set(result.id, result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
