"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ImageIcon, Search, Trash2, Download, Eye, Upload } from "lucide-react"
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary"

interface CloudinaryImage {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
  folder?: string
}

export default function ImageLibrary() {
  const router = useRouter()
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string>("all")

  useEffect(() => {
    fetchImages()
  }, [selectedFolder])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedFolder !== "all") {
        params.append("folder", selectedFolder)
      }

      const response = await fetch(`/api/images?${params}`)
      const result = await response.json()

      if (result.success) {
        setImages(result.images)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteImage = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const response = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      })

      const result = await response.json()
      if (result.success) {
        setImages((prev) => prev.filter((img) => img.public_id !== publicId))
      }
    } catch (error) {
      console.error("[v0] Failed to delete image:", error)
    }
  }

  const filteredImages = images.filter((image) => image.public_id.toLowerCase().includes(searchTerm.toLowerCase()))

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

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
              <h1 className="text-xl font-bold">Image Library</h1>
              <p className="text-sm text-muted-foreground">Maktaba ya Picha</p>
            </div>
          </div>
          <Button onClick={fetchImages} variant="outline" className="gap-2 bg-transparent">
            <Upload className="w-4 h-4" />
            Refresh Library
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter & Search Images</CardTitle>
            <CardDescription>Find and organize your uploaded images</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search images by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedFolder === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFolder("all")}
                >
                  All Images ({images.length})
                </Button>
                {Object.entries(CLOUDINARY_FOLDERS).map(([key, folder]) => (
                  <Button
                    key={key}
                    variant={selectedFolder === folder ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFolder(folder)}
                  >
                    {key.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading images...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No images found</p>
            <p className="text-sm text-muted-foreground">
              Upload images through the homepage or product management pages
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.public_id} className="overflow-hidden">
                <div className="aspect-square bg-muted relative group">
                  <img
                    src={image.secure_url || "/placeholder.svg"}
                    alt={image.public_id}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Eye className="w-3 h-3" />
                      View
                    </Button>
                    <Button size="sm" variant="secondary" className="gap-1">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => handleDeleteImage(image.public_id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium truncate">{image.public_id.split("/").pop()}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {image.format.toUpperCase()}
                      </Badge>
                      <span>
                        {image.width}×{image.height}
                      </span>
                      <span>{formatFileSize(image.bytes)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(image.created_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
