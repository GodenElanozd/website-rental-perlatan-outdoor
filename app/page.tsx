"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mountain, Shield, Clock, Star, Menu, X } from "lucide-react"
import { useState, useEffect, lazy, Suspense } from "react"
import { PageLoader, SkeletonCard } from "@/components/ui/loading"
import { OptimizedImage } from "@/components/optimized-image"
import { fetchWithCache } from "@/lib/api-utils"

// Lazy load components that are not immediately visible
const Footer = lazy(() => import("@/components/footer"))

export default function HomePage() {
  const [popularEquipment, setPopularEquipment] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    const initializePage = async () => {
      setIsInitialLoading(true)
      try {
        // Fetch data in parallel for better performance
        const [equipmentData, settingsData] = await Promise.all([
          fetchWithCache("/api/equipment"),
          fetchWithCache("/api/settings"),
        ])

        // Get 4 random items
        const shuffled = equipmentData.sort(() => 0.5 - Math.random())
        setPopularEquipment(shuffled.slice(0, 4))
        setSettings(settingsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsInitialLoading(false)
        setIsDataLoading(false)
      }
    }

    initializePage()
  }, [])

  // Tambahkan useEffect untuk refresh settings setelah update
  useEffect(() => {
    const handleStorageChange = () => {
      fetchSettings()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Update fetchSettings untuk handle error dengan lebih baik
  const fetchSettings = async () => {
    try {
      const data = await fetchWithCache("/api/settings")
      setSettings(data)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  if (isInitialLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  Beranda
                </Link>
                <Link
                  href="/katalog"
                  className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
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
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
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
                  className="text-gray-900 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Beranda
                </Link>
                <Link
                  href="/katalog"
                  className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
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
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {settings?.heroTitle || "Rental Alat Gunung Terpercaya"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {settings?.heroSubtitle ||
                "Sewa peralatan mendaki berkualitas tinggi untuk petualangan Anda. Lengkap, aman, dan terjangkau."}
            </p>
            <div className="space-x-4">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link href="/katalog">Lihat Katalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mengapa Pilih Kami?</h2>
            <p className="text-lg text-gray-600">Komitmen kami untuk memberikan layanan terbaik</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Peralatan Berkualitas</h3>
                <p className="text-gray-600">Semua alat telah teruji dan dalam kondisi prima untuk keamanan Anda</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Proses Cepat</h3>
                <p className="text-gray-600">Booking online mudah dan proses pengambilan yang efisien</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Harga Terjangkau</h3>
                <p className="text-gray-600">Tarif kompetitif dengan kualitas terjamin</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Alat Populer</h2>
            <p className="text-lg text-gray-600">Peralatan yang paling sering disewa</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {isDataLoading
              ? // Show skeleton loading
                [...Array(4)].map((_, index) => <SkeletonCard key={index} />)
              : popularEquipment.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <OptimizedImage
                        src={item.imageUrl}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold mb-2">{item.name}</h3>
                      <p className="text-green-600 font-bold mb-3">Rp {item.price?.toLocaleString()}/hari</p>
                      <Button asChild className="w-full" size="sm" disabled={item.available === 0}>
                        <Link href={item.available > 0 ? `/booking?item=${item.id}` : "#"}>
                          {item.available > 0 ? "Sewa Sekarang" : "Tidak Tersedia"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/katalog">Lihat Semua Alat</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap untuk Petualangan Berikutnya?</h2>
          <p className="text-xl mb-8">Booking sekarang dan dapatkan peralatan terbaik untuk pendakian Anda</p>
          <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
            <Link href="/katalog">Mulai Booking</Link>
          </Button>
        </div>
      </section>

      {/* Footer - Lazy loaded */}
      <Suspense fallback={<div className="h-64 bg-gray-900"></div>}>
        <Footer settings={settings} />
      </Suspense>
    </div>
  )
}
