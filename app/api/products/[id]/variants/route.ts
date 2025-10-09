import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

// GET all variants for a product
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection not configured" }, { status: 500 })
    }

    const { data: variants, error } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", params.id)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching variants:", error)
      return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 })
    }

    return NextResponse.json(variants || [])
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create a new variant
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database connection not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { variant_name, variant_name_sw, quantity, image_url, display_order } = body

    const { data: variant, error } = await supabase
      .from("product_variants")
      .insert({
        product_id: params.id,
        variant_name: variant_name || `Variant ${Date.now()}`,
        variant_name_sw: variant_name_sw || null,
        quantity: quantity || 0,
        image_url: image_url || null,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating variant:", error)
      return NextResponse.json({ error: "Failed to create variant" }, { status: 500 })
    }

    return NextResponse.json(variant, { status: 201 })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
