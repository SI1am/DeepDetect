import { type NextRequest, NextResponse } from "next/server"
import { detectionStore } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const history = Array.from(detectionStore.values())
    return NextResponse.json(history)
  } catch (error) {
    console.error("History error:", error)
    return NextResponse.json({ error: "Failed to get history" }, { status: 500 })
  }
}
