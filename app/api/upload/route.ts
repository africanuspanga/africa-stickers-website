import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Upload API called")

    const headers = {
      "Content-Type": "application/json",
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400, headers })
    }

    console.log("[v0] File details:", { name: file.name, size: file.size, type: file.type })

    // Validate file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400, headers })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400, headers })
    }

    // Check environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME

    if (!cloudName) {
      return NextResponse.json({ error: "Upload service not configured" }, { status: 500, headers })
    }

    console.log("[v0] Using cloud name:", cloudName)

    try {
      const uploadData = new FormData()
      uploadData.append("file", file)
      uploadData.append("upload_preset", "africa_stickers") // You can change this to your preset name
      uploadData.append("folder", "africa-stickers")

      console.log("[v0] Uploading to Cloudinary with unsigned request...")

      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadData,
      })

      const responseText = await cloudinaryResponse.text()
      console.log("[v0] Cloudinary response:", responseText)

      if (!cloudinaryResponse.ok) {
        console.error("[v0] Upload failed:", responseText)
        return NextResponse.json({ error: `Upload failed: ${responseText}` }, { status: 400, headers })
      }

      const result = JSON.parse(responseText)
      console.log("[v0] Upload successful:", result.public_id)

      return NextResponse.json(
        {
          success: true,
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
        },
        { headers },
      )
    } catch (uploadError) {
      console.error("[v0] Upload process error:", uploadError)
      return NextResponse.json(
        {
          error: `Upload process failed: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
        },
        { status: 500, headers },
      )
    }
  } catch (error) {
    console.error("[v0] Top-level API error:", error)

    return new Response(
      JSON.stringify({
        error: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
