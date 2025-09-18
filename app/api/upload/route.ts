import { type NextRequest, NextResponse } from "next/server"
import { getCloudinaryConfig, validateImageFile, type CloudinaryFolder } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as CloudinaryFolder
    const productId = formData.get("productId") as string
    const variantId = formData.get("variantId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Get Cloudinary configuration
    const config = getCloudinaryConfig()

    // Convert file to base64 for upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    // Prepare upload parameters
    const timestamp = Math.round(Date.now() / 1000)
    const uploadParams = {
      file: dataURI,
      upload_preset: "africa_stickers_preset", // You'll need to create this in Cloudinary
      folder: folder,
      timestamp: timestamp,
      api_key: config.apiKey,
    }

    // Add product/variant specific naming
    if (productId) {
      uploadParams.public_id = variantId
        ? `${folder}/${productId}/${variantId}_${timestamp}`
        : `${folder}/${productId}_main_${timestamp}`
    }

    // Make request to Cloudinary
    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadParams),
    })

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.json()
      console.error("[v0] Cloudinary upload error:", error)
      return NextResponse.json({ error: "Failed to upload image to Cloudinary" }, { status: 500 })
    }

    const result = await cloudinaryResponse.json()
    console.log("[v0] Cloudinary upload successful:", result.public_id)

    return NextResponse.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    })
  } catch (error) {
    console.error("[v0] Upload API error:", error)
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 })
  }
}
