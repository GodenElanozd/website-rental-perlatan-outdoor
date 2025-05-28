import { type NextRequest, NextResponse } from "next/server"
import { createRenter, getAllRenters } from "@/lib/redis"

export async function GET() {
  try {
    const renters = await getAllRenters()
    return NextResponse.json(renters)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch renters" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const renter = await createRenter(body)
    return NextResponse.json(renter)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create renter" }, { status: 500 })
  }
}
