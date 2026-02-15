"use client"

import { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/lib/products-db"
import { ProductLikeButton } from "@/components/product-like-button"

interface ProductListProps {
  showAll?: boolean
}

export function ProductList({ showAll = true }: ProductListProps) {
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        console.log("[v0] Loading products from Supabase...")

        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Loaded products from Supabase:", data)
        setProducts(data)
        setError(null)
      } catch (error) {
        console.error("[v0] Error loading products:", error)
        setError(error instanceof Error ? error.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    // Listen for product updates from admin panel
    const handleProductUpdate = () => {
      loadProducts()
    }

    window.addEventListener("productsUpdated", handleProductUpdate)

    return () => {
      window.removeEventListener("productsUpdated", handleProductUpdate)
    }
  }, [])

  const displayProducts = showAll ? products : products.slice(0, 8)

  if (loading) {
    return (
      <div className="w-full">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border animate-pulse">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-600 mb-4">Error loading products: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {showAll && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Our Products</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-muted/30 rounded-lg overflow-x-auto">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap"
              onClick={() => setSortBy(sortBy === "name" ? "category" : "name")}
            >
              Name
            </Button>

            <Button variant="ghost" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              Time
            </Button>

            <Button variant="ghost" className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
              Price
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-xs md:text-sm ml-auto whitespace-nowrap"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {displayProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="block">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-border hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md overflow-hidden">
                {product.preview_image_url || product.image_url ? (
                  <img
                    src={product.preview_image_url || product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black/20 rounded flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-black/30 rounded"></div>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-yellow-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <ProductLikeButton
                    productId={product.id}
                    initialLikes={product.likes_count}
                    size="sm"
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors bg-transparent"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  See More
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
