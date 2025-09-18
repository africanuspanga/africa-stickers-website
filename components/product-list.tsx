"use client"

import { useState } from "react"
import { Filter, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Color Vinyl Stickers",
    description: "Stika za vinyl zenye rangi mbalimbali",
    category: "vinyl",
    slug: "color-vinyl-stickers",
    imageUrl: null, // Will be populated from Cloudinary via admin
    variants: [], // Will store product variants from admin
  },
  {
    id: 2,
    name: "Wrapping Stickers",
    description: "Stika za kufunika magari au vifaa kwa mwonekano wa kisasa",
    category: "wrapping",
    slug: "wrapping-stickers",
    imageUrl: null,
    variants: [],
  },
  {
    id: 3,
    name: "Reflective Sheeting",
    description: "Soft and Hard Materials (kwa barabara, Mabango, Magari n.k.)",
    category: "reflective",
    slug: "reflective-sheeting",
    imageUrl: null,
    variants: [],
  },
  {
    id: 4,
    name: "EGP Reflective Sheeting",
    description: "Sheeting za EGP zenye mwanga mkali na uimara kwa alama za barabarani na matumizi ya usalama",
    category: "reflective",
    slug: "egp-reflective-sheeting",
    imageUrl: null,
    variants: [],
  },
  {
    id: 5,
    name: "Wood Stickers",
    description: "Stika zenye muonekano au muundo wa mbao",
    category: "decorative",
    slug: "wood-stickers",
    imageUrl: null,
    variants: [],
  },
  {
    id: 6,
    name: "Marble Sheets",
    description: "Stika au karatasi zenye muundo wa marumaru (marble finish)",
    category: "decorative",
    slug: "marble-sheets",
    imageUrl: null,
    variants: [],
  },
  {
    id: 7,
    name: "Headlight Stickers",
    description: "Stika za kufunika au kulinda taa za magari na pikipiki",
    category: "automotive",
    slug: "headlight-stickers",
    imageUrl: null,
    variants: [],
  },
  {
    id: 8,
    name: "3M Reflective Tapes",
    description: "Tepu maalumu zinazotumika katika magari kwa lengo la usalama",
    category: "reflective",
    slug: "3m-reflective-tapes",
    imageUrl: null,
    variants: [],
  },
  {
    id: 9,
    name: "Gold & Chrome Mirror",
    description: "Stika zenye mwonekano wa kioo",
    category: "decorative",
    slug: "gold-chrome-mirror",
    imageUrl: null,
    variants: [],
  },
  {
    id: 10,
    name: "Heat Transfer Stickers",
    description: "Stika za kuhamisha kwa joto (kwa T-shirt na nguo)",
    category: "transfer",
    slug: "heat-transfer-stickers",
    imageUrl: null,
    variants: [],
  },
  {
    id: 11,
    name: "Tinted Stickers",
    description: "Stika za tint (kivuli kwa madirisha na vioo)",
    category: "automotive",
    slug: "tinted-stickers",
    imageUrl: null,
    variants: [],
  },
  {
    id: 12,
    name: "Frost Stickers",
    description: "Stika za kutoa mwonekano wa ukungu/frost kwenye vioo",
    category: "decorative",
    slug: "frost-stickers",
    imageUrl: null,
    variants: [],
  },
  {
    id: 13,
    name: "Self-Adhesive Vinyl",
    description: "Vinyl yenye gundi tayari kwa matumizi mbalimbali ya Kuprint",
    category: "vinyl",
    slug: "self-adhesive-vinyl",
    imageUrl: null,
    variants: [],
  },
  {
    id: 14,
    name: "Events Stickers",
    description: "Stika maalum kwa hafla au matukio",
    category: "custom",
    slug: "events-stickers",
    imageUrl: null,
    variants: [],
  },
  {
    id: 15,
    name: "Sticker Tools",
    description: "Vifaa vya kubandikia au kufanya kazi na stika",
    category: "tools",
    slug: "sticker-tools",
    imageUrl: null,
    variants: [],
  },
]

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

export { products }
