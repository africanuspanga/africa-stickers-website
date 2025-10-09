import { supabase } from "./supabase"

export interface Product {
  id: number
  name: string
  description: string
  category: string
  slug: string
  image_url: string | null
  preview_image_url: string | null
  featured: boolean
  specifications: Record<string, any>
  created_at: string
  updated_at: string
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: number
  product_id: number
  variant_name: string
  variant_name_sw: string | null
  quantity: number
  image_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export async function getAllProducts(): Promise<Product[]> {
  if (!supabase) {
    console.warn("[v0] Supabase client not available. Please check environment variables.")
    return []
  }

  const { data: products, error: productsError } = await supabase.from("products").select("*").order("id")

  if (productsError) {
    console.error("[v0] Error fetching products:", productsError)
    throw productsError
  }

  // Fetch variants for all products
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("*")
    .order("product_id, display_order")

  if (variantsError) {
    console.error("[v0] Error fetching variants:", variantsError)
    // Don't throw, just log the error and continue without variants
  }

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
      {} as Record<number, ProductVariant[]>,
    ) || {}

  // Attach variants to products
  const productsWithVariants =
    products?.map((product) => ({
      ...product,
      variants: variantsByProduct[product.id] || [],
    })) || []

  return productsWithVariants
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) {
    console.warn("[v0] Supabase client not available. Please check environment variables.")
    return null
  }

  const { data: product, error: productError } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (productError) {
    console.error("[v0] Error fetching product:", productError)
    return null
  }

  // Fetch variants for this product
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id)
    .order("display_order")

  if (variantsError) {
    console.error("[v0] Error fetching variants:", variantsError)
  }

  return {
    ...product,
    variants: variants || [],
  }
}

export async function updateProductImage(productId: number, imageUrl: string, isPreview = false): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const updateData = isPreview
    ? { preview_image_url: imageUrl, updated_at: new Date().toISOString() }
    : { image_url: imageUrl, updated_at: new Date().toISOString() }

  const { error } = await supabase.from("products").update(updateData).eq("id", productId)

  if (error) {
    console.error("[v0] Error updating product image:", error)
    throw error
  }
}

export async function updateVariantImage(productId: number, variantId: number, imageUrl: string): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { error } = await supabase
    .from("product_variants")
    .update({
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", variantId)

  if (error) {
    console.error("[v0] Error updating variant image:", error)
    throw error
  }
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { data, error } = await supabase.from("products").insert([product]).select().single()

  if (error) {
    console.error("[v0] Error creating product:", error)
    throw error
  }

  return data
}

export async function getProductCategories(): Promise<Array<{ id: string; name: string; count: number }>> {
  if (!supabase) {
    console.warn("[v0] Supabase client not available. Please check environment variables.")
    return []
  }

  const { data: products, error } = await supabase.from("products").select("category")

  if (error) {
    console.error("[v0] Error fetching product categories:", error)
    throw error
  }

  // Count products by category
  const categoryMap = new Map<string, number>()

  products?.forEach((product) => {
    const count = categoryMap.get(product.category) || 0
    categoryMap.set(product.category, count + 1)
  })

  // Convert to array with proper names
  const categoryNames: Record<string, string> = {
    vinyl: "Vinyl",
    wrapping: "Wrapping",
    reflective: "Reflective",
    decorative: "Decorative",
    automotive: "Automotive",
    transfer: "Transfer",
    custom: "Custom",
    tools: "Tools",
  }

  return Array.from(categoryMap.entries()).map(([id, count]) => ({
    id,
    name: categoryNames[id] || id.charAt(0).toUpperCase() + id.slice(1),
    count,
  }))
}
