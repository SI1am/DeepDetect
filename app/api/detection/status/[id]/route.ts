import { type NextRequest, NextResponse } from "next/server"
import { detectionStore } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = detectionStore.get(id)

    if (!result) {
      return NextResponse.json({ error: "Detection not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Status error:", error)
    return NextResponse.json({ error: "Failed to get status" }, { status: 500 })
  }
}
