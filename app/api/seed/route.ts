import { NextResponse } from "next/server"
import { seedEquipment } from "@/lib/seed-data"

export async function POST() {
  try {
    await seedEquipment()
    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
