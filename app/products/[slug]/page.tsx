import { notFound } from "next/navigation"
import { ArrowLeft, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { products } from "@/lib/products"
import type { Metadata } from "next"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug)

  if (!product) {
    return {
      title: "Product Not Found - Africa Stickers",
      description: "The requested product could not be found.",
    }
  }

  return {
    title: `${product.name} - Africa Stickers`,
    description: `${product.description}. Professional sticker printing, vinyl cutting, na custom graphics kwa bei nafuu.`,
    keywords: `${product.name}, stickers, vinyl, Africa Stickers, ${product.category}`,
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back / Rudi
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-yellow-600">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Image Carousel */}
      <div className="relative h-80 bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
        <div className="w-32 h-32 bg-black/20 rounded-lg flex items-center justify-center">
          <div className="w-16 h-16 bg-black/30 rounded"></div>
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>

      {/* Product Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-yellow-600">
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details" className="text-sm">
              Product Details / Kuhusu Bidhaa Hii
            </TabsTrigger>
            <TabsTrigger value="parameters" className="text-sm">
              Product Parameters / Vipimo vya Bidhaa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">About This Product / Kuhusu Bidhaa Hii</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
              <p className="text-muted-foreground leading-relaxed">
                High-quality {product.name.toLowerCase()} perfect for professional applications. Manufactured with
                premium materials for durability and excellent adhesion.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Specifications / Vipimo</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Category / Aina:</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Material / Nyenzo:</span>
                  <span className="font-medium">Premium Vinyl</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Durability / Uimara:</span>
                  <span className="font-medium">5-7 Years</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Application / Matumizi:</span>
                  <span className="font-medium">Indoor & Outdoor</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Variants Grid */}
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Available Variants / Aina Zinazopatikana</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((variant) => (
              <div
                key={variant}
                className="aspect-square bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-black/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-center">
          <h3 className="font-bold text-xl text-black mb-2">Ready to Order? / Tayari Kuagiza?</h3>
          <p className="text-black/80 mb-4">Contact us for pricing and custom orders</p>
          <Link href="https://wa.me/255123456789" target="_blank">
            <Button size="lg" className="bg-black text-white hover:bg-black/90">
              PATA BEI
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }))
}
