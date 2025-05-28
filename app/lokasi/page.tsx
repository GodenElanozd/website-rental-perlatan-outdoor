"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Mountain, MapPin, Clock, Phone, Mail, Navigation, Menu, X } from "lucide-react"
import Image from "next/image"
import { PageLoader } from "@/components/ui/loading"

export default function LokasiPage() {
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
                  className="text-gray-500 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Panduan
                </Link>
                <Link
                  href="/lokasi"
                  className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
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
                  className="text-gray-500 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Panduan
                </Link>
                <Link
                  href="/lokasi"
                  className="text-gray-900 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lokasi Toko</h1>
          <p className="text-lg text-gray-600">Kunjungi toko kami untuk melihat langsung peralatan dan konsultasi</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Peta Lokasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <iframe
                    src={
                      settings?.mapUrl ||
                      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798467128636!2d107.6098344!3d-6.914744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1635000000000!5m2!1sen!2sid"
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button asChild className="flex-1">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || "Jl. Pendaki No. 123, Bandung")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Buka di Google Maps
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a
                      href={`https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, "") || "6281234567890"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Hubungi Kami
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Store Info */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Alamat</p>
                    <p className="text-gray-600">
                      {settings?.address || "Jl. Pendaki No. 123, Bandung, Jawa Barat 40123"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Telepon & WhatsApp</p>
                    <p className="text-gray-600">{settings?.whatsapp || "+62 812-3456-7890"}</p>
                    <p className="text-gray-600">{settings?.phone || "+62 22-1234-5678"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">{settings?.email || "info@mountaingear.com"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  Jam Operasional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Senin - Jumat</span>
                    <span className="text-gray-600">{settings?.operatingHours?.monday || "08:00 - 20:00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Sabtu</span>
                    <span className="text-gray-600">{settings?.operatingHours?.saturday || "08:00 - 22:00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Minggu</span>
                    <span className="text-gray-600">{settings?.operatingHours?.sunday || "07:00 - 21:00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Hari Libur</span>
                    <span className="text-gray-600">{settings?.operatingHours?.holiday || "09:00 - 18:00"}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Catatan:</strong> Untuk pengambilan/pengembalian di luar jam operasional, silakan hubungi
                    kami terlebih dahulu untuk mengatur jadwal.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Layanan Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Rental peralatan gunung lengkap
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Konsultasi peralatan mendaki
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Pengecekan kondisi alat gratis
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Delivery untuk area Bandung
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    Tips dan panduan mendaki
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Directions */}
            <Card>
              <CardHeader>
                <CardTitle>Petunjuk Arah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">Dari Terminal Leuwi Panjang:</p>
                    <p>Naik angkot jurusan Cicaheum, turun di Jl. Pendaki (15 menit)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dari Stasiun Bandung:</p>
                    <p>Naik bus Trans Metro Bandung koridor 2, turun di halte terdekat (20 menit)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dengan Kendaraan Pribadi:</p>
                    <p>Tersedia parkir gratis di depan toko (kapasitas 10 mobil, 20 motor)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kunjungi Toko Kami</h2>
          <p className="text-gray-600 mb-6">
            Datang langsung untuk melihat kondisi peralatan dan mendapatkan konsultasi gratis dari tim ahli kami
          </p>
          <div className="space-x-4">
            <Button asChild>
              <a
                href={`https://wa.me/${settings?.whatsapp?.replace(/[^0-9]/g, "") || "6281234567890"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi via WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/katalog">Lihat Katalog Online</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
