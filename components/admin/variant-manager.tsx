"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Trash2, ImageIcon } from "lucide-react"

interface Variant {
  id: number
  product_id: number
  variant_name: string
  variant_name_sw: string | null
  quantity: number
  image_url: string | null
  display_order: number
}

interface VariantManagerProps {
  productId: number
  productSlug: string
  productName: string
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function VariantManager({
  productId,
  productSlug,
  productName,
  isOpen,
  onClose,
  onUpdate,
}: VariantManagerProps) {
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadVariants()
    }
  }, [isOpen, productId])

  const loadVariants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}/variants`)
      if (!response.ok) throw new Error("Failed to load variants")
      const data = await response.json()
      setVariants(data)
    } catch (error) {
      console.error("[v0] Error loading variants:", error)
      alert("Failed to load variants")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)

      // First, create a new variant entry
      const createResponse = await fetch(`/api/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variant_name: `Variant ${variants.length + 1}`,
          variant_name_sw: null,
          quantity: 0,
          display_order: variants.length,
        }),
      })

      if (!createResponse.ok) throw new Error("Failed to create variant")
      const newVariant = await createResponse.json()

      // Upload image to Cloudinary
      const formData = new FormData()
      formData.append("file", file)
      formData.append("productSlug", productSlug)
      formData.append("variantId", newVariant.id.toString())

      const uploadResponse = await fetch("/api/upload/variant", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error("Upload failed")
      const uploadData = await uploadResponse.json()

      // Update variant with image URL
      await fetch(`/api/products/${productId}/variants/${newVariant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: uploadData.url }),
      })

      await loadVariants()
      onUpdate()
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteVariant = async (variantId: number) => {
    if (!confirm("Are you sure you want to delete this variant image?")) return

    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}/variants/${variantId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete variant")

      await loadVariants()
      onUpdate()
    } catch (error) {
      console.error("[v0] Delete error:", error)
      alert("Failed to delete variant")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Variant Images - {productName}</DialogTitle>
          <DialogDescription>Upload images to show different variants of this product</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 bg-muted/30 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Variant Images</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add images showing different types or finishes of this product
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
              }}
              className="hidden"
              id="upload-variant"
              disabled={uploading}
            />
            <Button onClick={() => document.getElementById("upload-variant")?.click()} disabled={uploading} size="lg">
              <Upload className="w-5 h-5 mr-2" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>

          {loading && variants.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading variants...</p>
            </div>
          ) : variants.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold mb-3">Uploaded Variant Images ({variants.length})</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {variants.map((variant) => (
                  <div key={variant.id} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-border">
                      {variant.image_url ? (
                        <img
                          src={variant.image_url || "/placeholder.svg"}
                          alt={`Variant ${variant.id}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteVariant(variant.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No variant images yet. Upload images to get started.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
