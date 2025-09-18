import { type NextRequest, NextResponse } from "next/server"
import { getCloudinaryConfig } from "@/lib/cloudinary"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get("folder")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const config = getCloudinaryConfig()

    // Build Cloudinary Admin API URL
    const adminApiUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/resources/image`
    const params = new URLSearchParams({
      type: "upload",
      max_results: limit.toString(),
    })

    if (folder) {
      params.append("prefix", folder)
    }

    const response = await fetch(`${adminApiUrl}?${params}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch images from Cloudinary")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      images: data.resources,
      total: data.total_count,
    })
  } catch (error) {
    console.error("[v0] Images API error:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json()

    if (!public_id) {
      return NextResponse.json({ error: "Public ID is required" }, { status: 400 })
    }

    const config = getCloudinaryConfig()

    const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/destroy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString("base64")}`,
      },
      body: JSON.stringify({ public_id }),
    })

    const result = await response.json()

    if (result.result === "ok") {
      return NextResponse.json({ success: true, message: "Image deleted successfully" })
    } else {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Delete image API error:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
