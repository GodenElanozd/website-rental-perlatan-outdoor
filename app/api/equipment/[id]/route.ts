import { type NextRequest, NextResponse } from "next/server"
import { getEquipment, updateEquipment, deleteEquipment } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const equipment = await getEquipment(params.id)
    if (!equipment) {
      return NextResponse.json({ error: "Equipment not found" }, { status: 404 })
    }
    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const equipment = await updateEquipment(params.id, body)
    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update equipment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteEquipment(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete equipment" }, { status: 500 })
  }
}
