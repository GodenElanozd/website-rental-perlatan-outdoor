"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mountain, Search, Filter, Menu, X } from "lucide-react"
import { PageLoader, SkeletonCard } from "@/components/ui/loading"
import { OptimizedImage } from "@/components/optimized-image"
import { fetchWithCache } from "@/lib/api-utils"

const categories = [
  "Semua",
  "Tenda",
  "Carrier",
  "Sleeping Bag",
  "Kompor",
  "Matras",
  "Nesting",
  "Trekking Pole",
  "Jas Hujan",
  "Headlamp",
]

export default function KatalogPage() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Semua")
  const [sortBy, setSortBy] = useState("name")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const initializePage = async () => {
      setIsInitialLoading(true)
      try {
        // Fetch data in parallel for better performance
        const [equipmentData, settingsData] = await Promise.all([
          fetchWithCache("/api/equipment"),
          fetchWithCache("/api/settings"),
        ])

        setEquipment(equipmentData)
        setSettings(settingsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsInitialLoading(false)
        setLoading(false)
      }
    }

    initializePage()
  }, [])

  const filteredEquipment = equipment
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "Semua" || item.category === selectedCategory),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "availability") return b.available - a.available
      return 0
    })

  if (isInitialLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              {settings?.logoUrl ? (
                <OptimizedImage
                  src={settings.logoUrl}
                  alt={settings.storeName || "MountainGear"}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                  priority
                />
              ) : (
                <>
                  <Mountain className="h-8 w-8 text-green-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">{settings?.storeName || "MountainGear"}</span>
                </>
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  Beranda
                </Link>
                <Link
                  href="/katalog"
                  className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Katalog
                </Link>
                <Link
                  href="/panduan"
                  className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Panduan
                </Link>
                <Link
                  href="/lokasi"
                  className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Lokasi
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <Link
                  href="/"
                  className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  href="/katalog"
                  className="text-gray-900 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Katalog
                </Link>
                <Link
                  href="/panduan"
                  className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Panduan
                </Link>
                <Link
                  href="/lokasi"
                  className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Lokasi
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Katalog Alat Gunung</h1>
          <p className="text-lg text-gray-600">Pilih peralatan yang Anda butuhkan untuk petualangan mendaki</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari alat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama A-Z</SelectItem>
                <SelectItem value="price">Harga Terendah</SelectItem>
                <SelectItem value="availability">Ketersediaan</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredEquipment.length} alat ditemukan
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? // Show skeleton loading
              [...Array(8)].map((_, index) => <SkeletonCard key={index} />)
            : filteredEquipment.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative">
                      <OptimizedImage
                        src={item.imageUrl}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <Badge className={`absolute top-2 right-2 ${item.available > 0 ? "bg-green-500" : "bg-red-500"}`}>
                        {item.available > 0 ? "Tersedia" : "Habis"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
                    <Badge variant="outline" className="mb-2">
                      {item.category}
                    </Badge>
                    <p className="text-sm text-gray-600 mb-3">{item.description || "Deskripsi tidak tersedia"}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-green-600">Rp {item.price.toLocaleString()}/hari</span>
                      <span className="text-sm text-gray-500">Stok: {item.stock}</span>
                    </div>
                    <Button asChild className="w-full" disabled={item.available === 0}>
                      <Link href={item.available > 0 ? `/booking?item=${item.id}` : "#"}>
                        {item.available > 0 ? "Sewa Sekarang" : "Tidak Tersedia"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
        </div>

        {!loading && filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Tidak ada alat yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}
