// Fungsi untuk mengoptimasi URL gambar
export function getOptimizedImageUrl(url: string | undefined): string {
  if (!url) return "/placeholder.svg?height=300&width=300"

  // Jika sudah menggunakan CDN, gunakan langsung
  if (url.includes("imagecdn.app") || url.includes("cloudinary.com") || url.includes("imgix.net")) {
    return url
  }

  // Jika gambar adalah data URL (base64), gunakan sebagaimana adanya
  if (url.startsWith("data:")) {
    return url
  }

  // Untuk gambar lain, gunakan layanan optimasi gambar
  // Contoh menggunakan ImageCDN (layanan gratis)
  return `https://imagecdn.app/v2/image/${encodeURIComponent(url)}?width=600&height=400&format=webp&quality=85`
}

// Fungsi untuk menghasilkan placeholder blur
export function generateBlurPlaceholder(): string {
  return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiI+PC9yZWN0Pjwvc3ZnPg=="
}
