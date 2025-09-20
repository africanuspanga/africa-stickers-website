"use client"

import { useState } from "react"
import { Filter, Heart } from "lucide-react"
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black/20 rounded flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 bg-black/30 rounded"></div>
                </div>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-yellow-600 hover:bg-yellow-50"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>

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
