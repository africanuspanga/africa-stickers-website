import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = (formData.get("folder") as string) || "africa-stickers/products/main-images"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Basic file validation
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    // Get Cloudinary config
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    // Generate upload parameters
    const timestamp = Math.round(Date.now() / 1000)
    const publicId = `${timestamp}_${crypto.randomBytes(8).toString("hex")}`

    // Create signature
    const paramsToSign = {
      folder: folder,
      public_id: publicId,
      timestamp: timestamp,
    }

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
      .join("&")

    const signature = crypto
      .createHash("sha1")
      .update(sortedParams + apiSecret)
      .digest("hex")

    const uploadData = new FormData()
    uploadData.append("file", dataURI)
    uploadData.append("folder", folder)
    uploadData.append("public_id", publicId)
    uploadData.append("timestamp", timestamp.toString())
    uploadData.append("api_key", apiKey)
    uploadData.append("signature", signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Upload failed: ${errorText}` }, { status: 500 })
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
