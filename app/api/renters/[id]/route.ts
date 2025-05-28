import { type NextRequest, NextResponse } from "next/server"
import { getRenter, updateRenter, deleteRenter } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const renter = await getRenter(params.id)
    if (!renter) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 })
    }
    return NextResponse.json(renter)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch renter" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const renter = await updateRenter(params.id, body)
    return NextResponse.json(renter)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update renter" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteRenter(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete renter" }, { status: 500 })
  }
}
