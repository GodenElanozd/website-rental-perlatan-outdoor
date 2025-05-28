// Fungsi untuk caching API calls
const API_CACHE: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 60000 // 1 menit cache

export async function fetchWithCache(url: string, options?: RequestInit) {
  const cacheKey = `${url}-${JSON.stringify(options?.body || {})}`
  const now = Date.now()

  // Cek apakah data ada di cache dan masih valid
  if (API_CACHE[cacheKey] && now - API_CACHE[cacheKey].timestamp < CACHE_DURATION) {
    return API_CACHE[cacheKey].data
  }

  // Jika tidak ada di cache atau sudah expired, fetch data baru
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()

  // Simpan ke cache
  API_CACHE[cacheKey] = {
    data,
    timestamp: now,
  }

  return data
}

// Fungsi untuk invalidate cache
export function invalidateCache(urlPattern?: string) {
  if (urlPattern) {
    // Hapus cache yang cocok dengan pattern
    Object.keys(API_CACHE).forEach((key) => {
      if (key.includes(urlPattern)) {
        delete API_CACHE[key]
      }
    })
  } else {
    // Hapus semua cache
    Object.keys(API_CACHE).forEach((key) => {
      delete API_CACHE[key]
    })
  }
}
