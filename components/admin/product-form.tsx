"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "./image-upload"
import { createProductAdmin, updateProduct } from "@/lib/admin-db"
import type { AdminProduct } from "@/lib/admin-db"

interface ProductFormProps {
  product?: AdminProduct
  onSave?: (product: AdminProduct) => void
  onCancel?: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    slug: product?.slug || "",
    price: product?.price || 0,
    stock_quantity: product?.stock_quantity || 0,
    featured: product?.featured || false,
    is_active: product?.is_active ?? true,
    image_url: product?.image_url || "",
    preview_image_url: product?.preview_image_url || "",
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  })

  const [saving, setSaving] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate slug from name
    if (field === "name" && !product) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let savedProduct: AdminProduct

      if (product) {
        // Update existing product
        savedProduct = await updateProduct(product.id, formData)
      } else {
        // Create new product
        savedProduct = await createProductAdmin({
          ...formData,
          specifications: {},
        })
      }

      if (onSave) {
        onSave(savedProduct)
      }
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      alert("Error saving product. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              placeholder="product-url-slug"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="vinyl, reflective, decorative, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange("stock_quantity", Number.parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Product description"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Main Product Image</Label>
          <ImageUpload onUploadComplete={(url) => handleInputChange("image_url", url)} className="mt-2" />
          {formData.image_url && (
            <div className="mt-2">
              <img
                src={formData.image_url || "/placeholder.svg"}
                alt="Product"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div>
          <Label>Preview/Thumbnail Image</Label>
          <ImageUpload onUploadComplete={(url) => handleInputChange("preview_image_url", url)} className="mt-2" />
          {formData.preview_image_url && (
            <div className="mt-2">
              <img
                src={formData.preview_image_url || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </div>
  )
}
