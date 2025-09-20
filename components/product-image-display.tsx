"use client"

import { useState, useEffect } from "react"

interface ProductImageDisplayProps {
  productSlug: string
  productName: string
  fallbackImage?: string
  className?: string
}

export function ProductImageDisplay({
  productSlug,
  productName,
  fallbackImage,
  className = "w-full h-full object-cover",
}: ProductImageDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStoredImage = () => {
      try {
        const storedProducts = localStorage.getItem("africa-stickers-products")
        if (storedProducts) {
          const products = JSON.parse(storedProducts)
          const product = products.find((p: any) => p.slug === productSlug)
          if (product?.imageUrl) {
            setImageUrl(product.imageUrl)
          }
        }
      } catch (error) {
        console.error("Error loading stored product image:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredImage()
  }, [productSlug])

  if (isLoading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
        <div className="w-16 h-16 bg-black/20 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  if (imageUrl) {
    return <img src={imageUrl || "/placeholder.svg"} alt={productName} className={className} />
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
      <div className="w-32 h-32 bg-black/20 rounded-lg flex items-center justify-center">
        <div className="w-16 h-16 bg-black/30 rounded"></div>
      </div>
    </div>
  )
}
