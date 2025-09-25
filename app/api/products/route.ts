import { NextResponse } from "next/server"
import { getAllProducts } from "@/lib/products-db"

export async function GET() {
  try {
    const products = await getAllProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("[v0] API Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
