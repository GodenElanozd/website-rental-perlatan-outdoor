import { NextResponse } from "next/server"
import { getTotalProfit } from "@/lib/redis"

export async function GET() {
  try {
    const totalProfit = await getTotalProfit()
    return NextResponse.json({ totalProfit })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profit data" }, { status: 500 })
  }
}
