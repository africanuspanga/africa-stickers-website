import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

function randomLikes() {
  return Math.floor(Math.random() * 16) + 10
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection not configured" }, { status: 500 })
    }

    const productId = Number.parseInt(params.id, 10)
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    const { data: existing, error: fetchError } = await supabase
      .from("products")
      .select("likes_count")
      .eq("id", productId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching likes:", fetchError)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const nextLikes = (typeof existing.likes_count === "number" ? existing.likes_count : randomLikes()) + 1

    const { data: updated, error: updateError } = await supabase
      .from("products")
      .update({
        likes_count: nextLikes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .select("id, likes_count")
      .single()

    if (updateError) {
      console.error("[v0] Error updating likes:", updateError)
      return NextResponse.json({ error: "Failed to update likes" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      product_id: updated.id,
      likes_count: updated.likes_count,
    })
  } catch (error) {
    console.error("[v0] Like API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
