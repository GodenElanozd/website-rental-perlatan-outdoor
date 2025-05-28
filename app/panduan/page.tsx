"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, Compass, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { PageLoader } from "@/components/ui/loading"

const guides = [
  {
    id: 1,
    title: "Cara Menggunakan Tenda Dome",
    category: "Peralatan",
    difficulty: "Pemula",
    duration: "5 menit",
    image: "/placeholder.svg?height=200&width=300",
    steps: [
      "Pilih lokasi yang datar dan bebas dari batu tajam",
      "Bentangkan groundsheet terlebih dahulu",
      "Pasang tenda inner dengan mengaitkan hook ke pole",
      "Pasang rainfly dan kencangkan guy rope",
      "Periksa kembali semua sambungan",
    ],
  },
  {
    id: 2,
    title: "Setting Carrier yang Benar",
    category: "Peralatan",
    difficulty: "Pemula",
    duration: "10 menit",
    image: "/placeholder.svg?height=200&width=300",
    steps: [
      "Atur panjang shoulder strap sesuai tinggi badan",
      "Posisikan hip belt di tulang pinggul",
      "Atur chest strap setinggi dada",
      "Distribusikan beban secara merata",
      "Test kenyamanan sebelum mendaki",
    ],
  },
  {
    id: 3,
    title: "Tips Menggunakan Sleeping Bag",
    category: "Peralatan",
    difficulty: "Pemula",
    duration: "3 menit",
    image: "/placeholder.svg?height=200&width=300",
    steps: [
      "Keringkan sleeping bag sebelum digunakan",
      "Gunakan liner untuk menjaga kebersihan",
      "Jangan tidur dengan pakaian basah",
      "Ventilasi sleeping bag di pagi hari",
      "Simpan dalam kondisi kering",
    ],
  },
]

const tips = [
  {
    icon: Compass,
    title: "Persiapan Sebelum Mendaki",
    content: "Cek cuaca, buat itinerary, informasikan rencana ke keluarga, dan pastikan kondisi fisik prima.",
  },
  {
    icon: AlertTriangle,
    title: "Keselamatan di Gunung",
    content: "Selalu bawa P3K, jangan mendaki sendirian, ikuti jalur resmi, dan hormati alam.",
  },
  {
    icon: CheckCircle,
    title: "Packing List Essentials",
    content: "Bawa pakaian berlapis, makanan cukup, air bersih, headlamp, dan peralatan navigasi.",
  },
  {
    icon: Users,
    title: "Etika Pendaki",
    content: "Leave no trace, bantu sesama pendaki, jaga kebersihan, dan hormati penduduk lokal.",
  },
]

export default function PanduanPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const initializePage = async () => {
      setIsInitialLoading(true)
      await fetchSettings()
      setIsInitialLoading(false)
    }

    initializePage()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings", { cache: "no-store" })
      if (response.ok) {
        const data = await response.json()
        setSettings(data)

        // Update guide images if available from settings
        if (data.guideImages) {
          guides[0].image = data.guideImages.tenda || guides[0].image
          guides[1].image = data.guideImages.carrier || guides[1].image
          guides[2].image = data.guideImages.sleepingBag || guides[2].image
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  if (isInitialLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Update logo di navigation */}
            <Link href="/" className="flex items-center">
              {settings?.logoUrl ? (
                <Image
                  src={settings.logoUrl || "/placeholder.svg"}
                  alt={settings.storeName || "MountainGear"}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
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
                  className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Katalog
                </Link>
                <Link
                  href="/panduan"
                  className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
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
                  className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Katalog
                </Link>
                <Link
                  href="/panduan"
                  className="text-gray-900 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
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
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Panduan & Tips Mendaki</h1>
          <p className="text-lg text-gray-600">Pelajari cara menggunakan peralatan dan tips mendaki yang aman</p>
        </div>

        {/* Tips Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips Mendaki Aman</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <tip.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-3">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Equipment Guides */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Panduan Penggunaan Alat</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <Image
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{guide.category}</Badge>
                    <Badge variant={guide.difficulty === "Pemula" ? "default" : "secondary"}>{guide.difficulty}</Badge>
                  </div>

                  <CardTitle className="text-xl mb-3">{guide.title}</CardTitle>

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {guide.duration} baca
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Langkah-langkah:</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      {guide.steps.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Guidelines */}
        <section className="mt-12 bg-red-50 rounded-lg p-8">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-4">Peringatan Keselamatan</h3>
              <div className="grid md:grid-cols-2 gap-4 text-red-800">
                <ul className="space-y-2">
                  <li>• Selalu cek kondisi cuaca sebelum mendaki</li>
                  <li>• Jangan mendaki sendirian, minimal 3 orang</li>
                  <li>• Bawa perlengkapan P3K dan obat-obatan pribadi</li>
                  <li>• Informasikan rencana pendakian ke keluarga</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Patuhi batas waktu pendakian yang ditetapkan</li>
                  <li>• Jangan memaksakan diri jika kondisi tidak fit</li>
                  <li>• Hormati aturan dan larangan di area gunung</li>
                  <li>• Bawa komunikasi darurat (radio/satelit phone)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-12 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Siap untuk Petualangan?</h2>
          <p className="text-gray-600 mb-6">Sewa peralatan berkualitas untuk mendukung pendakian Anda</p>
          <Link
            href="/katalog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Lihat Katalog Alat
          </Link>
        </div>
      </div>
    </div>
  )
}
