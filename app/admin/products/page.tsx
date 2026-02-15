"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  Save,
  Eye,
  Plus,
  Edit,
  Package,
  Trash2,
  Grid3x3,
  RefreshCw,
} from "lucide-react"
import { VariantManager } from "@/components/admin/variant-manager"
import {
  type Product,
  getAllProducts,
  updateProductImage,
  updateVariantImage,
  getProductCategories,
  createProduct,
  updateProductDetails,
  createProductVariant,
} from "@/lib/products-db"

type ProductFormMode = "create" | "edit"

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function escapeCsv(value: string | number | boolean | null | undefined) {
  const text = value == null ? "" : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

export default function ProductManagement() {
  const router = useRouter()
  const bulkImageInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>([])
  const [loading, setLoading] = useState(true)

  const [variantManagerOpen, setVariantManagerOpen] = useState(false)
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null)

  const [productFormOpen, setProductFormOpen] = useState(false)
  const [productFormMode, setProductFormMode] = useState<ProductFormMode>("create")
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    category: "",
    slug: "",
    featured: false,
  })

  const loadData = async (showPageLoader = false) => {
    try {
      if (showPageLoader) setLoading(true)

      const [productsData, categoriesData] = await Promise.all([getAllProducts(), getProductCategories()])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("[v0] Error loading products:", error)
      alert("Failed to load products. Please refresh the page.")
    } finally {
      if (showPageLoader) setLoading(false)
    }
  }

  useEffect(() => {
    loadData(true)
  }, [])

  const filteredProducts = useMemo(
    () => (selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)),
    [products, selectedCategory],
  )

  const uploadFileToCloudinary = async (file: File, folder: string) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    let data: any = null
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = { error: `Server returned non-JSON response (${response.status})` }
    }

    if (!response.ok || !data?.secure_url) {
      throw new Error(data?.error || `Upload failed with status ${response.status}`)
    }

    return data.secure_url as string
  }

  const handleImageUpload = async (
    productId: number,
    variantId: number | null,
    file: File,
    isPreview = false,
    notify = true,
  ) => {
    setIsLoading(true)

    try {
      const folder = isPreview
        ? "africa-stickers/products/preview-images"
        : variantId
          ? "africa-stickers/products/variants"
          : "africa-stickers/products/main-images"

      const imageUrl = await uploadFileToCloudinary(file, folder)

      if (isPreview) {
        await updateProductImage(productId, imageUrl, true)
      } else if (variantId) {
        await updateVariantImage(productId, variantId, imageUrl)
      } else {
        await updateProductImage(productId, imageUrl, false)
      }

      await loadData()
      window.dispatchEvent(new CustomEvent("productsUpdated"))

      if (notify) {
        alert(`${isPreview ? "Preview" : "Main"} image uploaded successfully.`)
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (productId: number, variantId: number | null, isPreview = false) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      const product = products.find((p) => p.id === productId)
      if (!product) {
        throw new Error("Product not found")
      }

      let imageUrl = ""
      if (isPreview) {
        imageUrl = product.preview_image_url || ""
      } else if (variantId) {
        imageUrl = product.variants?.find((variant) => variant.id === variantId)?.image_url || ""
      } else {
        imageUrl = product.image_url || ""
      }

      if (!imageUrl) {
        throw new Error("No image to delete")
      }

      const urlParts = imageUrl.split("/")
      const uploadIndex = urlParts.findIndex((part) => part === "upload")
      if (uploadIndex === -1) {
        throw new Error("Invalid Cloudinary URL")
      }

      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/")
      const publicId = pathAfterUpload.split(".")[0]

      const deleteResponse = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      })
      const deleteResult = await deleteResponse.json()

      if (!deleteResponse.ok) {
        throw new Error(deleteResult.error || "Failed to delete from Cloudinary")
      }

      if (isPreview) {
        await updateProductImage(productId, "", true)
      } else if (variantId) {
        await updateVariantImage(productId, variantId, "")
      } else {
        await updateProductImage(productId, "", false)
      }

      await loadData()
      window.dispatchEvent(new CustomEvent("productsUpdated"))
      alert("Image deleted successfully.")
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert(`Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const openCreateProductDialog = () => {
    setProductFormMode("create")
    setEditingProductId(null)
    setProductFormData({
      name: "",
      description: "",
      category: "",
      slug: "",
      featured: false,
    })
    setProductFormOpen(true)
  }

  const openEditProductDialog = (product: Product) => {
    setProductFormMode("edit")
    setEditingProductId(product.id)
    setProductFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      slug: product.slug,
      featured: product.featured,
    })
    setProductFormOpen(true)
  }

  const handleProductSave = async () => {
    const name = productFormData.name.trim()
    const description = productFormData.description.trim()
    const category = productFormData.category.trim()
    const slug = toSlug(productFormData.slug || productFormData.name)

    if (!name || !description || !category || !slug) {
      alert("Please fill in product name, description, category, and slug.")
      return
    }

    setIsLoading(true)

    try {
      if (productFormMode === "create") {
        await createProduct({
          name,
          description,
          category,
          slug,
          featured: productFormData.featured,
          image_url: null,
          preview_image_url: null,
          specifications: {},
        })
      } else if (editingProductId) {
        await updateProductDetails(editingProductId, {
          name,
          description,
          category,
          slug,
          featured: productFormData.featured,
        })
      }

      await loadData()
      window.dispatchEvent(new CustomEvent("productsUpdated"))
      setProductFormOpen(false)
      alert(`Product ${productFormMode === "create" ? "created" : "updated"} successfully.`)
    } catch (error) {
      console.error("[v0] Product save error:", error)
      alert(`Failed to save product: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshData = async () => {
    setIsLoading(true)
    try {
      await loadData()
      alert("Product data refreshed.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageVariants = (product: Product) => {
    setSelectedProductForVariants(product)
    setVariantManagerOpen(true)
  }

  const handleVariantsUpdate = async () => {
    await loadData()
    window.dispatchEvent(new CustomEvent("productsUpdated"))
  }

  const handleBulkUploadClick = () => {
    bulkImageInputRef.current?.click()
  }

  const findProductForFileName = (fileName: string) => {
    const baseName = toSlug(fileName.replace(/\.[^/.]+$/, ""))
    return (
      products.find((product) => product.slug === baseName) ||
      products.find((product) => baseName.includes(product.slug) || product.slug.includes(baseName))
    )
  }

  const handleBulkImageInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsLoading(true)

    let uploaded = 0
    let skipped = 0

    try {
      for (const file of files) {
        const matchedProduct = findProductForFileName(file.name)
        if (!matchedProduct) {
          skipped += 1
          continue
        }

        await handleImageUpload(matchedProduct.id, null, file, false, false)
        uploaded += 1
      }

      await loadData()
      window.dispatchEvent(new CustomEvent("productsUpdated"))
      alert(`Bulk upload complete. Uploaded: ${uploaded}, Skipped (no product match): ${skipped}.`)
    } catch (error) {
      console.error("[v0] Bulk upload error:", error)
      alert(`Bulk upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
      event.target.value = ""
    }
  }

  const handleGenerateVariants = async () => {
    const productsWithoutVariants = filteredProducts.filter((product) => !product.variants || product.variants.length === 0)
    if (productsWithoutVariants.length === 0) {
      alert("All products in this filter already have variants.")
      return
    }

    setIsLoading(true)
    let created = 0
    let failed = 0

    try {
      for (const product of productsWithoutVariants) {
        try {
          await createProductVariant(product.id, {
            variant_name: `${product.name} Variant 1`,
            quantity: 0,
            display_order: 0,
          })
          created += 1
        } catch (error) {
          console.error("[v0] Failed to create variant for product:", product.id, error)
          failed += 1
        }
      }

      await loadData()
      window.dispatchEvent(new CustomEvent("productsUpdated"))
      alert(`Variant generation complete. Created: ${created}, Failed: ${failed}.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    const header = ["id", "name", "slug", "category", "featured", "likes_count", "variant_count", "description"]
    const rows = filteredProducts.map((product) => [
      product.id,
      product.name,
      product.slug,
      product.category,
      product.featured,
      product.likes_count ?? "",
      product.variants?.length || 0,
      product.description,
    ])

    const csv = [header.map(escapeCsv).join(","), ...rows.map((row) => row.map(escapeCsv).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "africa-stickers-products.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate">{product.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm line-clamp-2">{product.description}</CardDescription>
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
              <Button size="sm" variant="secondary" className="gap-1 text-xs" onClick={() => openEditProductDialog(product)}>
                <Edit className="w-3 h-3" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs font-medium">Preview Image (product listing)</Label>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Variants ({product.variants?.length || 0})</Label>
            <Button
              size="sm"
              variant="default"
              className="gap-1 text-xs bg-[#D4AF37] hover:bg-[#B8941F] text-black"
              onClick={() => handleManageVariants(product)}
            >
              <Grid3x3 className="w-3 h-3" />
              Manage Variants
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Add and upload images for product variants.</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => openEditProductDialog(product)} variant="outline" size="sm" className="flex-1 gap-1 text-xs">
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
            <Button onClick={openCreateProductDialog} variant="outline" className="gap-2 text-xs sm:text-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </Button>
            <Button
              onClick={handleRefreshData}
              disabled={isLoading}
              className="gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Working..." : "Refresh"}
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Manage Product Images & Details</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload and manage images, product details, variants, and bulk operations.
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
              Run bulk image uploads, create missing variants, and export product data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={bulkImageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleBulkImageInputChange}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                variant="outline"
                className="gap-2 bg-transparent text-xs sm:text-sm"
                onClick={handleBulkUploadClick}
                disabled={isLoading}
              >
                <Upload className="w-4 h-4" />
                Bulk Image Upload
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-transparent text-xs sm:text-sm"
                onClick={handleGenerateVariants}
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4" />
                Generate Variants
              </Button>
              <Button
                variant="outline"
                className="gap-2 bg-transparent text-xs sm:text-sm"
                onClick={handleExportData}
                disabled={isLoading}
              >
                <Save className="w-4 h-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={productFormOpen} onOpenChange={setProductFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{productFormMode === "create" ? "Add Product" : "Edit Product"}</DialogTitle>
            <DialogDescription>
              {productFormMode === "create"
                ? "Create a new product with details, slug, and category."
                : "Update the selected product details."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={productFormData.name}
                onChange={(e) => {
                  const nextName = e.target.value
                  setProductFormData((prev) => ({
                    ...prev,
                    name: nextName,
                    slug: productFormMode === "create" ? toSlug(nextName) : prev.slug,
                  }))
                }}
                placeholder="Product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-category">Category</Label>
              <Input
                id="product-category"
                value={productFormData.category}
                onChange={(e) => setProductFormData((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="vinyl, reflective, decorative..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-slug">Slug</Label>
              <Input
                id="product-slug"
                value={productFormData.slug}
                onChange={(e) => setProductFormData((prev) => ({ ...prev, slug: toSlug(e.target.value) }))}
                placeholder="product-slug"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                rows={4}
                value={productFormData.description}
                onChange={(e) => setProductFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
              />
            </div>

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={productFormData.featured}
                onChange={(e) => setProductFormData((prev) => ({ ...prev, featured: e.target.checked }))}
              />
              <span className="text-sm">Featured product</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProductFormOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleProductSave} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : productFormMode === "create" ? "Create Product" : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedProductForVariants && (
        <VariantManager
          productId={selectedProductForVariants.id}
          productSlug={selectedProductForVariants.slug}
          productName={selectedProductForVariants.name}
          isOpen={variantManagerOpen}
          onClose={() => {
            setVariantManagerOpen(false)
            setSelectedProductForVariants(null)
          }}
          onUpdate={handleVariantsUpdate}
        />
      )}
    </div>
  )
}
