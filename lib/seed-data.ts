import { createEquipment } from "./redis"

const sampleEquipment = [
  {
    name: "Tenda Dome 2-3 Orang",
    category: "Tenda",
    stock: 5,
    available: 5,
    price: 50000,
    condition: "Baik" as const,
    description: "Tenda dome berkualitas tinggi untuk 2-3 orang, tahan angin dan air",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Carrier 60L Eiger",
    category: "Carrier",
    stock: 8,
    available: 8,
    price: 40000,
    condition: "Baik" as const,
    description: "Carrier 60L dengan sistem ventilasi punggung, cocok untuk pendakian 2-3 hari",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Sleeping Bag -5°C",
    category: "Sleeping Bag",
    stock: 10,
    available: 0,
    price: 25000,
    condition: "Maintenance" as const,
    description: "Sleeping bag dengan rating suhu -5°C, ringan dan kompak",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Kompor Gas Portable",
    category: "Kompor",
    stock: 12,
    available: 12,
    price: 20000,
    condition: "Baik" as const,
    description: "Kompor gas portable dengan sistem piezo ignition",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Matras Foam 10mm",
    category: "Matras",
    stock: 15,
    available: 15,
    price: 15000,
    condition: "Baik" as const,
    description: "Matras foam tebal 10mm untuk kenyamanan tidur di alam",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Nesting Set 4 Pcs",
    category: "Nesting",
    stock: 10,
    available: 10,
    price: 18000,
    condition: "Baik" as const,
    description: "Set peralatan masak 4 pieces, anti lengket dan ringan",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Trekking Pole Carbon",
    category: "Trekking Pole",
    stock: 6,
    available: 6,
    price: 30000,
    condition: "Baik" as const,
    description: "Trekking pole carbon fiber, adjustable dan ultra ringan",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Jas Hujan Set",
    category: "Jas Hujan",
    stock: 20,
    available: 20,
    price: 22000,
    condition: "Baik" as const,
    description: "Jas hujan set (atasan + bawahan) waterproof dan breathable",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Headlamp LED 300 Lumen",
    category: "Headlamp",
    stock: 8,
    available: 0,
    price: 12000,
    condition: "Maintenance" as const,
    description: "Headlamp LED 300 lumen dengan baterai rechargeable",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
]

export const seedEquipment = async () => {
  try {
    for (const equipment of sampleEquipment) {
      await createEquipment(equipment)
    }
    console.log("Sample equipment data seeded successfully")
  } catch (error) {
    console.error("Failed to seed equipment data:", error)
  }
}
