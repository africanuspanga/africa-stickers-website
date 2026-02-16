"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "@/lib/products-db"
import { ProductLikeButton } from "@/components/product-like-button"

interface ProductListProps {
  showAll?: boolean
}

type SortOption = "name" | "likes" | "newest"

export function ProductList({ showAll = true }: ProductListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [featuredOnly, setFeaturedOnly] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)

        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = (await response.json()) as Product[]
        setProducts(data)
        setError(null)
      } catch (fetchError) {
        console.error("[v0] Error loading products:", fetchError)
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    const handleProductUpdate = () => {
      loadProducts()
    }

    window.addEventListener("productsUpdated", handleProductUpdate)

    return () => {
      window.removeEventListener("productsUpdated", handleProductUpdate)
    }
  }, [])

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [products],
  )

  const filteredProducts = useMemo(() => {
    if (!showAll) {
      return products
    }

    const normalizedSearch = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesFeatured = !featuredOnly || Boolean(product.featured)
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch)

      return matchesCategory && matchesFeatured && matchesSearch
    })
  }, [products, featuredOnly, searchTerm, selectedCategory, showAll])

  const sortedProducts = useMemo(() => {
    if (!showAll) {
      return filteredProducts
    }

    const sortable = [...filteredProducts]

    sortable.sort((a, b) => {
      if (sortBy === "likes") {
        return (b.likes_count ?? 0) - (a.likes_count ?? 0)
      }

      if (sortBy === "newest") {
        const aTime = Date.parse(a.created_at)
        const bTime = Date.parse(b.created_at)

        if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
          return b.id - a.id
        }

        return bTime - aTime
      }

      return a.name.localeCompare(b.name)
    })

    return sortable
  }, [filteredProducts, showAll, sortBy])

  const displayProducts = showAll ? sortedProducts : sortedProducts.slice(0, 8)

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
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-2xl font-bold text-foreground">Our Products</h2>
            <p className="text-sm text-muted-foreground">{displayProducts.length} items shown</p>
          </div>

          <div className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-muted/30 rounded-lg overflow-x-auto">
            <Button
              variant={sortBy === "name" ? "secondary" : "ghost"}
              className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap"
              onClick={() => setSortBy("name")}
            >
              Name
            </Button>

            <Button
              variant={sortBy === "likes" ? "secondary" : "ghost"}
              className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap"
              onClick={() => setSortBy("likes")}
            >
              Most Liked
            </Button>

            <Button
              variant={sortBy === "newest" ? "secondary" : "ghost"}
              className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap"
              onClick={() => setSortBy("newest")}
            >
              Newest
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-xs md:text-sm ml-auto whitespace-nowrap"
              onClick={() => setShowFilters((current) => !current)}
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Filters"}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-3 rounded-lg border border-border bg-white p-4 space-y-4">
              <div>
                <label htmlFor="products-search" className="text-sm font-medium text-foreground">
                  Search
                </label>
                <Input
                  id="products-search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by product name or description"
                  className="mt-2"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      size="sm"
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={featuredOnly ? "default" : "outline"}
                  onClick={() => setFeaturedOnly((current) => !current)}
                >
                  {featuredOnly ? "Featured Only" : "Include All Products"}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setFeaturedOnly(false)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {displayProducts.length === 0 ? (
        <div className="rounded-lg border border-border bg-white p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground">No products found</h3>
          <p className="text-muted-foreground mt-1">Try changing search text or filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-border hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/products/${product.slug}`} className="flex items-start sm:items-center gap-4 flex-1 min-w-0 w-full">
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
              </Link>

              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                <ProductLikeButton
                  productId={product.id}
                  initialLikes={product.likes_count}
                  size="sm"
                  className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                />

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-yellow-600 border-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors bg-transparent"
                >
                  <Link href={`/products/${product.slug}`}>See More</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
