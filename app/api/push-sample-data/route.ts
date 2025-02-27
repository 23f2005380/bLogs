import { NextResponse } from "next/server"
import { pushSampleData } from "@/lib/sampleData"

export async function GET() {
  try {
    await pushSampleData()
    return NextResponse.json({ message: "Sample data pushed successfully" })
  } catch (error) {
    console.error("Error pushing sample data:", error)
    return NextResponse.json({ error: "Failed to push sample data" }, { status: 500 })
  }
}

