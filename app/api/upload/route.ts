import { type NextRequest, NextResponse } from "next/server"
import { validateImageFile, type CloudinaryFolder } from "@/lib/cloudinary"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as CloudinaryFolder) || "africa-stickers/products/main-images"

    if (!file) {
      console.log("[v0] No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] File received:", file.name, file.type, file.size)

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      console.log("[v0] File validation failed:", validation.error)
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Get environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[v0] Missing Cloudinary environment variables")
      return NextResponse.json({ error: "Cloudinary configuration missing" }, { status: 500 })
    }

    console.log("[v0] Cloudinary config found:", { cloudName, apiKey: apiKey.substring(0, 6) + "..." })

    // Convert file to base64 for upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    const timestamp = Math.round(Date.now() / 1000)
    const publicId = `${timestamp}_${file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")}`

    const paramsToSign = {
      folder: folder,
      public_id: publicId,
      timestamp: timestamp,
    }

    console.log("[v0] Params to sign:", paramsToSign)

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
      .join("&")

    const stringToSign = sortedParams + apiSecret
    console.log("[v0] String to sign:", stringToSign)

    const signature = crypto.createHash("sha1").update(stringToSign).digest("hex")

    console.log("[v0] Generated signature:", signature)

    // Prepare form data for Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append("file", dataURI)
    cloudinaryFormData.append("folder", folder)
    cloudinaryFormData.append("public_id", publicId)
    cloudinaryFormData.append("timestamp", timestamp.toString())
    cloudinaryFormData.append("api_key", apiKey)
    cloudinaryFormData.append("signature", signature)

    console.log(`[v0] Uploading to Cloudinary: ${publicId}`)

    // Make request to Cloudinary
    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudinaryFormData,
    })

    console.log("[v0] Cloudinary response status:", cloudinaryResponse.status)

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text()
      console.error("[v0] Cloudinary upload error:", error)
      return NextResponse.json({ error: `Failed to upload image to Cloudinary: ${error}` }, { status: 500 })
    }

    const result = await cloudinaryResponse.json()
    console.log("[v0] Cloudinary upload successful:", result.public_id)

    return NextResponse.json({
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    })
  } catch (error) {
    console.error("[v0] Upload API error:", error)
    return NextResponse.json({ error: `Internal server error during upload: ${error}` }, { status: 500 })
  }
}
