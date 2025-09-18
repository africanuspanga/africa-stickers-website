export interface ProductVariant {
  id: string
  name: string
  imageUrl: string | null // Will be populated from Cloudinary
  code: string
  specifications?: Record<string, string>
}

export interface Product {
  id: number
  name: string
  description: string
  category: string
  slug: string
  imageUrl: string | null // Main product image from Cloudinary
  variants: ProductVariant[]
  specifications: Record<string, string>
  featured: boolean
  createdAt?: Date
  updatedAt?: Date
}

// This will be replaced by API calls to admin backend
export const productCategories = [
  { id: "vinyl", name: "Vinyl Stickers", nameSwahili: "Stika za Vinyl" },
  { id: "wrapping", name: "Wrapping Materials", nameSwahili: "Vifaa vya Kufunika" },
  { id: "reflective", name: "Reflective Materials", nameSwahili: "Vifaa vya Mwanga" },
  { id: "decorative", name: "Decorative Stickers", nameSwahili: "Stika za Mapambo" },
  { id: "automotive", name: "Automotive Stickers", nameSwahili: "Stika za Magari" },
  { id: "transfer", name: "Heat Transfer", nameSwahili: "Kuhamisha kwa Joto" },
  { id: "custom", name: "Custom Solutions", nameSwahili: "Suluhisho Maalum" },
  { id: "tools", name: "Tools & Equipment", nameSwahili: "Vifaa na Mashine" },
]
