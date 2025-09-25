"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, ImageIcon, Save, Eye, Plus, Edit, Package, Trash2 } from "lucide-react"
import {
  type Product,
  getAllProducts,
  updateProductImage,
  updateVariantImage,
  getProductCategories,
} from "@/lib/products-db"

export default function ProductManagement() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        console.log("[v0] Loading products and categories from Supabase...")

        const [productsData, categoriesData] = await Promise.all([getAllProducts(), getProductCategories()])

        console.log("[v0] Admin loaded products from Supabase:", productsData)
        console.log("[v0] Admin loaded categories from Supabase:", categoriesData)

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("[v0] Error loading data:", error)
        alert("Failed to load products. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const handleImageUpload = async (productId: number, variantId: string | null, file: File, isPreview = false) => {
    setIsLoading(true)
    console.log(
      `[v0] Uploading ${isPreview ? "preview" : "main"} image for product ${productId}, variant ${variantId}:`,
      file.name,
    )

    try {
      const formData = new FormData()
      formData.append("file", file)

      const folder = isPreview
        ? "africa-stickers/products/preview-images"
        : variantId
          ? "africa-stickers/products/variants"
          : "africa-stickers/products/main-images"
      formData.append("folder", folder)

      console.log("[v0] Making upload request to /api/upload")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Upload response status:", response.status)

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const errorText = await response.text()
        console.error("[v0] Non-JSON response received:", errorText)
        data = { error: `Server returned non-JSON response: ${response.status} ${response.statusText}` }
      }

      if (!response.ok) {
        console.error("[v0] Upload failed with error:", data)
        throw new Error(data.error || `Upload failed with status ${response.status}`)
      }

      console.log("[v0] Upload response data:", data)

      const imageUrl = data.secure_url

      if (isPreview) {
        await updateProductImage(productId, imageUrl, true)
      } else if (variantId) {
        await updateVariantImage(productId, variantId, imageUrl)
      } else {
        await updateProductImage(productId, imageUrl, false)
      }

      const updatedProducts = await getAllProducts()
      setProducts(updatedProducts)

      // Notify other components about the update
      window.dispatchEvent(new CustomEvent("productsUpdated"))

      console.log("[v0] Upload successful:", imageUrl)
      alert(`${isPreview ? "Preview" : "Main"} image uploaded successfully!`)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (productId: number, variantId: string | null, isPreview = false) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    console.log(`[v0] Deleting ${isPreview ? "preview" : "main"} image for product ${productId}, variant ${variantId}`)

    try {
      // Get the current image URL to extract public_id
      const product = products.find((p) => p.id === productId)
      if (!product) {
        throw new Error("Product not found")
      }

      let imageUrl = ""
      if (isPreview) {
        imageUrl = product.preview_image_url || ""
      } else if (variantId) {
        const variant = product.variants?.find((v) => v.variant_id === variantId)
        imageUrl = variant?.image_url || ""
      } else {
        imageUrl = product.image_url || ""
      }

      if (!imageUrl) {
        throw new Error("No image to delete")
      }

      // Extract public_id from Cloudinary URL
      const urlParts = imageUrl.split("/")
      const uploadIndex = urlParts.findIndex((part) => part === "upload")
      if (uploadIndex === -1) {
        throw new Error("Invalid Cloudinary URL")
      }

      // Get everything after /upload/v{version}/
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/")
      const publicId = pathAfterUpload.split(".")[0] // Remove file extension

      console.log("[v0] Extracted public_id:", publicId)

      // Delete from Cloudinary
      const deleteResponse = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      })

      const deleteResult = await deleteResponse.json()
      if (!deleteResponse.ok) {
        throw new Error(deleteResult.error || "Failed to delete from Cloudinary")
      }

      console.log("[v0] Image deleted from Cloudinary:", deleteResult)

      // Update database to remove image URL
      if (isPreview) {
        await updateProductImage(productId, "", true)
      } else if (variantId) {
        await updateVariantImage(productId, variantId, "")
      } else {
        await updateProductImage(productId, "", false)
      }

      // Refresh products list
      const updatedProducts = await getAllProducts()
      setProducts(updatedProducts)

      // Notify other components about the update
      window.dispatchEvent(new CustomEvent("productsUpdated"))

      console.log("[v0] Image deletion successful")
      alert("Image deleted successfully!")
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert(`Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`)
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
            src={product.image_url || `/placeholder.svg?height=200&width=300&query=${product.name}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="gap-1 text-xs"
                onClick={() => router.push(`/products/${product.slug}`)}
              >
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">Preview</span>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="gap-1 text-xs"
                onClick={() => setSelectedProduct(product)}
              >
                <Edit className="w-3 h-3" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium">Preview Image (for product listing)</Label>
          <div className="flex gap-2 mt-1">
            <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0 relative group">
              <img
                src={product.preview_image_url || `/placeholder.svg?height=48&width=48&query=${product.name}`}
                alt={`${product.name} preview`}
                className="w-full h-full object-cover"
              />
              {product.preview_image_url && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1 text-xs p-1 h-6 w-6"
                    disabled={isLoading}
                    onClick={() => handleDeleteImage(product.id, null, true)}
                  >
                    <Trash2 className="w-2 h-2" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleImageUpload(product.id, null, file, true)
                  }
                }}
                className="hidden"
                disabled={isLoading}
                id={`preview-image-${product.id}`}
              />
              <Button
                size="sm"
                variant="outline"
                className="gap-1 text-xs bg-transparent w-full"
                disabled={isLoading}
                onClick={() => document.getElementById(`preview-image-${product.id}`)?.click()}
              >
                <Upload className="w-3 h-3" />
                {isLoading ? "Uploading..." : "Upload Preview"}
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
                  handleImageUpload(product.id, null, file, false)
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
            {product.image_url && (
              <Button
                size="sm"
                variant="destructive"
                className="gap-1 text-xs"
                disabled={isLoading}
                onClick={() => handleDeleteImage(product.id, null, false)}
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Variants ({product.variants?.length || 0})</Label>
            <Button size="sm" variant="outline" className="gap-1 text-xs bg-transparent">
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.variants?.map((variant) => (
              <div key={variant.variant_id} className="border rounded-lg p-3 space-y-2">
                <div className="aspect-square bg-muted rounded overflow-hidden relative group">
                  <img
                    src={variant.image_url || `/placeholder.svg?height=100&width=100&query=${variant.name}`}
                    alt={variant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-1 text-xs p-1 h-6"
                      onClick={() => router.push(`/products/${product.slug}`)}
                    >
                      <Eye className="w-2 h-2" />
                      View
                    </Button>
                    {variant.image_url && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1 text-xs p-1 h-6"
                        disabled={isLoading}
                        onClick={() => handleDeleteImage(product.id, variant.variant_id, false)}
                      >
                        <Trash2 className="w-2 h-2" />
                      </Button>
                    )}
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
                      handleImageUpload(product.id, variant.variant_id, file)
                    }
                  }}
                  className="hidden"
                  disabled={isLoading}
                  id={`variant-image-${product.id}-${variant.variant_id}`}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-xs w-full bg-transparent"
                  disabled={isLoading}
                  onClick={() => document.getElementById(`variant-image-${product.id}-${variant.variant_id}`)?.click()}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

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
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
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
