import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { ProductsSection } from "@/components/products-section"
import { WholesaleSection } from "@/components/wholesale-section"

export const metadata: Metadata = {
  title: "Products - Africa Stickers | Vinyl Stickers, Reflective Materials & More",
  description:
    "Explore our comprehensive range of vinyl stickers, reflective sheeting, frosted materials, and custom printing solutions in Tanzania.",
  keywords: "vinyl stickers, reflective materials, frosted stickers, custom printing, tanzania products",
  openGraph: {
    title: "Products - Africa Stickers | Vinyl & Printing Solutions",
    description:
      "Explore our comprehensive range of vinyl stickers, reflective sheeting, and custom printing solutions",
    type: "website",
  },
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Our Products</h1>
          <p className="text-xl text-white/90">
            Explore our comprehensive range of stickers, vinyl, and printing solutions
          </p>
          <div className="mt-12">
            <img
              src="/images/vinyl-storage-main.png"
              alt="Vinyl Sticker Storage - Various Colors and Materials"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Products Content */}
      <ProductsSection />
      <WholesaleSection />

      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
