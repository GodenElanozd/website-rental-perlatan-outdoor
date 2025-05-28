import { type NextRequest, NextResponse } from "next/server"
import { createEquipment, getAllEquipment } from "@/lib/redis"

export async function GET() {
  try {
    const equipment = await getAllEquipment()
    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const equipment = await createEquipment(body)
    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 })
  }
}
