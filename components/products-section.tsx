import { Button } from "@/components/ui/button"
import { ProductList } from "@/components/product-list"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ProductsSection() {
  return (
    <section id="products" className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Our Most Popular Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover our wide range of premium sticker and vinyl solutions for every need
          </p>
        </div>

        <ProductList showAll={false} />

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              View All Products / Ona Bidhaa Zote
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
