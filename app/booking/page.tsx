"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Mountain, CalendarIcon, Upload, CheckCircle, Menu, X } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useSearchParams } from "next/navigation"
import { PageLoader, LoadingButton } from "@/components/ui/loading"

export default function BookingPage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    notes: "",
  })
  const [ktpFile, setKtpFile] = useState<File | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const searchParams = useSearchParams()
  const itemId = searchParams.get("item")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const initializePage = async () => {
      setIsInitialLoading(true)
      await Promise.all([itemId ? fetchEquipment() : Promise.resolve(), fetchSettings()])
      setIsInitialLoading(false)
    }

    initializePage()
  }, [itemId])

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

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/equipment/${itemId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedEquipment(data)
      }
    } catch (error) {
      console.error("Failed to fetch equipment:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKtpFile(e.target.files[0])
    }
  }

  const calculateDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    }
    return 0
  }

  const totalPrice = selectedEquipment ? calculateDays() * selectedEquipment.price : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedEquipment) return

    setIsSubmitting(true)

    try {
      // Upload KTP if exists
      let ktpImageUrl = ""
      if (ktpFile) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", ktpFile)
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        })
        const uploadData = await uploadResponse.json()
        ktpImageUrl = uploadData.url
      }

      // Create booking data
      const bookingData = {
        name: formData.fullName, // Fixed: use 'name' instead of fullName
        phone: formData.phoneNumber, // Fixed: use 'phone' instead of phoneNumber
        startDate: startDate?.toISOString().split("T")[0],
        endDate: endDate?.toISOString().split("T")[0],
        items: [selectedEquipment.name],
        status: "Aktif",
        totalAmount: totalPrice, // Store total amount for profit calculation
        notes: formData.notes,
        ktpImageUrl,
      }

      // Create renter
      const renterResponse = await fetch("/api/renters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      if (renterResponse.ok) {
        // Reduce equipment stock
        await fetch(`/api/equipment/${selectedEquipment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            available: selectedEquipment.available - 1,
          }),
        })

        setIsSubmitted(true)
      }
    } catch (error) {
      console.error("Booking failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isInitialLoading) {
    return <PageLoader />
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Booking Berhasil!</h2>
            <p className="text-gray-600 mb-6">
              Terima kasih! Booking Anda telah diterima. Kami akan menghubungi Anda dalam 1x24 jam untuk konfirmasi.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/katalog">Booking Lagi</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Form Pemesanan</h1>
          <p className="text-lg text-gray-600">Lengkapi data berikut untuk menyewa peralatan</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Penyewa</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nama Lengkap *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Masukkan nama lengkap"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Nomor HP/WhatsApp *</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="08xxxxxxxxxx"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tanggal Sewa *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP", { locale: id }) : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Tanggal Kembali *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP", { locale: id }) : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ktpFile">Upload Foto KTP *</Label>
                    <div className="mt-1">
                      <Input
                        id="ktpFile"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        disabled={isSubmitting}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                    </div>
                    {ktpFile && (
                      <p className="text-sm text-green-600 mt-2">
                        <Upload className="inline h-4 w-4 mr-1" />
                        {ktpFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes">Catatan Tambahan</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Catatan khusus atau permintaan tambahan"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  <LoadingButton
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Memproses Pesanan..."
                  >
                    Kirim Pesanan
                  </LoadingButton>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Alat:</span>
                  <span>{selectedEquipment?.name || "Loading..."}</span>
                </div>
                <div className="flex justify-between">
                  <span>Harga per hari:</span>
                  <span>Rp {selectedEquipment?.price?.toLocaleString() || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durasi:</span>
                  <span>{calculateDays()} hari</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">Rp {totalPrice.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>• Pembayaran dilakukan saat pengambilan</p>
                  <p>• Bawa KTP asli saat pengambilan</p>
                  <p>• Pastikan kondisi alat tetap baik saat pengembalian</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
