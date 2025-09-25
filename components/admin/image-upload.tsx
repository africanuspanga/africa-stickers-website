"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveImageUpload } from "@/lib/admin-db"

interface ImageUploadProps {
  onUploadComplete?: (imageUrl: string) => void
  folder?: string
  className?: string
}

export function ImageUpload({ onUploadComplete, folder = "africa-stickers", className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadProgress("Preparing upload...")

    try {
      const formData = new FormData()
      formData.append("file", file)

      setUploadProgress("Uploading to Cloudinary...")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      setUploadProgress("Saving to database...")

      // Save upload info to database
      await saveImageUpload({
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: file.name,
        file_size: file.size,
        width: result.width,
        height: result.height,
        format: result.secure_url.split(".").pop() || "jpg",
        resource_type: "image",
        folder: folder,
      })

      setUploadProgress("Upload complete!")

      if (onUploadComplete) {
        onUploadComplete(result.secure_url)
      }

      // Reset after a short delay
      setTimeout(() => {
        setUploadProgress("")
      }, 2000)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadProgress(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)

      setTimeout(() => {
        setUploadProgress("")
      }, 3000)
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ""
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <Input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="flex-1" />
        <Button disabled={uploading} variant="outline">
          {uploading ? "Uploading..." : "Choose Image"}
        </Button>
      </div>

      {uploadProgress && <div className="mt-2 text-sm text-muted-foreground">{uploadProgress}</div>}
    </div>
  )
}
