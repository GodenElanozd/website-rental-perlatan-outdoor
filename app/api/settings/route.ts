import { type NextRequest, NextResponse } from "next/server"
import { getSettings, updateSettings, createDefaultSettings } from "@/lib/redis"

export async function GET() {
  try {
    let settings = await getSettings()

    // Create default settings if none exist
    if (!settings) {
      settings = await createDefaultSettings()
    }

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Get current settings to check if there's an old logo to delete
    const currentSettings = await getSettings()

    // If there's a new logo URL and an old logo exists, we should delete the old one
    // Note: In a real production environment, you would implement actual file deletion
    // For now, we'll just update the settings

    const settings = await updateSettings(body)
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
