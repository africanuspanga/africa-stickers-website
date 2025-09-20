"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, ImageIcon, Save, Eye, Plus, Edit, Package } from "lucide-react"
import { products as initialProducts } from "@/lib/products"

type Product = {
  id: number
  name: string
  description: string
  category: string
  slug: string
  imageUrl: string | null
  variants: Array<{
    id: string
    name: string
    imageUrl: string | null
    code: string
  }>
  featured?: boolean
  specifications?: {
    material: string
    thickness: string
    adhesive: string
  }
}

const productCategories = [
  { id: "vinyl", name: "Vinyl" },
  { id: "wrapping", name: "Wrapping" },
  { id: "reflective", name: "Reflective" },
  { id: "decorative", name: "Decorative" },
  { id: "automotive", name: "Automotive" },
  { id: "transfer", name: "Transfer" },
  { id: "custom", name: "Custom" },
  { id: "tools", name: "Tools" },
]

export default function ProductManagement() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const [products, setProducts] = useState<Product[]>(
    initialProducts.map((product) => ({
      ...product,
      featured: [1, 2, 3, 8, 10].includes(product.id),
      variants:
        product.id === 1
          ? [
              { id: "1", name: "Red Vinyl", imageUrl: null, code: "CVS-001" },
              { id: "2", name: "Blue Vinyl", imageUrl: null, code: "CVS-002" },
              { id: "3", name: "Gold Vinyl", imageUrl: null, code: "CVS-003" },
            ]
          : product.id === 2
            ? [
                { id: "4", name: "Carbon Fiber", imageUrl: null, code: "WS-001" },
                { id: "5", name: "Matte Black", imageUrl: null, code: "WS-002" },
              ]
            : product.id === 3
              ? [
                  { id: "6", name: "White Reflective", imageUrl: null, code: "RS-001" },
                  { id: "7", name: "Yellow Reflective", imageUrl: null, code: "RS-002" },
                ]
              : [],
      specifications: {
        material: "Premium Quality",
        thickness: "Standard",
        adhesive: "Permanent",
      },
    })),
  )

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const handleImageUpload = async (productId: number, variantId: string | null, file: File) => {
    setIsLoading(true)
    console.log(`[v0] Uploading image for product ${productId}, variant ${variantId}:`, file.name)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const folder = variantId ? "africa-stickers/products/variants" : "africa-stickers/products/main-images"
      formData.append("folder", folder)

      console.log("[v0] Making upload request to /api/upload")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Upload response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] Upload failed with error:", errorData)
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      console.log("[v0] Upload response data:", data)

      const imageUrl = data.secure_url

      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId) {
            if (variantId) {
              return {
                ...product,
                variants: product.variants.map((variant) =>
                  variant.id === variantId ? { ...variant, imageUrl } : variant,
                ),
              }
            } else {
              return { ...product, imageUrl }
            }
          }
          return product
        }),
      )

      console.log("[v0] Upload successful:", imageUrl)
      alert("Image uploaded successfully!")
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChanges = () => {
    setIsLoading(true)
    console.log("[v0] Saving product changes")
    setTimeout(() => {
      setIsLoading(false)
      alert("Product changes saved successfully!")
    }, 1000)
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">{product.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm line-clamp-2">
              High-quality {product.category} products for professional use
            </CardDescription>
          </div>
          <Badge variant={product.featured ? "default" : "secondary"} className="self-start">
            {product.featured ? "Featured" : "Standard"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
          <img
            src={product.imageUrl || `/placeholder.svg?height=200&width=300&query=${product.name}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="gap-1 text-xs">
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button size="sm" variant="secondary" className="gap-1 text-xs">
                <Edit className="w-3 h-3" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium">Main Product Image</Label>
          <div className="flex gap-2 mt-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(product.id, null, file)
                }
              }}
              className="hidden"
              disabled={isLoading}
              id={`main-image-${product.id}`}
            />
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-xs bg-transparent flex-1"
              disabled={isLoading}
              onClick={() => document.getElementById(`main-image-${product.id}`)?.click()}
            >
              <Upload className="w-3 h-3" />
              {isLoading ? "Uploading..." : "Choose & Upload Image"}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Variants ({product.variants.length})</Label>
            <Button size="sm" variant="outline" className="gap-1 text-xs bg-transparent">
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.variants.map((variant) => (
              <div key={variant.id} className="border rounded-lg p-3 space-y-2">
                <div className="aspect-square bg-muted rounded overflow-hidden relative group">
                  <img
                    src={variant.imageUrl || `/placeholder.svg?height=100&width=100&query=${variant.name}`}
                    alt={variant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" variant="secondary" className="gap-1 text-xs">
                      <Eye className="w-2 h-2" />
                      View
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium truncate">{variant.name}</p>
                  <p className="text-xs text-muted-foreground">{variant.code}</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(product.id, variant.id, file)
                    }
                  }}
                  className="hidden"
                  disabled={isLoading}
                  id={`variant-image-${product.id}-${variant.id}`}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs w-full bg-transparent"
                  disabled={isLoading}
                  onClick={() => document.getElementById(`variant-image-${product.id}-${variant.id}`)?.click()}
                >
                  <Upload className="w-2 h-2" />
                  {isLoading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setSelectedProduct(product)}
            variant="outline"
            size="sm"
            className="flex-1 gap-1 text-xs"
          >
            <Edit className="w-3 h-3" />
            <span className="hidden sm:inline">Edit Details</span>
            <span className="sm:hidden">Edit</span>
          </Button>
          <Button
            onClick={() => router.push(`/products/${product.slug}`)}
            variant="outline"
            size="sm"
            className="gap-1 text-xs shrink-0"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">View Live</span>
            <span className="sm:hidden">View</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-auto sm:h-16 items-center justify-between p-4 sm:px-6 gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button onClick={() => router.push("/admin")} variant="ghost" size="sm" className="gap-2 shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">Product Management</h1>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button onClick={() => setShowAddProduct(true)} variant="outline" className="gap-2 text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Manage Product Images & Details</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload and manage images for your products and their variants.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => setSelectedCategory("all")}
              >
                All Products ({products.length})
              </Button>
              {productCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({products.filter((p) => p.category === category.id).length})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">No products match the selected category.</p>
          </div>
        )}

        <Card className="mt-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package className="w-5 h-5 text-primary" />
              Bulk Actions
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Perform actions on multiple products at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm">
                <Upload className="w-4 h-4" />
                Bulk Image Upload
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm">
                <ImageIcon className="w-4 h-4" />
                Generate Variants
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm">
                <Save className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
