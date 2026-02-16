"use client"

import { useEffect, useMemo, useState } from "react"

interface ProductVariantImage {
  id: number
  variant_name: string
  image_url: string | null
}

interface ProductImageGalleryProps {
  productName: string
  mainImageUrl: string | null
  previewImageUrl: string | null
  variants?: ProductVariantImage[]
}

interface GalleryImage {
  key: string
  url: string
  label: string
}

function buildGalleryImages(
  productName: string,
  mainImageUrl: string | null,
  previewImageUrl: string | null,
  variants?: ProductVariantImage[],
) {
  const images: GalleryImage[] = []
  const seen = new Set<string>()

  const add = (url: string | null, label: string, key: string) => {
    if (!url || seen.has(url)) return
    images.push({ url, label, key })
    seen.add(url)
  }

  add(previewImageUrl, `${productName} Preview`, "preview")
  add(mainImageUrl, `${productName} Main`, "main")

  variants?.forEach((variant) => {
    add(variant.image_url, variant.variant_name || `Variant ${variant.id}`, `variant-${variant.id}`)
  })

  return images
}

export function ProductImageGallery({ productName, mainImageUrl, previewImageUrl, variants = [] }: ProductImageGalleryProps) {
  const images = useMemo(
    () => buildGalleryImages(productName, mainImageUrl, previewImageUrl, variants),
    [productName, mainImageUrl, previewImageUrl, variants],
  )

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(images[0]?.url || null)

  useEffect(() => {
    setSelectedImageUrl(images[0]?.url || null)
  }, [images])

  if (!selectedImageUrl) {
    return (
      <div className="relative w-full bg-muted">
        <div className="relative mx-auto aspect-square w-full max-w-3xl overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <div className="w-32 h-32 bg-black/20 rounded-lg flex items-center justify-center">
              <div className="w-16 h-16 bg-black/30 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="relative w-full bg-muted">
        <div className="relative mx-auto aspect-square w-full max-w-3xl overflow-hidden">
          <img
            src={selectedImageUrl || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-contain p-2 sm:p-4"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="px-4 py-4 border-b border-border">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {images.map((image) => (
              <button
                key={image.key}
                type="button"
                onClick={() => setSelectedImageUrl(image.url)}
                className={`aspect-square rounded-md border overflow-hidden transition-all ${
                  selectedImageUrl === image.url ? "border-primary ring-2 ring-primary/40" : "border-border"
                }`}
                title={image.label}
              >
                <img src={image.url || "/placeholder.svg"} alt={image.label} className="w-full h-full object-contain bg-white" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
