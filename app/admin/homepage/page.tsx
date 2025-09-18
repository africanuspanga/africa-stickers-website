"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, ImageIcon, Save, Eye, Trash2 } from "lucide-react"

interface HomepageImage {
  id: string
  section: string
  title: string
  currentImage: string
  description: string
}

export default function HomepageManagement() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [homepageImages, setHomepageImages] = useState<HomepageImage[]>([
    {
      id: "hero-bg",
      section: "Hero Section",
      title: "Hero Background Image",
      currentImage: "/images/hero-store.jpg",
      description: "Main background image for the hero section",
    },
    {
      id: "features-icon-1",
      section: "Features Section",
      title: "Quality Materials Icon",
      currentImage: "/placeholder.svg?height=64&width=64",
      description: "Icon representing quality materials",
    },
    {
      id: "features-icon-2",
      section: "Features Section",
      title: "Fast Delivery Icon",
      currentImage: "/placeholder.svg?height=64&width=64",
      description: "Icon representing fast delivery",
    },
    {
      id: "features-icon-3",
      section: "Features Section",
      title: "Custom Design Icon",
      currentImage: "/placeholder.svg?height=64&width=64",
      description: "Icon representing custom design services",
    },
    {
      id: "testimonial-avatar-1",
      section: "Testimonials",
      title: "Customer Avatar 1",
      currentImage: "/placeholder.svg?height=80&width=80",
      description: "Customer testimonial avatar",
    },
  ])

  const handleImageUpload = (imageId: string, file: File) => {
    setIsLoading(true)
    console.log(`[v0] Uploading image for ${imageId}:`, file.name)

    // Simulate upload delay
    setTimeout(() => {
      setIsLoading(false)
      // Update the image in state (mock)
      setHomepageImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, currentImage: URL.createObjectURL(file) } : img)),
      )
    }, 1000)
  }

  const handleSaveChanges = () => {
    setIsLoading(true)
    console.log("[v0] Saving homepage image changes")
    setTimeout(() => {
      setIsLoading(false)
      alert("Changes saved successfully!")
    }, 1000)
  }

  const groupedImages = homepageImages.reduce(
    (acc, image) => {
      if (!acc[image.section]) {
        acc[image.section] = []
      }
      acc[image.section].push(image)
      return acc
    },
    {} as Record<string, HomepageImage[]>,
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
              <h1 className="text-xl font-bold">Homepage Management</h1>
              <p className="text-sm text-muted-foreground">Usimamizi wa Ukurasa wa Kwanza</p>
            </div>
          </div>
          <Button onClick={handleSaveChanges} disabled={isLoading} className="gap-2 bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Manage Homepage Images</h2>
          <p className="text-muted-foreground">Upload and manage images for different sections of your homepage.</p>
          <p className="text-muted-foreground text-sm">
            Pakia na simamia picha za sehemu mbalimbali za ukurasa wako wa kwanza.
          </p>
        </div>

        {/* Image Sections */}
        <div className="space-y-8">
          {Object.entries(groupedImages).map(([section, images]) => (
            <Card key={section}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  {section}
                </CardTitle>
                <CardDescription>Manage images for the {section.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <div key={image.id} className="border rounded-lg p-4 space-y-4">
                      {/* Current Image Preview */}
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                        <img
                          src={image.currentImage || "/placeholder.svg"}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="secondary" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                        </div>
                      </div>

                      {/* Image Info */}
                      <div>
                        <h4 className="font-semibold text-sm">{image.title}</h4>
                        <p className="text-xs text-muted-foreground">{image.description}</p>
                      </div>

                      {/* Upload Controls */}
                      <div className="space-y-2">
                        <Label htmlFor={`upload-${image.id}`} className="text-xs">
                          Upload New Image / Pakia Picha Mpya
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`upload-${image.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleImageUpload(image.id, file)
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

                      {/* Additional Controls */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Homepage Content Settings</CardTitle>
            <CardDescription>Manage text content and settings for homepage sections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">Hero Title / Kichwa cha Hero</Label>
                <Input id="hero-title" defaultValue="Premium Stickers & Vinyl Solutions" className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Hero Subtitle / Kichwa kidogo cha Hero</Label>
                <Textarea
                  id="hero-subtitle"
                  defaultValue="Karibu ujipatie STICKERS aina mbalimbali na rangi zote pamoja na professional sticker printing, vinyl cutting, na custom graphics"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-info">Contact Information / Maelezo ya Mawasiliano</Label>
              <Input id="contact-info" defaultValue="+255 715 724 727" className="w-full" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
