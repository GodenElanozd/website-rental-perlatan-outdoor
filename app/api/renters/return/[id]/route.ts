import { type NextRequest, NextResponse } from "next/server"
import { getRenter, updateRenter, updateEquipment, createProfit, getEquipmentByName } from "@/lib/redis"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get renter data
    const renter = await getRenter(params.id)
    if (!renter) {
      return NextResponse.json({ error: "Renter not found" }, { status: 404 })
    }

    if (renter.status !== "Aktif") {
      return NextResponse.json({ error: "Rental is not active" }, { status: 400 })
    }

    // Update renter status to completed first
    await updateRenter(params.id, { status: "Selesai" })

    // Return equipment to stock and update availability
    const updatePromises = renter.items.map(async (itemName) => {
      const equipment = await getEquipmentByName(itemName)
      if (equipment) {
        // Increase available count when equipment is returned
        const newAvailable = Math.min(equipment.available + 1, equipment.stock)
        await updateEquipment(equipment.id, {
          available: newAvailable,
        })
        console.log(`Returned ${itemName}: available ${equipment.available} -> ${newAvailable}`)
      } else {
        console.warn(`Equipment not found: ${itemName}`)
      }
    })

    await Promise.all(updatePromises)

    // Add profit when equipment is returned
    await createProfit({
      renterId: params.id,
      amount: renter.totalAmount || 0,
    })

    return NextResponse.json({
      success: true,
      message: "Equipment returned successfully and profit added",
      profitAdded: renter.totalAmount || 0,
    })
  } catch (error) {
    console.error("Return processing error:", error)
    return NextResponse.json({ error: "Failed to process return" }, { status: 500 })
  }
}
