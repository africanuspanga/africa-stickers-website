import { type NextRequest, NextResponse } from "next/server"
import { validateImageFile, type CloudinaryFolder } from "@/lib/cloudinary"

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

    // Get environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("[v0] Missing Cloudinary environment variables")
      return NextResponse.json({ error: "Cloudinary configuration missing" }, { status: 500 })
    }

    // Convert file to base64 for upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    const timestamp = Math.round(Date.now() / 1000)
    let publicId = `${folder}/${timestamp}_${file.name.replace(/\.[^/.]+$/, "")}`

    // Add product/variant specific naming
    if (productId) {
      publicId = variantId
        ? `${folder}/${productId}_variant_${variantId}_${timestamp}`
        : `${folder}/${productId}_main_${timestamp}`
    }

    // Create signature for authentication
    const crypto = require("crypto")
    const paramsToSign = {
      folder: folder,
      public_id: publicId,
      timestamp: timestamp,
    }

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&")

    const signature = crypto
      .createHash("sha1")
      .update(sortedParams + apiSecret)
      .digest("hex")

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

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text()
      console.error("[v0] Cloudinary upload error:", error)
      return NextResponse.json({ error: "Failed to upload image to Cloudinary" }, { status: 500 })
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
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 })
  }
}
