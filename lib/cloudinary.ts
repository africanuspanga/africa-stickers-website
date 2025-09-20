export interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  folder?: string
}

export interface CloudinaryError {
  message: string
  http_code: number
}

// Cloudinary folder structure for organized image storage
export const CLOUDINARY_FOLDERS = {
  HOMEPAGE: "africa-stickers/homepage",
  HOMEPAGE_HERO: "africa-stickers/homepage/hero",
  HOMEPAGE_FEATURES: "africa-stickers/homepage/features",
  HOMEPAGE_TESTIMONIALS: "africa-stickers/homepage/testimonials",
  PRODUCTS: "africa-stickers/products",
  PRODUCTS_MAIN: "africa-stickers/products/main-images",
  PRODUCTS_VARIANTS: "africa-stickers/products/variants",
  GENERAL: "africa-stickers/general",
} as const

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS]

// Helper function to get Cloudinary configuration from environment variables
export function getCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary configuration. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.",
    )
  }

  return { cloudName, apiKey, apiSecret }
}

// Helper function to generate Cloudinary upload signature
export function generateCloudinarySignature(params: Record<string, string | number>, apiSecret: string): string {
  const crypto = require("crypto")

  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&")

  // Generate SHA1 hash signature
  return crypto
    .createHash("sha1")
    .update(sortedParams + apiSecret)
    .digest("hex")
}

// Helper function to build Cloudinary URL with transformations
export function buildCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: "fill" | "fit" | "scale" | "crop"
    quality?: "auto" | number
    format?: "auto" | "webp" | "jpg" | "png"
  } = {},
): string {
  const config = getCloudinaryConfig()
  const baseUrl = `https://res.cloudinary.com/${config.cloudName}/image/upload`

  const transformations = []

  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  if (options.quality) transformations.push(`q_${options.quality}`)
  if (options.format) transformations.push(`f_${options.format}`)

  const transformationString = transformations.length > 0 ? `${transformations.join(",")}/` : ""

  return `${baseUrl}/${transformationString}${publicId}`
}

// Helper function to extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)
  return match ? match[1] : null
}

// Helper function to validate image file
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.",
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size too large. Please upload images smaller than 10MB.",
    }
  }

  return { valid: true }
}
