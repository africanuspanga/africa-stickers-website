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
  likes_count?: number
  price?: number | null
  stock_quantity?: number | null
  is_active?: boolean
  meta_title?: string | null
  meta_description?: string | null
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
  price?: number | null
  stock_quantity?: number | null
  is_active?: boolean
  created_at: string
  updated_at: string
}

export interface CreateProductInput {
  name: string
  description: string
  category: string
  slug: string
  image_url?: string | null
  preview_image_url?: string | null
  featured?: boolean
  likes_count?: number
  specifications?: Record<string, any>
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
    .order("product_id", { ascending: true })
    .order("display_order", { ascending: true })
    .order("id", { ascending: true })

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
    .eq("product_id", productId)

  if (error) {
    console.error("[v0] Error updating variant image:", error)
    throw error
  }
}

export async function createProduct(product: CreateProductInput): Promise<Product> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const payload: Record<string, any> = {
    name: product.name,
    description: product.description,
    category: product.category,
    slug: product.slug,
    image_url: product.image_url ?? null,
    preview_image_url: product.preview_image_url ?? null,
    featured: product.featured ?? false,
    specifications: product.specifications ?? {},
  }

  if (product.likes_count !== undefined) {
    payload.likes_count = product.likes_count
  }

  const { data, error } = await supabase.from("products").insert([payload]).select().single()

  if (error) {
    console.error("[v0] Error creating product:", error)
    throw error
  }

  return data
}

export async function updateProductDetails(productId: number, updates: Partial<CreateProductInput>): Promise<Product> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.name !== undefined) payload.name = updates.name
  if (updates.description !== undefined) payload.description = updates.description
  if (updates.category !== undefined) payload.category = updates.category
  if (updates.slug !== undefined) payload.slug = updates.slug
  if (updates.image_url !== undefined) payload.image_url = updates.image_url
  if (updates.preview_image_url !== undefined) payload.preview_image_url = updates.preview_image_url
  if (updates.featured !== undefined) payload.featured = updates.featured
  if (updates.likes_count !== undefined) payload.likes_count = updates.likes_count
  if (updates.specifications !== undefined) payload.specifications = updates.specifications

  const { data, error } = await supabase.from("products").update(payload).eq("id", productId).select().single()

  if (error) {
    console.error("[v0] Error updating product details:", error)
    throw error
  }

  return data
}

export async function createProductVariant(
  productId: number,
  input: Partial<Pick<ProductVariant, "variant_name" | "variant_name_sw" | "quantity" | "display_order" | "image_url">>,
): Promise<ProductVariant> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const payload = {
    product_id: productId,
    variant_name: input.variant_name || `Variant ${Date.now()}`,
    variant_name_sw: input.variant_name_sw || null,
    quantity: input.quantity ?? 0,
    display_order: input.display_order ?? 0,
    image_url: input.image_url || null,
  }

  const { data, error } = await supabase.from("product_variants").insert([payload]).select().single()

  if (error) {
    console.error("[v0] Error creating product variant:", error)
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
