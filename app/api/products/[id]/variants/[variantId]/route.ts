import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// PATCH update a variant
export async function PATCH(request: Request, { params }: { params: { id: string; variantId: string } }) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { variant_name, variant_name_sw, quantity, image_url, display_order } = body

    const updateData: any = {}
    if (variant_name !== undefined) updateData.variant_name = variant_name
    if (variant_name_sw !== undefined) updateData.variant_name_sw = variant_name_sw
    if (quantity !== undefined) updateData.quantity = quantity
    if (image_url !== undefined) updateData.image_url = image_url
    if (display_order !== undefined) updateData.display_order = display_order

    const { data: variant, error } = await supabase
      .from("product_variants")
      .update(updateData)
      .eq("id", params.variantId)
      .eq("product_id", params.id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating variant:", error)
      return NextResponse.json({ error: "Failed to update variant" }, { status: 500 })
    }

    return NextResponse.json(variant)
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE a variant
export async function DELETE(request: Request, { params }: { params: { id: string; variantId: string } }) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection not configured" }, { status: 500 })
    }

    const { error } = await supabase
      .from("product_variants")
      .delete()
      .eq("id", params.variantId)
      .eq("product_id", params.id)

    if (error) {
      console.error("[v0] Error deleting variant:", error)
      return NextResponse.json({ error: "Failed to delete variant" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
