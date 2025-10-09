import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      console.error("[v0] Supabase client not available")
      return NextResponse.json({ error: "Database connection not configured" }, { status: 500 })
    }

    console.log("[v0] Fetching products from database...")

    // Fetch products
    const { data: products, error: productsError } = await supabase.from("products").select("*").order("id")

    if (productsError) {
      console.error("[v0] Error fetching products:", productsError)
      throw productsError
    }

    console.log("[v0] Products fetched:", products?.length || 0)

    // Fetch variants for all products
    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("*")
      .order("product_id", { ascending: true })
      .order("id", { ascending: true })

    if (variantsError) {
      console.error("[v0] Error fetching variants:", variantsError)
      throw variantsError
    }

    console.log("[v0] Variants fetched:", variants?.length || 0)

    // Group variants by product_id
    const variantsByProduct =
      variants?.reduce(
        (acc, variant) => {
          if (!acc[variant.product_id]) {
            acc[variant.product_id] = []
          }
          acc[variant.product_id].push(variant)
          return acc
        },
        {} as Record<number, any[]>,
      ) || {}

    // Attach variants to products
    const productsWithVariants =
      products?.map((product) => ({
        ...product,
        variants: variantsByProduct[product.id] || [],
      })) || []

    console.log("[v0] Returning products with variants")
    return NextResponse.json(productsWithVariants)
  } catch (error) {
    console.error("[v0] API Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
