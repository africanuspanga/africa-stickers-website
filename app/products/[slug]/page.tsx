import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { getProductBySlug } from "@/lib/products-db"
import type { Metadata } from "next"
import { ProductLikeButton } from "@/components/product-like-button"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductShareButton } from "@/components/product-share-button"
import { normalizeProductSpecifications } from "@/lib/product-specifications"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export const dynamic = "force-dynamic"
export const revalidate = 0

// Removed getProductImages function as it's no longer needed

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

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

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const productImageUrl = product.image_url
  const dynamicSpecificationItems = normalizeProductSpecifications(product.specifications)
  const hasSwahiliSpecificationItems = dynamicSpecificationItems.some((item) => item.label_sw || item.value_sw)

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
              <ProductShareButton productName={product.name} productSlug={product.slug} />
              <ProductLikeButton
                productId={product.id}
                initialLikes={product.likes_count}
                size="sm"
                className="text-muted-foreground hover:text-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      <ProductImageGallery
        productName={product.name}
        mainImageUrl={productImageUrl}
        previewImageUrl={null}
        variants={product.variants || []}
      />

      {/* Product Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <ProductLikeButton
            productId={product.id}
            initialLikes={product.likes_count}
            size="sm"
            className="text-muted-foreground hover:text-red-600"
          />
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
              ) : product.slug === "wrapping-stickers" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika hizi hutumika kufunika magari na pikipiki kwa mapambo na ulinzi. Hutoa mwonekano mpya bila
                      kupaka rangi upya, hulinda rangi asilia dhidi ya mikwaruzo midogo na mwanga mkali wa jua. Ni njia
                      rahisi na ya kitaalamu kubadilisha muonekano wa gari au pikipiki yako kwa muda mrefu.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      These stickers are used to wrap cars and motorcycles for decoration and protection. They give a
                      fresh look without repainting, protect the original paint from minor scratches and UV rays, and
                      provide a professional and durable makeover for your vehicle.
                    </p>
                  </div>
                </div>
              ) : product.slug === "gold-chrome-mirror" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇹🇿 Kiswahili</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Stika hizi zenye mwonekano wa dhahabu au kioo hukonga macho na kuleta hisia ya kifahari.
                      Zinatumika zaidi katika events (mashughuli za kifahari, harusi, au maonyesho), mapambo ya
                      furniture, na sehemu nyingine maalum kama mabango ya matangazo ya ndani au mapambo ya maduka. Uso
                      wake wenye kutafakari mwanga huleta athari ya kioo halisi na kufanya mapambo yaonekane ya kipekee.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-base mb-2 flex items-center gap-2">🇬🇧 English</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      These gold and chrome mirror-finish stickers add a luxurious and elegant touch. They are mainly
                      used for events (weddings, parties, or exhibitions), decorating furniture, and special areas like
                      indoor signage or boutique displays. Their reflective surface creates a true mirror effect, giving
                      decorations a premium and unique look.
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
              {dynamicSpecificationItems.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    {dynamicSpecificationItems.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className={`flex justify-between gap-3 py-2 ${index < dynamicSpecificationItems.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <span className="text-muted-foreground">{item.label}:</span>
                        <span className="font-medium text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {hasSwahiliSpecificationItems && (
                    <div>
                      <h4 className="font-medium text-base mb-3">Kiswahili</h4>
                      <div className="space-y-3">
                        {dynamicSpecificationItems.map((item, index) => {
                          const label = item.label_sw || item.label
                          const value = item.value_sw || item.value

                          return (
                            <div
                              key={`${label}-${index}-sw`}
                              className={`flex justify-between gap-3 py-2 ${index < dynamicSpecificationItems.length - 1 ? "border-b border-border" : ""}`}
                            >
                              <span className="text-muted-foreground">{label}:</span>
                              <span className="font-medium text-right">{value}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : product.slug === "color-vinyl-stickers" ? (
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
              ) : product.slug === "wrapping-stickers" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.52m x 28m & 1.52m x 18m</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">High-quality Automotive Vinyl with Air-release Technology</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Durability:</span>
                    <span className="font-medium">5–7 Years Outdoor Lifespan</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish Options:</span>
                    <span className="font-medium">Glossy, Matte, Satin, Carbon-fiber, Brushed Metal</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">Heat-assisted Installation for Smooth, Bubble-free Wrapping</span>
                  </div>
                </div>
              ) : product.slug === "gold-chrome-mirror" ? (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Roll Size:</span>
                    <span className="font-medium">1.22m x 50m (Standard)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium">Premium Reflective Vinyl with Mirror Finish</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Durability:</span>
                    <span className="font-medium">3–5 Years (Indoor/Special Use)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Finish Options:</span>
                    <span className="font-medium">Gold Mirror, Silver Chrome, Rose Gold</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">
                      Best on Flat or Slightly Curved Surfaces, Easy to Cut and Apply for Creative Decorations
                    </span>
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

        {/* Contact CTA */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-center">
          <h3 className="font-bold text-xl text-black mb-2">Ready to Order?</h3>
          <p className="text-black/80 mb-4">Contact us for pricing and custom orders</p>
          <Link href="https://wa.me/255715724727" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-black text-white hover:bg-black/90">
              GET QUOTE
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
