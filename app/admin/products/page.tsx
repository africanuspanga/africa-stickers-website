"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, ImageIcon, Save, Eye, Plus, Edit, Package } from "lucide-react"
import { productCategories, type Product } from "@/lib/product-data"

export default function ProductManagement() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddProduct, setShowAddProduct] = useState(false)

  // Mock product data - will be replaced with API calls
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Color Vinyl Stickers",
      description: "Stika za vinyl zenye rangi mbalimbali",
      category: "vinyl",
      slug: "color-vinyl-stickers",
      imageUrl: null,
      featured: true,
      variants: [
        { id: "1", name: "Red Vinyl", imageUrl: null, code: "CVS-001" },
        { id: "2", name: "Blue Vinyl", imageUrl: null, code: "CVS-002" },
        { id: "3", name: "Gold Vinyl", imageUrl: null, code: "CVS-003" },
      ],
      specifications: {
        material: "Premium Vinyl",
        thickness: "0.1mm",
        adhesive: "Permanent",
      },
    },
    {
      id: 2,
      name: "Wrapping Stickers",
      description: "Stika za kufunika magari au vifaa kwa mwonekano wa kisasa",
      category: "wrapping",
      slug: "wrapping-stickers",
      imageUrl: null,
      featured: true,
      variants: [
        { id: "4", name: "Carbon Fiber", imageUrl: null, code: "WS-001" },
        { id: "5", name: "Matte Black", imageUrl: null, code: "WS-002" },
      ],
      specifications: {
        material: "Cast Vinyl",
        thickness: "0.15mm",
        adhesive: "Removable",
      },
    },
  ])

  const handleImageUpload = (productId: number, variantId: string | null, file: File) => {
    setIsLoading(true)
    console.log(`[v0] Uploading image for product ${productId}, variant ${variantId}:`, file.name)

    // Simulate upload delay
    setTimeout(() => {
      setIsLoading(false)
      const imageUrl = URL.createObjectURL(file)

      setProducts((prev) =>
        prev.map((product) => {
          if (product.id === productId) {
            if (variantId) {
              // Update variant image
              return {
                ...product,
                variants: product.variants.map((variant) =>
                  variant.id === variantId ? { ...variant, imageUrl } : variant,
                ),
              }
            } else {
              // Update main product image
              return { ...product, imageUrl }
            }
          }
          return product
        }),
      )
    }, 1000)
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
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <CardDescription className="text-sm">{product.description}</CardDescription>
          </div>
          <Badge variant={product.featured ? "default" : "secondary"}>
            {product.featured ? "Featured" : "Standard"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Product Image */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4 relative group">
          <img
            src={product.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="gap-1">
                <Eye className="w-3 h-3" />
                Preview
              </Button>
              <Button size="sm" variant="secondary" className="gap-1">
                <Edit className="w-3 h-3" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Upload Main Image */}
        <div className="mb-4">
          <Label className="text-xs">Main Product Image / Picha Kuu ya Bidhaa</Label>
          <div className="flex gap-2 mt-1">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(product.id, null, file)
                }
              }}
              className="text-xs"
            />
            <Button size="sm" variant="outline" className="gap-1 text-xs bg-transparent">
              <Upload className="w-3 h-3" />
              Upload
            </Button>
          </div>
        </div>

        {/* Product Variants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Product Variants ({product.variants.length})</Label>
            <Button size="sm" variant="outline" className="gap-1 text-xs bg-transparent">
              <Plus className="w-3 h-3" />
              Add Variant
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {product.variants.map((variant) => (
              <div key={variant.id} className="border rounded-lg p-3 space-y-2">
                <div className="aspect-square bg-muted rounded overflow-hidden relative group">
                  <img
                    src={variant.imageUrl || "/placeholder.svg?height=100&width=100"}
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
                  <p className="text-xs font-medium">{variant.name}</p>
                  <p className="text-xs text-muted-foreground">{variant.code}</p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(product.id, variant.id, file)
                    }
                  }}
                  className="text-xs h-8"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => setSelectedProduct(product)}
            variant="outline"
            size="sm"
            className="flex-1 gap-1 text-xs"
          >
            <Edit className="w-3 h-3" />
            Edit Details
          </Button>
          <Button
            onClick={() => router.push(`/products/${product.slug}`)}
            variant="outline"
            size="sm"
            className="gap-1 text-xs"
          >
            <Eye className="w-3 h-3" />
            View Live
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/admin")} variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold">Product Management</h1>
              <p className="text-sm text-muted-foreground">Usimamizi wa Bidhaa</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddProduct(true)} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
            <Button onClick={handleSaveChanges} disabled={isLoading} className="gap-2 bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Manage Product Images & Details</h2>
          <p className="text-muted-foreground">Upload and manage images for your products and their variants.</p>
          <p className="text-muted-foreground text-sm">
            Pakia na simamia picha za bidhaa zako na aina zake mbalimbali.
          </p>
        </div>

        {/* Product Categories Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter by Category / Chuja kwa Aina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                All Products ({products.length})
              </Button>
              {productCategories.map((category) => (
                <Button key={category.id} variant="outline" size="sm">
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bulk Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Bulk Actions / Vitendo vya Wingi
            </CardTitle>
            <CardDescription>Perform actions on multiple products at once</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Upload className="w-4 h-4" />
                Bulk Image Upload
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ImageIcon className="w-4 h-4" />
                Generate Variants
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Save className="w-4 h-4" />
                Export Product Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
