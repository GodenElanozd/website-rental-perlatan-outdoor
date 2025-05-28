import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

// Types
export interface Renter {
  id: string
  name: string
  phone: string
  startDate: string
  endDate: string
  items: string[]
  status: "Aktif" | "Selesai" | "Dibatalkan"
  totalAmount: number // Changed from deposit to totalAmount
  ktpImageUrl?: string
  notes?: string
  createdAt: string
}

export interface Equipment {
  id: string
  name: string
  category: string
  stock: number
  available: number
  price: number
  condition: "Baik" | "Maintenance" | "Rusak"
  description: string
  imageUrl?: string
  createdAt: string
}

export interface Transaction {
  id: string
  renterId: string
  renterName: string
  items: string[]
  startDate: string
  endDate: string
  total: number
  status: "Berlangsung" | "Selesai" | "Terlambat"
  createdAt: string
}

export interface Settings {
  id: string
  storeName: string
  storeDescription: string
  address: string
  phone: string
  whatsapp: string
  email: string
  operatingHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
    holiday: string
  }
  mapUrl: string
  socialMedia: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  heroTitle: string
  heroSubtitle: string
  aboutUs: string
  logoUrl?: string // Added logo URL
  guideImages?: {
    tenda?: string
    carrier?: string
    sleepingBag?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Profit {
  id: string
  renterId: string
  amount: number
  createdAt: string
}

// Redis Keys
export const KEYS = {
  RENTERS: "renters",
  EQUIPMENT: "equipment",
  TRANSACTIONS: "transactions",
  SETTINGS: "settings:main",
  PROFITS: "profits",
  RENTER: (id: string) => `renter:${id}`,
  EQUIPMENT_ITEM: (id: string) => `equipment:${id}`,
  TRANSACTION: (id: string) => `transaction:${id}`,
  PROFIT: (id: string) => `profit:${id}`,
}

// Helper functions
export const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9)

// Profit operations
export const createProfit = async (profit: Omit<Profit, "id" | "createdAt">) => {
  const id = generateId()
  const newProfit: Profit = {
    ...profit,
    id,
    createdAt: new Date().toISOString(),
  }

  await redis.hset(KEYS.PROFIT(id), newProfit)
  await redis.sadd(KEYS.PROFITS, id)

  return newProfit
}

export const getTotalProfit = async (): Promise<number> => {
  const profitIds = await redis.smembers(KEYS.PROFITS)
  const profits = await Promise.all(
    profitIds.map(async (id) => {
      const profit = await redis.hgetall(KEYS.PROFIT(id))
      return profit as Profit
    }),
  )
  return profits.filter(Boolean).reduce((sum, profit) => sum + profit.amount, 0)
}

// Settings operations
export const getSettings = async (): Promise<Settings | null> => {
  const settings = await redis.hgetall(KEYS.SETTINGS)
  return settings ? (settings as Settings) : null
}

export const updateSettings = async (updates: Partial<Settings>) => {
  const currentSettings = await getSettings()
  const newSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  if (!currentSettings) {
    newSettings.id = generateId()
    newSettings.createdAt = new Date().toISOString()
  }

  await redis.hset(KEYS.SETTINGS, newSettings)
  return newSettings
}

