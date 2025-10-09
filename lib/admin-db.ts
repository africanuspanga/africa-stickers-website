import { supabase } from "./supabase"
import type { Product, ProductVariant } from "./products-db"

export interface AdminProduct extends Product {
  price?: number
  stock_quantity?: number
  is_active?: boolean
  meta_title?: string
  meta_description?: string
}

export interface AdminProductVariant extends ProductVariant {
  price?: number
  stock_quantity?: number
  is_active?: boolean
}

export interface ImageUpload {
  id: number
  public_id: string
  secure_url: string
  original_filename?: string
  file_size?: number
  width?: number
  height?: number
  format?: string
  resource_type?: string
  folder?: string
  created_at: string
}

// Admin-specific product operations
export async function getAllProductsAdmin(): Promise<AdminProduct[]> {
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
    .order("product_id, id")

  if (variantsError) {
    console.error("[v0] Error fetching variants:", variantsError)
    throw variantsError
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
      {} as Record<number, AdminProductVariant[]>,
    ) || {}

  // Attach variants to products
  const productsWithVariants =
    products?.map((product) => ({
      ...product,
      variants: variantsByProduct[product.id] || [],
    })) || []

  return productsWithVariants
}

export async function updateProduct(id: number, updates: Partial<AdminProduct>): Promise<AdminProduct> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating product:", error)
    throw error
  }

  return data
}

export async function deleteProduct(id: number): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    throw error
  }
}

export async function createProductAdmin(
  product: Omit<AdminProduct, "id" | "created_at" | "updated_at">,
): Promise<AdminProduct> {
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

// Variant management
export async function createVariant(
  variant: Omit<AdminProductVariant, "id" | "created_at" | "updated_at">,
): Promise<AdminProductVariant> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { data, error } = await supabase.from("product_variants").insert([variant]).select().single()

  if (error) {
    console.error("[v0] Error creating variant:", error)
    throw error
  }

  return data
}

export async function updateVariant(id: number, updates: Partial<AdminProductVariant>): Promise<AdminProductVariant> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { data, error } = await supabase
    .from("product_variants")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating variant:", error)
    throw error
  }

  return data
}

export async function deleteVariant(id: number): Promise<void> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { error } = await supabase.from("product_variants").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting variant:", error)
    throw error
  }
}

// Image management
export async function saveImageUpload(imageData: Omit<ImageUpload, "id" | "created_at">): Promise<ImageUpload> {
  if (!supabase) {
    throw new Error("Supabase client not available. Please check environment variables.")
  }

  const { data, error } = await supabase.from("image_uploads").insert([imageData]).select().single()

  if (error) {
    console.error("[v0] Error saving image upload:", error)
    throw error
  }

  return data
}

export async function getImageUploads(): Promise<ImageUpload[]> {
  if (!supabase) {
    console.warn("[v0] Supabase client not available. Please check environment variables.")
    return []
  }

  const { data, error } = await supabase.from("image_uploads").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching image uploads:", error)
    throw error
  }

  return data || []
}

// Dashboard statistics
export async function getDashboardStats() {
  if (!supabase) {
    console.warn("[v0] Supabase client not available. Please check environment variables.")
    return {
      totalProducts: 0,
      activeProducts: 0,
      totalVariants: 0,
      totalImages: 0,
      categories: [],
    }
  }

  const [productsResult, variantsResult, imagesResult] = await Promise.all([
    supabase.from("products").select("id, is_active, category"),
    supabase.from("product_variants").select("id"),
    supabase.from("image_uploads").select("id"),
  ])

  const products = productsResult.data || []
  const variants = variantsResult.data || []
  const images = imagesResult.data || []

  // Count categories
  const categoryMap = new Map<string, number>()
  products.forEach((product) => {
    const count = categoryMap.get(product.category) || 0
    categoryMap.set(product.category, count + 1)
  })

  return {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalVariants: variants.length,
    totalImages: images.length,
    categories: Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count })),
  }
}
