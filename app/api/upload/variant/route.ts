import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const productSlug = formData.get("productSlug") as string
    const variantId = formData.get("variantId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!productSlug || !variantId) {
      return NextResponse.json({ error: "Product slug and variant ID are required" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64File = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64File}`

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`

    const uploadData = new FormData()
    uploadData.append("file", dataURI)
    uploadData.append("upload_preset", "africa_stickers")
    uploadData.append("folder", `africa-stickers/variants/${productSlug}`)
    uploadData.append("public_id", variantId)

    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: uploadData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Cloudinary upload failed:", errorText)
      return NextResponse.json({ error: "Upload to Cloudinary failed" }, { status: 500 })
    }

    const result = await response.json()

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
