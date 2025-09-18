"use client"

import { useState } from "react"
import type { CloudinaryFolder } from "@/lib/cloudinary"

interface UploadOptions {
  folder: CloudinaryFolder
  productId?: string
  variantId?: string
}

interface UploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File, options: UploadOptions): Promise<UploadResult | null> => {
    setIsUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", options.folder)

      if (options.productId) {
        formData.append("productId", options.productId)
      }

      if (options.variantId) {
        formData.append("variantId", options.variantId)
      }

      // Simulate upload progress (in real implementation, you'd use XMLHttpRequest for progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Upload failed")
      }

      console.log("[v0] Upload successful:", result.data.public_id)
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      console.error("[v0] Upload error:", errorMessage)
      return null
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const deleteImage = async (publicId: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/images", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: publicId }),
      })

      const result = await response.json()
      return result.success
    } catch (err) {
      console.error("[v0] Delete error:", err)
      return false
    }
  }

  return {
    uploadImage,
    deleteImage,
    isUploading,
    uploadProgress,
    error,
  }
}
