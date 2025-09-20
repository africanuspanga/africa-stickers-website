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
                Back
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
              Product Details
            </TabsTrigger>
            <TabsTrigger value="parameters" className="text-sm">
              Specifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">About This Product</h3>
              {product.slug === "color-vinyl-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika za Vinyl zenye ubora wa juu, zinazotumika sana kwa kukata na mashine za plotter.
                      Zinashikamana vizuri kwenye kioo, chuma, mbao au plastiki, na hufaa kwa mabango, mapambo ya
                      magari, mabao ya matangazo na miradi ya mapambo ya ndani na nje. Zina mwonekano wa kitaalamu na
                      hudumu muda mrefu hata kwenye mazingira magumu.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Premium-quality vinyl stickers designed for plotter cutting. They adhere perfectly to glass,
                      metal, wood, or plastic, making them ideal for signage, vehicle graphics, advertising boards, and
                      both indoor and outdoor decorative projects. They provide a professional finish and long-lasting
                      performance even under harsh conditions.
                    </p>
                  </div>
                </div>
              ) : product.slug === "frosted-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika za Frosted kwa mapambo ya madirisha, ofisi na mabango. Hutoa faragha bila kupoteza mwanga na
                      huongeza mwonekano wa kisasa. Zinastahimili mionzi ya jua na ni rahisi kusafishwa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Frosted stickers designed for windows, offices, and decorative signage. They provide privacy
                      without blocking light and add a modern, stylish appearance. UV-resistant and easy to clean for
                      long-lasting performance.
                    </p>
                  </div>
                </div>
              ) : product.slug === "3m-reflective-tapes" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Tepe za 3M zenye mwonekano mkali wa kung'aa, bora kwa usalama wa magari, ghala na vifaa vya
                      viwandani. Zinasaidia kuongeza mwonekano wa usiku na kupunguza hatari za ajali. Rahisi kutumia na
                      hudumu muda mrefu bila kupoteza kung'aa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      3M reflective tapes with intense brightness, perfect for vehicle safety, warehouses, and
                      industrial equipment. They improve nighttime visibility, enhance safety, and are easy to apply,
                      offering long-lasting reflectivity.
                    </p>
                  </div>
                </div>
              ) : product.slug === "wood-marble-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Karatasi za mbao au marumaru zinazotoa mwonekano wa asili kwa mapambo ya milango, meza, kuta na
                      samani. Zinaongeza mvuto wa kisasa bila gharama kubwa za kutumia mbao halisi au marumaru. Ni
                      rahisi kubandika na sugu kwa maji.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Wood grain and marble sheets that replicate the natural look of wood or stone for doors, tables,
                      walls, and furniture. They enhance décor with a modern aesthetic at a fraction of the cost of real
                      materials. Easy to apply and water-resistant.
                    </p>
                  </div>
                </div>
              ) : product.slug === "t-shirt-heat-transfer-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika za kubandika kwenye fulana kwa kutumia mashine za joto, bora kwa kutengeneza nembo, ubunifu
                      wa mavazi na matangazo. Hutoa rangi ang'avu na hudumu hata baada ya kufuliwa mara nyingi.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Heat transfer stickers for T-shirts, perfect for creating logos, custom apparel designs, and
                      promotional graphics. They deliver vibrant colors and remain durable even after multiple washes.
                    </p>
                  </div>
                </div>
              ) : product.slug === "tinted-film" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Filamu za Tinted zinazotumika kwenye madirisha ya magari na majengo. Hupunguza mwanga mkali, joto
                      na mionzi ya UV, na kuboresha faragha na mwonekano wa kisasa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Tinted films for car and building windows. They reduce glare, heat, and harmful UV rays while
                      enhancing privacy and giving a sleek, modern look.
                    </p>
                  </div>
                </div>
              ) : product.slug === "self-adhesive-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika za Self-Adhesive zenye ubora wa hali ya juu, Zinafaa kwa mabango, matangazo, na mapambo ya
                      magari. Zinaweza kuchapishwa (printable) kwa picha au maandiko na zinapatikana katika gramu mbili
                      tofauti: 140g na 120g, kwa matumizi ya ndani na nje.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      High-quality self-adhesive stickers, Ideal for signage, advertising, and vehicle decoration. They
                      are printable for custom graphics or text and available in two thickness options: 140g and 120g,
                      suitable for indoor and outdoor use.
                    </p>
                  </div>
                </div>
              ) : product.slug === "sticker-tools" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Vifaa muhimu vya sticker kwa usakinishaji na utunzaji bora. Vinajumuisha heat gun, squeegee,
                      cutter na vifaa vya kupima. Husaidia kuhakikisha mabandika ni safi, sahihi na hudumu muda mrefu
                      bila mabaki au makunyanzi.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Essential sticker tools for proper installation and maintenance. Includes heat guns, squeegees,
                      cutters, and measuring tools. Ensures clean, precise applications and long-lasting results without
                      bubbles, wrinkles, or residue.
                    </p>
                  </div>
                </div>
              ) : product.slug === "reflective-sheeting" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Reflective sheeting za kung'aa zinazotumika kwa alama za barabarani, miradi ya usalama na mapambo
                      ya magari. Zipo aina laini na ngumu, zinazofaa kwa mazingira ya ndani na nje. Zimeundwa
                      kustahimili hali mbaya za hewa na kutoa mwonekano bora hata usiku au kwenye mwanga hafifu.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      High-visibility reflective sheeting used for road signs, safety projects, and vehicle decoration.
                      Available in both soft and hard types, suitable for indoor and outdoor environments. Engineered to
                      withstand tough weather conditions while maintaining excellent brightness during nighttime or
                      low-light conditions.
                    </p>
                  </div>
                </div>
              ) : product.slug === "headlight-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika za Headlight maalum kwa kufunika taa za magari kwa mapambo au ulinzi. Zinapunguza mikwaruzo,
                      hutoa mwonekano wa kisasa na hulinda dhidi ya vumbi na mionzi ya UV bila kupunguza mwanga mwingi
                      wa taa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Headlight stickers specially designed for vehicle lights, offering decoration and protection. They
                      prevent scratches, enhance modern styling, and guard against dust and UV rays without
                      significantly reducing headlight brightness.
                    </p>
                  </div>
                </div>
              ) : product.slug === "egp-reflective-sheeting" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      EGP reflective sheeting zenye kung'aa sana kwa alama za barabarani na miradi ya usalama. Zinatoa
                      mwonekano bora hata kwenye umbali mrefu na mazingira magumu.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      EGP reflective sheeting with superior brightness for traffic signs and safety projects. They
                      ensure excellent visibility even from long distances and in challenging weather.
                    </p>
                  </div>
                </div>
              ) : product.slug === "self-adhesive-vinyl" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika za Self-Adhesive zenye ubora wa hali ya juu, Zinafaa kwa mabango, matangazo, na mapambo ya
                      magari. Zinaweza kuchapishwa (printable) kwa picha au maandiko na zinapatikana katika gramu mbili
                      tofauti: 140g na 120g, kwa matumizi ya ndani na nje.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      High-quality self-adhesive stickers, Ideal for signage, advertising, and vehicle decoration. They
                      are printable for custom graphics or text and available in two thickness options: 140g and 120g,
                      suitable for indoor and outdoor use.
                    </p>
                  </div>
                </div>
              ) : product.slug === "tinted-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Filamu za Tinted zinazotumika kwenye madirisha ya magari na majengo. Hupunguza mwanga mkali, joto
                      na mionzi ya UV, na kuboresha faragha na mwonekano wa kisasa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Tinted films for car and building windows. They reduce glare, heat, and harmful UV rays while
                      enhancing privacy and giving a sleek, modern look.
                    </p>
                  </div>
                </div>
              ) : product.slug === "frost-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika za Frosted kwa mapambo ya madirisha, ofisi na mabango. Hutoa faragha bila kupoteza mwanga na
                      huongeza mwonekano wa kisasa. Zinastahimili mionzi ya jua na ni rahisi kusafishwa.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Frosted stickers designed for windows, offices, and decorative signage. They provide privacy
                      without blocking light and add a modern, stylish appearance. UV-resistant and easy to clean for
                      long-lasting performance.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    High-quality {product.name.toLowerCase()} perfect for professional applications. Manufactured with
                    premium materials for durability and excellent adhesion.
                  </p>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-4">
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="font-semibold text-lg mb-4">Specifications</h3>
              {product.slug === "color-vinyl-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.2 × 50 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="font-medium">Glossy or Matte</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Durability:</span>
                    <span className="font-medium">3-5 Years Outdoor Use</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Adhesive:</span>
                    <span className="font-medium">Strong, Weather-resistant</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">Glass, Metal, Wood, Plastic</span>
                  </div>
                </div>
              ) : product.slug === "frosted-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22 × 50 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="font-medium">Semi-transparent Frosted Effect</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Features:</span>
                    <span className="font-medium">UV-resistant and Easy Maintenance</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">Windows, Office Glass, Signage</span>
                  </div>
                </div>
              ) : product.slug === "3m-reflective-tapes" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Width:</span>
                    <span className="font-medium">5 cm or 10 cm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Durability:</span>
                    <span className="font-medium">Long-lasting Reflectivity</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Adhesion:</span>
                    <span className="font-medium">Strong and Weatherproof</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Use:</span>
                    <span className="font-medium">Vehicles, Warehouses, Industrial Tools</span>
                  </div>
                </div>
              ) : product.slug === "wood-marble-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22 × 50 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">Self-adhesive Vinyl</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="font-medium">Realistic Wood or Marble Patterns</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Features:</span>
                    <span className="font-medium">Water-resistant and Durable</span>
                  </div>
                </div>
              ) : product.slug === "t-shirt-heat-transfer-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">50 cm × 25 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Fabric Compatibility:</span>
                    <span className="font-medium">Cotton and Polyester</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Wash Resistance:</span>
                    <span className="font-medium">Long-lasting Prints</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Colors:</span>
                    <span className="font-medium">Vibrant and Fade-resistant</span>
                  </div>
                </div>
              ) : product.slug === "tinted-film" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Width:</span>
                    <span className="font-medium">1.52cm / 75cm / 50cm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">UV/IR Protection:</span>
                    <span className="font-medium">Blocks Heat and Rays</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Shades:</span>
                    <span className="font-medium">Multiple Darkness Levels Available</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Features:</span>
                    <span className="font-medium">Scratch-resistant Coating</span>
                  </div>
                </div>
              ) : product.slug === "self-adhesive-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22 × 50 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Adhesion:</span>
                    <span className="font-medium">Strong, Pressure-sensitive</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Printable Surface:</span>
                    <span className="font-medium">Yes (for Custom Graphics)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Weight Options:</span>
                    <span className="font-medium">140g and 120g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="font-medium">Glossy, Matte, or Patterned</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-medium">Signage, Advertising, Vehicles</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Durability:</span>
                    <span className="font-medium">Weather-resistant for Long-term Use</span>
                  </div>
                </div>
              ) : product.slug === "sticker-tools" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Types:</span>
                    <span className="font-medium">Heat Gun, Squeegee, Cutter, Measuring Tape</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Use:</span>
                    <span className="font-medium">Sticker Installation and Finishing</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Quality:</span>
                    <span className="font-medium">Durable, Professional-grade Tools</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Benefits:</span>
                    <span className="font-medium">Smooth Application, Reduced Waste</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Ideal for:</span>
                    <span className="font-medium">Cars, Furniture, Signage Projects</span>
                  </div>
                </div>
              ) : product.slug === "reflective-sheeting" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22 × 45 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Types:</span>
                    <span className="font-medium">Soft & Hard</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Visibility:</span>
                    <span className="font-medium">Day and Night, High Brightness</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Weather Resistance:</span>
                    <span className="font-medium">UV and Water-resistant</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-medium">Traffic Signs, Safety Markings, Vehicles</span>
                  </div>
                </div>
              ) : product.slug === "headlight-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">30cm × 8m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">Flexible, UV-resistant Vinyl</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="font-medium">Clear, Smoked, or Tinted</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Protection:</span>
                    <span className="font-medium">Scratch and Dust-resistant</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">Car and Motorcycle Headlights</span>
                  </div>
                </div>
              ) : product.slug === "egp-reflective-sheeting" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22 × 45 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Brightness:</span>
                    <span className="font-medium">Enhanced Reflectivity</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Weather Resistance:</span>
                    <span className="font-medium">Durable Under Harsh Conditions</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">Traffic and Safety Markings</span>
                  </div>
                </div>
              ) : product.slug === "self-adhesive-vinyl" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22 × 50 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Adhesion:</span>
                    <span className="font-medium">Strong, Pressure-sensitive</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Printable Surface:</span>
                    <span className="font-medium">Yes (for Custom Graphics)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Weight Options:</span>
                    <span className="font-medium">140g and 120g</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="font-medium">Glossy, Matte, or Patterned</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-medium">Signage, Advertising, Vehicles</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Durability:</span>
                    <span className="font-medium">Weather-resistant for Long-term Use</span>
                  </div>
                </div>
              ) : product.slug === "tinted-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Width:</span>
                    <span className="font-medium">1.52cm / 75cm / 50cm</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">UV/IR Protection:</span>
                    <span className="font-medium">Blocks Heat and Rays</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Shades:</span>
                    <span className="font-medium">Multiple Darkness Levels Available</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Features:</span>
                    <span className="font-medium">Scratch-resistant Coating</span>
                  </div>
                </div>
              ) : product.slug === "frost-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22 × 50 m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish:</span>
                    <span className="font-medium">Semi-transparent Frosted Effect</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Features:</span>
                    <span className="font-medium">UV-resistant and Easy Maintenance</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">Windows, Office Glass, Signage</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">Premium Vinyl</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Durability:</span>
                    <span className="font-medium">5-7 Years</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">Indoor & Outdoor</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Variants Grid */}
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-4">Available Variants</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
          <h3 className="font-bold text-xl text-black mb-2">Ready to Order?</h3>
          <p className="text-black/80 mb-4">Contact us for pricing and custom orders</p>
          <Link href="https://wa.me/255123456789" target="_blank">
            <Button size="lg" className="bg-black text-white hover:bg-black/90">
              GET QUOTE
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
