import Image from "next/image"
import { getOptimizedImageUrl, generateBlurPlaceholder } from "@/lib/image-optimization"

interface OptimizedImageProps {
  src: string | undefined
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function OptimizedImage({ src, alt, width, height, className, priority = false }: OptimizedImageProps) {
  const optimizedSrc = getOptimizedImageUrl(src)
  const blurDataURL = generateBlurPlaceholder()

  return (
    <Image
      src={optimizedSrc || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder="blur"
      blurDataURL={blurDataURL}
      loading={priority ? "eager" : "lazy"}
      quality={80}
    />
  )
}
