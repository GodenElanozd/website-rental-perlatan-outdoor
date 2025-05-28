"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Mountain, Users, Package, History, Plus, Edit, Trash2, Eye, X, Settings, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PageLoader, LoadingButton, SkeletonTable } from "@/components/ui/loading"

interface Renter {
  id: string
  name: string
  phone: string
  startDate: string
  endDate: string
  items: string[]
  status: "Aktif" | "Selesai" | "Dibatalkan"
  totalAmount: number
  ktpImageUrl?: string
  notes?: string
  createdAt: string
}

interface Equipment {
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

interface Transaction {
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

interface Setting {
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
  logoUrl?: string
  guideImages?: {
    tenda?: string
    carrier?: string
    sleepingBag?: string
  }
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })
  const [renters, setRenters] = useState<Renter[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [settings, setSettings] = useState<Setting | null>(null)
  const [totalProfit, setTotalProfit] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedRenter, setSelectedRenter] = useState<Renter | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [isAddRenterOpen, setIsAddRenterOpen] = useState(false)
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false)
  const [isEditRenterOpen, setIsEditRenterOpen] = useState(false)
  const [isEditEquipmentOpen, setIsEditEquipmentOpen] = useState(false)
  const [isViewKtpOpen, setIsViewKtpOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { toast } = useToast()

  // Form states
  const [renterForm, setRenterForm] = useState({
    name: "",
    phone: "",
    startDate: "",
    endDate: "",
    items: [] as string[],
    status: "Aktif" as const,
    totalAmount: 0,
    notes: "",
  })

  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    category: "",
    stock: 0,
    available: 0,
    price: 0,
    condition: "Baik" as const,
    description: "",
  })

  const [settingsForm, setSettingsForm] = useState({
    storeName: "",
    storeDescription: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    operatingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
      holiday: "",
    },
    mapUrl: "",
    socialMedia: {
      instagram: "",
      facebook: "",
      twitter: "",
    },
    heroTitle: "",
    heroSubtitle: "",
    aboutUs: "",
    guideImages: {
      tenda: "",
      carrier: "",
      sleepingBag: "",
    },
  })

  const [ktpFile, setKtpFile] = useState<File | null>(null)
  const [equipmentImage, setEquipmentImage] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [guideFiles, setGuideFiles] = useState({
    tenda: null as File | null,
    carrier: null as File | null,
    sleepingBag: null as File | null,
  })

  // Tambahkan state loading untuk return
  const [returningRenterId, setReturningRenterId] = useState<string | null>(null)

  useEffect(() => {
    const initializeAdmin = async () => {
      setIsInitialLoading(true)
      // Simulate checking auth state
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsInitialLoading(false)
    }

    initializeAdmin()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [rentersRes, equipmentRes, settingsRes, profitRes] = await Promise.all([
        fetch("/api/renters"),
        fetch("/api/equipment"),
        fetch("/api/settings"),
        fetch("/api/profit"),
      ])

      const rentersData = await rentersRes.json()
      const equipmentData = await equipmentRes.json()
      const settingsData = await settingsRes.json()
      const profitData = await profitRes.json()

      setRenters(rentersData)
      setEquipment(equipmentData)
      setSettings(settingsData)
      setTotalProfit(profitData.totalProfit || 0)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsAuthenticated(true)
    } else {
      toast({
        title: "Error",
        description: "Username atau password salah!",
        variant: "destructive",
      })
    }
    setIsLoggingIn(false)
  }

  const uploadFile = async (file: File, oldFileUrl?: string) => {
    const formData = new FormData()
    formData.append("file", file)
    if (oldFileUrl) {
      formData.append("oldFileUrl", oldFileUrl)
    }

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()
    return data.url
  }

  const handleAddRenter = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let ktpImageUrl = ""
      if (ktpFile) {
        ktpImageUrl = await uploadFile(ktpFile)
      }

      const response = await fetch("/api/renters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...renterForm,
          ktpImageUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Penyewa berhasil ditambahkan",
        })
        setIsAddRenterOpen(false)
        resetRenterForm()
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan penyewa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ""
      if (equipmentImage) {
        imageUrl = await uploadFile(equipmentImage)
      }

      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...equipmentForm,
          imageUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Alat berhasil ditambahkan",
        })
        setIsAddEquipmentOpen(false)
        resetEquipmentForm()
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan alat",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditRenter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRenter) return

    setLoading(true)
    try {
      let ktpImageUrl = selectedRenter.ktpImageUrl
      if (ktpFile) {
        ktpImageUrl = await uploadFile(ktpFile, selectedRenter.ktpImageUrl)
      }

      const response = await fetch(`/api/renters/${selectedRenter.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...renterForm,
          ktpImageUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Data penyewa berhasil diupdate",
        })
        setIsEditRenterOpen(false)
        resetRenterForm()
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate data penyewa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditEquipment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEquipment) return

    setLoading(true)
    try {
      let imageUrl = selectedEquipment.imageUrl
      if (equipmentImage) {
        imageUrl = await uploadFile(equipmentImage, selectedEquipment.imageUrl)
      }

      const response = await fetch(`/api/equipment/${selectedEquipment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...equipmentForm,
          imageUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Data alat berhasil diupdate",
        })
        setIsEditEquipmentOpen(false)
        resetEquipmentForm()
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate data alat",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRenter = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data penyewa ini?")) return

    try {
      const response = await fetch(`/api/renters/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Penyewa berhasil dihapus",
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus penyewa",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    if (!confirm("Yakin ingin menghapus alat ini?")) return

    try {
      const response = await fetch(`/api/equipment/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Alat berhasil dihapus",
        })
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus alat",
        variant: "destructive",
      })
    }
  }

  // Update handleReturnEquipment function
  const handleReturnEquipment = async (renterId: string) => {
    if (!confirm("Konfirmasi pengembalian alat?")) return

    setReturningRenterId(renterId)
    try {
      const response = await fetch(`/api/renters/return/${renterId}`, {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "✅ Berhasil!",
          description: "Alat berhasil dikembalikan dan profit telah ditambahkan ke sistem",
          duration: 3000,
        })
        fetchData() // Refresh data untuk update profit
      } else {
        throw new Error("Failed to return equipment")
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Gagal memproses pengembalian. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setReturningRenterId(null)
    }
  }

  const resetRenterForm = () => {
    setRenterForm({
      name: "",
      phone: "",
      startDate: "",
      endDate: "",
      items: [],
      status: "Aktif",
      totalAmount: 0,
      notes: "",
    })
    setKtpFile(null)
    setSelectedRenter(null)
  }

  const resetEquipmentForm = () => {
    setEquipmentForm({
      name: "",
      category: "",
      stock: 0,
      available: 0,
      price: 0,
      condition: "Baik",
      description: "",
    })
    setEquipmentImage(null)
    setSelectedEquipment(null)
  }

  const openEditRenter = (renter: Renter) => {
    setSelectedRenter(renter)
    setRenterForm({
      name: renter.name || "",
      phone: renter.phone || "",
      startDate: renter.startDate || "",
      endDate: renter.endDate || "",
      items: renter.items || [],
      status: renter.status || "Aktif",
      totalAmount: renter.totalAmount || 0,
      notes: renter.notes || "",
    })
    setIsEditRenterOpen(true)
  }

  const openEditEquipment = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setEquipmentForm({
      name: equipment.name,
      category: equipment.category,
      stock: equipment.stock,
      available: equipment.available,
      price: equipment.price,
      condition: equipment.condition,
      description: equipment.description,
    })
    setIsEditEquipmentOpen(true)
  }

  const openViewKtp = (renter: Renter) => {
    setSelectedRenter(renter)
    setIsViewKtpOpen(true)
  }

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let logoUrl = settings?.logoUrl
      if (logoFile) {
        const formData = new FormData()
        formData.append("file", logoFile)
        if (settings?.logoUrl) {
          formData.append("oldFileUrl", settings.logoUrl)
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        logoUrl = data.url
      }

      // Upload guide images
      const guideImages = { ...settings?.guideImages }

      if (guideFiles.tenda) {
        const oldUrl = settings?.guideImages?.tenda
        guideImages.tenda = await uploadFile(guideFiles.tenda, oldUrl)
      }

      if (guideFiles.carrier) {
        const oldUrl = settings?.guideImages?.carrier
        guideImages.carrier = await uploadFile(guideFiles.carrier, oldUrl)
      }

      if (guideFiles.sleepingBag) {
        const oldUrl = settings?.guideImages?.sleepingBag
        guideImages.sleepingBag = await uploadFile(guideFiles.sleepingBag, oldUrl)
      }

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settingsForm,
          logoUrl,
          guideImages,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pengaturan berhasil diupdate",
        })
        setIsSettingsOpen(false)
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate pengaturan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openSettings = () => {
    if (settings) {
      setSettingsForm({
        storeName: settings.storeName,
        storeDescription: settings.storeDescription,
        address: settings.address,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        operatingHours: settings.operatingHours,
        mapUrl: settings.mapUrl,
        socialMedia: settings.socialMedia,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        aboutUs: settings.aboutUs,
        guideImages: settings.guideImages || {
          tenda: "",
          carrier: "",
          sleepingBag: "",
        },
      })
    }
    setIsSettingsOpen(true)
  }

  if (isInitialLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Mountain className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  disabled={isLoggingIn}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  disabled={isLoggingIn}
                />
              </div>
              <LoadingButton type="submit" className="w-full" isLoading={isLoggingIn} loadingText="Logging in...">
                Login
              </LoadingButton>
            </form>
            <p className="text-sm text-gray-600 mt-4 text-center">Demo: username: admin, password: admin123</p>
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
              <Mountain className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-500 hover:text-green-600">
                Kembali ke Website
              </Link>
              <Button onClick={() => setIsAuthenticated(false)} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Penyewa</p>
                  <p className="text-2xl font-bold text-gray-900">{renters.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Alat</p>
                  <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <History className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Penyewa Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {renters.filter((r) => r.status === "Aktif").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">Rp</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Profit</p>
                  <p className="text-2xl font-bold text-gray-900">{((totalProfit || 0) / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="renters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="renters">Data Penyewa</TabsTrigger>
            <TabsTrigger value="equipment">Stok Alat</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          {/* Renters Tab */}
          <TabsContent value="renters">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Data Penyewa</CardTitle>
                <Dialog open={isAddRenterOpen} onOpenChange={setIsAddRenterOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Penyewa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Penyewa Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddRenter} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nama Lengkap *</Label>
                          <Input
                            value={renterForm.name}
                            onChange={(e) => setRenterForm({ ...renterForm, name: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Nomor HP *</Label>
                          <Input
                            value={renterForm.phone}
                            onChange={(e) => setRenterForm({ ...renterForm, phone: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Tanggal Sewa *</Label>
                          <Input
                            type="date"
                            value={renterForm.startDate}
                            onChange={(e) => setRenterForm({ ...renterForm, startDate: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Tanggal Kembali *</Label>
                          <Input
                            type="date"
                            value={renterForm.endDate}
                            onChange={(e) => setRenterForm({ ...renterForm, endDate: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={renterForm.status}
                            onValueChange={(value: any) => setRenterForm({ ...renterForm, status: value })}
                            disabled={loading}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Aktif">Aktif</SelectItem>
                              <SelectItem value="Selesai">Selesai</SelectItem>
                              <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Total Amount (Rp)</Label>
                          <Input
                            type="number"
                            value={renterForm.totalAmount}
                            onChange={(e) => setRenterForm({ ...renterForm, totalAmount: Number(e.target.value) })}
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Upload Foto KTP *</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <Label>Catatan</Label>
                        <Textarea
                          value={renterForm.notes}
                          onChange={(e) => setRenterForm({ ...renterForm, notes: e.target.value })}
                          rows={3}
                          disabled={loading}
                        />
                      </div>

                      <LoadingButton type="submit" className="w-full" isLoading={loading} loadingText="Menyimpan...">
                        Simpan
                      </LoadingButton>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonTable />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>No. HP</TableHead>
                        <TableHead>Periode Sewa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {renters.map((renter) => (
                        <TableRow key={renter.id}>
                          <TableCell className="font-medium">{renter.name}</TableCell>
                          <TableCell>{renter.phone}</TableCell>
                          <TableCell>
                            {renter.startDate} s/d {renter.endDate}
                          </TableCell>
                          <TableCell>
                            <Badge variant={renter.status === "Aktif" ? "default" : "secondary"}>{renter.status}</Badge>
                          </TableCell>
                          <TableCell>Rp {(renter.totalAmount || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {renter.status === "Aktif" && (
                                <LoadingButton
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleReturnEquipment(renter.id)}
                                  isLoading={returningRenterId === renter.id}
                                  loadingText="Processing..."
                                  className="text-xs px-2 py-1"
                                >
                                  Return
                                </LoadingButton>
                              )}
                              <Button size="sm" variant="outline" onClick={() => openViewKtp(renter)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => openEditRenter(renter)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteRenter(renter.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Stok Alat</CardTitle>
                <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Alat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Tambah Alat Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddEquipment} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nama Alat *</Label>
                          <Input
                            value={equipmentForm.name}
                            onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Kategori *</Label>
                          <Input
                            value={equipmentForm.category}
                            onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label>Total Stok *</Label>
                          <Input
                            type="number"
                            value={equipmentForm.stock}
                            onChange={(e) => setEquipmentForm({ ...equipmentForm, stock: Number(e.target.value) })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Tersedia *</Label>
                          <Input
                            type="number"
                            value={equipmentForm.available}
                            onChange={(e) => setEquipmentForm({ ...equipmentForm, available: Number(e.target.value) })}
                            required
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label>Harga/Hari (Rp) *</Label>
                          <Input
                            type="number"
                            value={equipmentForm.price}
                            onChange={(e) => setEquipmentForm({ ...equipmentForm, price: Number(e.target.value) })}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Kondisi</Label>
                        <Select
                          value={equipmentForm.condition}
                          onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baik">Baik</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Rusak">Rusak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Upload Gambar Alat</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEquipmentImage(e.target.files?.[0] || null)}
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <Label>Deskripsi</Label>
                        <Textarea
                          value={equipmentForm.description}
                          onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                          rows={3}
                          disabled={loading}
                        />
                      </div>

                      <LoadingButton type="submit" className="w-full" isLoading={loading} loadingText="Menyimpan...">
                        Simpan
                      </LoadingButton>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <SkeletonTable />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gambar</TableHead>
                        <TableHead>Nama Alat</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Tersedia</TableHead>
                        <TableHead>Harga/Hari</TableHead>
                        <TableHead>Kondisi</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipment.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="rounded object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                          <TableCell>
                            <span className={item.available === 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                              {item.available}
                            </span>
                          </TableCell>
                          <TableCell>Rp {(item.price || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={item.condition === "Baik" ? "default" : "destructive"}>
                              {item.condition}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => openEditEquipment(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDeleteEquipment(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Pengaturan Website</CardTitle>
                <Button onClick={openSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Pengaturan
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Informasi Toko</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Nama:</strong> {settings?.storeName}
                      </p>
                      <p>
                        <strong>Deskripsi:</strong> {settings?.storeDescription}
                      </p>
                      <p>
                        <strong>Alamat:</strong> {settings?.address}
                      </p>
                      <p>
                        <strong>Telepon:</strong> {settings?.phone}
                      </p>
                      <p>
                        <strong>WhatsApp:</strong> {settings?.whatsapp}
                      </p>
                      <p>
                        <strong>Email:</strong> {settings?.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Logo & Media</h3>
                    <div className="space-y-2 text-sm">
                      {settings?.logoUrl ? (
                        <div>
                          <p>
                            <strong>Logo Saat Ini:</strong>
                          </p>
                          <Image
                            src={settings.logoUrl || "/placeholder.svg"}
                            alt="Logo"
                            width={100}
                            height={50}
                            className="mt-2 max-h-12 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <p>
                          <strong>Logo:</strong> Belum diatur
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Gambar Panduan
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Panduan Tenda</p>
                      {settings?.guideImages?.tenda ? (
                        <Image
                          src={settings.guideImages.tenda || "/placeholder.svg"}
                          alt="Guide Tenda"
                          width={150}
                          height={100}
                          className="rounded border object-cover"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Belum ada gambar</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Panduan Carrier</p>
                      {settings?.guideImages?.carrier ? (
                        <Image
                          src={settings.guideImages.carrier || "/placeholder.svg"}
                          alt="Guide Carrier"
                          width={150}
                          height={100}
                          className="rounded border object-cover"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Belum ada gambar</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Panduan Sleeping Bag</p>
                      {settings?.guideImages?.sleepingBag ? (
                        <Image
                          src={settings.guideImages.sleepingBag || "/placeholder.svg"}
                          alt="Guide Sleeping Bag"
                          width={150}
                          height={100}
                          className="rounded border object-cover"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-500 text-xs">Belum ada gambar</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Renter Dialog */}
        <Dialog open={isEditRenterOpen} onOpenChange={setIsEditRenterOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Data Penyewa</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditRenter} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Lengkap *</Label>
                  <Input
                    value={renterForm.name}
                    onChange={(e) => setRenterForm({ ...renterForm, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Nomor HP *</Label>
                  <Input
                    value={renterForm.phone}
                    onChange={(e) => setRenterForm({ ...renterForm, phone: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Sewa *</Label>
                  <Input
                    type="date"
                    value={renterForm.startDate}
                    onChange={(e) => setRenterForm({ ...renterForm, startDate: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Tanggal Kembali *</Label>
                  <Input
                    type="date"
                    value={renterForm.endDate}
                    onChange={(e) => setRenterForm({ ...renterForm, endDate: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select
                    value={renterForm.status}
                    onValueChange={(value: any) => setRenterForm({ ...renterForm, status: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Total Amount (Rp)</Label>
                  <Input
                    type="number"
                    value={renterForm.totalAmount}
                    onChange={(e) => setRenterForm({ ...renterForm, totalAmount: Number(e.target.value) })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label>Upload Foto KTP Baru (Opsional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                  disabled={loading}
                />
                {selectedRenter?.ktpImageUrl && (
                  <p className="text-sm text-gray-600 mt-1">Foto KTP saat ini tersedia</p>
                )}
              </div>

              <div>
                <Label>Catatan</Label>
                <Textarea
                  value={renterForm.notes}
                  onChange={(e) => setRenterForm({ ...renterForm, notes: e.target.value })}
                  rows={3}
                  disabled={loading}
                />
              </div>

              <LoadingButton type="submit" className="w-full" isLoading={loading} loadingText="Menyimpan...">
                Update
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Equipment Dialog */}
        <Dialog open={isEditEquipmentOpen} onOpenChange={setIsEditEquipmentOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Data Alat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditEquipment} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Alat *</Label>
                  <Input
                    value={equipmentForm.name}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Kategori *</Label>
                  <Input
                    value={equipmentForm.category}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, category: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Total Stok *</Label>
                  <Input
                    type="number"
                    value={equipmentForm.stock}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, stock: Number(e.target.value) })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Tersedia *</Label>
                  <Input
                    type="number"
                    value={equipmentForm.available}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, available: Number(e.target.value) })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Harga/Hari (Rp) *</Label>
                  <Input
                    type="number"
                    value={equipmentForm.price}
                    onChange={(e) => setEquipmentForm({ ...equipmentForm, price: Number(e.target.value) })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label>Kondisi</Label>
                <Select
                  value={equipmentForm.condition}
                  onValueChange={(value: any) => setEquipmentForm({ ...equipmentForm, condition: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baik">Baik</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Rusak">Rusak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Upload Gambar Baru (Opsional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEquipmentImage(e.target.files?.[0] || null)}
                  disabled={loading}
                />
                {selectedEquipment?.imageUrl && <p className="text-sm text-gray-600 mt-1">Gambar saat ini tersedia</p>}
              </div>

              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={equipmentForm.description}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                  rows={3}
                  disabled={loading}
                />
              </div>

              <LoadingButton type="submit" className="w-full" isLoading={loading} loadingText="Menyimpan...">
                Update
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>

        {/* View KTP Dialog */}
        <Dialog open={isViewKtpOpen} onOpenChange={setIsViewKtpOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Foto KTP - {selectedRenter?.name}
                <Button variant="ghost" size="sm" onClick={() => setIsViewKtpOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedRenter?.ktpImageUrl ? (
                <div className="text-center">
                  <Image
                    src={selectedRenter.ktpImageUrl || "/placeholder.svg"}
                    alt="Foto KTP"
                    width={600}
                    height={400}
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Foto KTP tidak tersedia</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Pengaturan Website</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nama Toko *</Label>
                  <Input
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Deskripsi Toko *</Label>
                  <Input
                    value={settingsForm.storeDescription}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeDescription: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label>Upload Logo Baru (Opsional)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  disabled={loading}
                />
                {settings?.logoUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Logo saat ini:</p>
                    <Image
                      src={settings.logoUrl || "/placeholder.svg"}
                      alt="Current Logo"
                      width={120}
                      height={40}
                      className="mt-1 h-10 w-auto object-contain border rounded bg-white p-1"
                    />
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  <p>• Rekomendasi ukuran: 300x100px atau 450x150px (rasio 3:1)</p>
                  <p>• Format: PNG dengan background transparan untuk hasil terbaik</p>
                  <p>• Maksimal ukuran file: 2MB</p>
                  <p>• Logo akan otomatis resize untuk menjaga responsivitas website</p>
                </div>
              </div>

              {/* Guide Images Section */}
              <div>
                <Label className="text-base font-semibold flex items-center mb-4">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Gambar Panduan Penggunaan Alat
                </Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Gambar Panduan Tenda</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setGuideFiles({ ...guideFiles, tenda: e.target.files?.[0] || null })}
                      disabled={loading}
                    />
                    {settings?.guideImages?.tenda && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Gambar saat ini:</p>
                        <Image
                          src={settings.guideImages.tenda || "/placeholder.svg"}
                          alt="Current Guide Tenda"
                          width={100}
                          height={60}
                          className="mt-1 rounded border object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Gambar Panduan Carrier</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setGuideFiles({ ...guideFiles, carrier: e.target.files?.[0] || null })}
                      disabled={loading}
                    />
                    {settings?.guideImages?.carrier && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Gambar saat ini:</p>
                        <Image
                          src={settings.guideImages.carrier || "/placeholder.svg"}
                          alt="Current Guide Carrier"
                          width={100}
                          height={60}
                          className="mt-1 rounded border object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Gambar Panduan Sleeping Bag</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setGuideFiles({ ...guideFiles, sleepingBag: e.target.files?.[0] || null })}
                      disabled={loading}
                    />
                    {settings?.guideImages?.sleepingBag && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Gambar saat ini:</p>
                        <Image
                          src={settings.guideImages.sleepingBag || "/placeholder.svg"}
                          alt="Current Guide Sleeping Bag"
                          width={100}
                          height={60}
                          className="mt-1 rounded border object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <p>• Upload gambar untuk menggantikan gambar panduan yang ada di halaman Panduan</p>
                  <p>• Rekomendasi ukuran: 300x200px, format JPG/PNG</p>
                </div>
              </div>

              <div>
                <Label>Alamat Lengkap *</Label>
                <Textarea
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  required
                  rows={2}
                  disabled={loading}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Telepon *</Label>
                  <Input
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>WhatsApp *</Label>
                  <Input
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Jam Operasional</Label>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label>Senin</Label>
                    <Input
                      value={settingsForm.operatingHours.monday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, monday: e.target.value },
                        })
                      }
                      placeholder="08:00 - 20:00"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Selasa</Label>
                    <Input
                      value={settingsForm.operatingHours.tuesday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, tuesday: e.target.value },
                        })
                      }
                      placeholder="08:00 - 20:00"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Rabu</Label>
                    <Input
                      value={settingsForm.operatingHours.wednesday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, wednesday: e.target.value },
                        })
                      }
                      placeholder="08:00 - 20:00"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Kamis</Label>
                    <Input
                      value={settingsForm.operatingHours.thursday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, thursday: e.target.value },
                        })
                      }
                      placeholder="08:00 - 20:00"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Jumat</Label>
                    <Input
                      value={settingsForm.operatingHours.friday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, friday: e.target.value },
                        })
                      }
                      placeholder="08:00 - 20:00"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Sabtu</Label>
                    <Input
                      value={settingsForm.operatingHours.saturday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, saturday: e.target.value },
                        })
                      }
                      placeholder="08:00 - 22:00"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Minggu</Label>
                    <Input
                      value={settingsForm.operatingHours.sunday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, sunday: e.target.value },
                        })
                      }
                      placeholder="07:00 - 21:00"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label>Hari Libur</Label>
                    <Input
                      value={settingsForm.operatingHours.holiday}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          operatingHours: { ...settingsForm.operatingHours, holiday: e.target.value },
                        })
                      }
                      placeholder="09:00 - 18:00"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>URL Google Maps Embed</Label>
                <Textarea
                  value={settingsForm.mapUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Instagram</Label>
                  <Input
                    value={settingsForm.socialMedia.instagram}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialMedia: { ...settingsForm.socialMedia, instagram: e.target.value },
                      })
                    }
                    placeholder="@username"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input
                    value={settingsForm.socialMedia.facebook}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialMedia: { ...settingsForm.socialMedia, facebook: e.target.value },
                      })
                    }
                    placeholder="Page Name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label>Twitter</Label>
                  <Input
                    value={settingsForm.socialMedia.twitter}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        socialMedia: { ...settingsForm.socialMedia, twitter: e.target.value },
                      })
                    }
                    placeholder="@username"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label>Judul Hero *</Label>
                <Input
                  value={settingsForm.heroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label>Subtitle Hero *</Label>
                <Textarea
                  value={settingsForm.heroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  required
                  rows={2}
                  disabled={loading}
                />
              </div>

              <div>
                <Label>Tentang Kami</Label>
                <Textarea
                  value={settingsForm.aboutUs}
                  onChange={(e) => setSettingsForm({ ...settingsForm, aboutUs: e.target.value })}
                  rows={3}
                  disabled={loading}
                />
              </div>

              <LoadingButton type="submit" className="w-full" isLoading={loading} loadingText="Menyimpan...">
                Simpan Pengaturan
              </LoadingButton>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
