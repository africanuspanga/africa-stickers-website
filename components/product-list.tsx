"use client"

import { useState } from "react"
import { Filter, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { products } from "@/lib/products"

interface ProductListProps {
  showAll?: boolean
}

export function ProductList({ showAll = true }: ProductListProps) {
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  const displayProducts = showAll ? products : products.slice(0, 8)

  return (
    <div className="w-full">
      {showAll && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Our Products</h2>
          </div>

          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm"
              onClick={() => setSortBy(sortBy === "name" ? "category" : "name")}
            >
              Name / Jina
            </Button>

            <Button variant="ghost" className="flex items-center gap-2 text-sm">
              Time / Muda
            </Button>

            <Button variant="ghost" className="flex items-center gap-2 text-sm">
              Price / Bei
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm ml-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filter / Chuja
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border hover:shadow-lg transition-all duration-300 group"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md">
              <div className="w-10 h-10 bg-black/20 rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-black/30 rounded"></div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-yellow-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50"
              >
                <Heart className="w-4 h-4" />
              </Button>

              <Link href={`/products/${product.slug}`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  See More / Ona Zaidi
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