export const createDefaultSettings = async () => {
  const defaultSettings: Settings = {
    id: generateId(),
    storeName: "MountainGear",
    storeDescription: "Rental alat gunung terpercaya untuk petualangan Anda",
    address: "Jl. Pendaki No. 123, Bandung, Jawa Barat 40123",
    phone: "+62 22-1234-5678",
    whatsapp: "+62 812-3456-7890",
    email: "info@mountaingear.com",
    operatingHours: {
      monday: "08:00 - 20:00",
      tuesday: "08:00 - 20:00",
      wednesday: "08:00 - 20:00",
      thursday: "08:00 - 20:00",
      friday: "08:00 - 20:00",
      saturday: "08:00 - 22:00",
      sunday: "07:00 - 21:00",
      holiday: "09:00 - 18:00",
    },
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467128636!2d107.6098344!3d-6.914744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1635000000000!5m2!1sen!2sid",
    socialMedia: {
      instagram: "@mountaingear",
      facebook: "MountainGear",
    },
    heroTitle: "Rental Alat Gunung Terpercaya",
    heroSubtitle: "Sewa peralatan mendaki berkualitas tinggi untuk petualangan Anda. Lengkap, aman, dan terjangkau.",
    aboutUs:
      "MountainGear adalah penyedia rental alat gunung terpercaya dengan pengalaman lebih dari 10 tahun. Kami menyediakan peralatan berkualitas tinggi untuk mendukung petualangan mendaki Anda.",
    guideImages: {
      tenda: "",
      carrier: "",
      sleepingBag: "",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await redis.hset(KEYS.SETTINGS, defaultSettings)
  return defaultSettings
}

// Renter operations
export const createRenter = async (renter: Omit<Renter, "id" | "createdAt">) => {
  const id = generateId()
  const newRenter: Renter = {
    ...renter,
    id,
    createdAt: new Date().toISOString(),
  }

  await redis.hset(KEYS.RENTER(id), newRenter)
  await redis.sadd(KEYS.RENTERS, id)

  return newRenter
}

export const getRenter = async (id: string): Promise<Renter | null> => {
  const renter = await redis.hgetall(KEYS.RENTER(id))
  return renter ? (renter as Renter) : null
}

export const getAllRenters = async (): Promise<Renter[]> => {
  const renterIds = await redis.smembers(KEYS.RENTERS)
  const renters = await Promise.all(
    renterIds.map(async (id) => {
      const renter = await redis.hgetall(KEYS.RENTER(id))
      return renter as Renter
    }),
  )
  return renters.filter(Boolean).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const updateRenter = async (id: string, updates: Partial<Renter>) => {
  await redis.hset(KEYS.RENTER(id), updates)
  return getRenter(id)
}

export const deleteRenter = async (id: string) => {
  await redis.del(KEYS.RENTER(id))
  await redis.srem(KEYS.RENTERS, id)
}

// Equipment operations
export const createEquipment = async (equipment: Omit<Equipment, "id" | "createdAt">) => {
  const id = generateId()
  const newEquipment: Equipment = {
    ...equipment,
    id,
    createdAt: new Date().toISOString(),
  }

  await redis.hset(KEYS.EQUIPMENT_ITEM(id), newEquipment)
  await redis.sadd(KEYS.EQUIPMENT, id)

  return newEquipment
}

export const getEquipment = async (id: string): Promise<Equipment | null> => {
  const equipment = await redis.hgetall(KEYS.EQUIPMENT_ITEM(id))
  return equipment ? (equipment as Equipment) : null
}

export const getAllEquipment = async (): Promise<Equipment[]> => {
  const equipmentIds = await redis.smembers(KEYS.EQUIPMENT)
  const equipment = await Promise.all(
    equipmentIds.map(async (id) => {
      const item = await redis.hgetall(KEYS.EQUIPMENT_ITEM(id))
      return item as Equipment
    }),
  )
  return equipment.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name))
}

export const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
  await redis.hset(KEYS.EQUIPMENT_ITEM(id), updates)
  return getEquipment(id)
}

export const deleteEquipment = async (id: string) => {
  await redis.del(KEYS.EQUIPMENT_ITEM(id))
  await redis.srem(KEYS.EQUIPMENT, id)
}

// Add this function after the existing equipment operations:
export const getEquipmentByName = async (name: string): Promise<Equipment | null> => {
  const allEquipment = await getAllEquipment()
  return allEquipment.find((eq) => eq.name === name) || null
}

// Transaction operations
export const createTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
  const id = generateId()
  const newTransaction: Transaction = {
    ...transaction,
    id,
    createdAt: new Date().toISOString(),
  }

  await redis.hset(KEYS.TRANSACTION(id), newTransaction)
  await redis.sadd(KEYS.TRANSACTIONS, id)

  return newTransaction
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const transactionIds = await redis.smembers(KEYS.TRANSACTIONS)
  const transactions = await Promise.all(
    transactionIds.map(async (id) => {
      const transaction = await redis.hgetall(KEYS.TRANSACTION(id))
      return transaction as Transaction
    }),
  )
  return transactions.filter(Boolean).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Update the createRenter function to handle equipment booking:
export const createRenterWithBooking = async (renter: Omit<Renter, "id" | "createdAt">, equipmentIds: string[]) => {
  const id = generateId()
  const newRenter: Renter = {
    ...renter,
    id,
    createdAt: new Date().toISOString(),
  }

  // Save renter
  await redis.hset(KEYS.RENTER(id), newRenter)
  await redis.sadd(KEYS.RENTERS, id)

  // Reduce equipment availability
  for (const equipmentId of equipmentIds) {
    const equipment = await getEquipment(equipmentId)
    if (equipment && equipment.available > 0) {
      await updateEquipment(equipmentId, {
        available: equipment.available - 1,
      })
    }
  }

  return newRenter
}
