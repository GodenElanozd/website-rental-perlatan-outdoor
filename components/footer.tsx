import Link from "next/link"
import { Mountain } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"

export default function Footer({ settings }) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              {settings?.logoUrl ? (
                <OptimizedImage
                  src={settings.logoUrl}
                  alt={settings.storeName || "MountainGear"}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <>
                  <Mountain className="h-8 w-8 text-green-400" />
                  <span className="ml-2 text-xl font-bold">{settings?.storeName || "MountainGear"}</span>
                </>
              )}
            </div>
            <p className="text-gray-400">
              {settings?.storeDescription || "Rental alat gunung terpercaya untuk petualangan Anda"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/katalog" className="hover:text-white">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="hover:text-white">
                  Panduan
                </Link>
              </li>
              <li>
                <Link href="/lokasi" className="hover:text-white">
                  Lokasi
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-400">
              <li>WhatsApp: {settings?.whatsapp || "+62 812-3456-7890"}</li>
              <li>Email: {settings?.email || "info@mountaingear.com"}</li>
              <li>Jam Buka: 08:00 - 20:00</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Alamat</h3>
            <p className="text-gray-400">{settings?.address || "Jl. Pendaki No. 123, Bandung, Jawa Barat 40123"}</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 {settings?.storeName || "MountainGear"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
