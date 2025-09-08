import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function ProductsSection() {
  const products = [
    {
      title: "VINYL STICKERS",
      description: "High-quality vinyl stickers for any purpose",
      image: "/images/vinyl-main.png",
      link: "/products/vinyl-stickers",
    },
    {
      title: "FROSTED & STICKER ZA MBAO",
      description: "Frosted glass effects and wooden surface stickers",
      image: "/images/products-front.jpg",
      link: "/products/sticker-za-mbao",
    },
    {
      title: "REFLECTIVE SHEETING",
      description: "Safety reflective sheeting for roads and vehicles",
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
    },
    {
      title: "STICKERS ZA TAA",
      description: "Specialized stickers for lights and illumination",
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
    },
    {
      title: "3M REFLACTIVE TAPES",
      description: "Premium 3M reflective tapes for safety applications",
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
    },
    {
      title: "TINTED AINA MBALIMBALI",
      description: "Various types of window tinting films and materials",
      image: "/placeholder.svg?height=300&width=400",
      link: "#",
    },
  ]

  return (
    <section id="products" className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explore Our Most Popular Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover our wide range of premium sticker and vinyl solutions for every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50"
            >
              <CardContent className="p-0">
                <Link href={product.link} className={product.link === "#" ? "pointer-events-none" : ""}>
                  <div className="aspect-[4/3] bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 text-pretty">{product.description}</p>
                    <div className="flex items-center text-primary group-hover:text-primary/80 transition-colors">
                      <span className="text-sm font-semibold">
                        {product.link === "#" ? "Coming Soon" : "Learn More"}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
