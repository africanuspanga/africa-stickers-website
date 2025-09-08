import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/hero-store.jpg" alt="Africa Stickers Store" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 text-balance">
          Premium Stickers & Vinyl Solutions
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 text-pretty">
          Karibu ujipatie STICKERS aina mbalimbali na rangi zote pamoja na professional sticker printing, vinyl cutting,
          na custom graphics
        </p>

        <div className="flex justify-center">
          <Link href="https://wa.me/255715724727" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-primary text-black hover:bg-primary/90 text-lg px-8 py-3">
              PATA BEI
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-12 text-primary">
          <p className="text-lg font-semibold">Call us: +255 715 724 727</p>
          <p className="text-white/80">Lumumba & Tandamti Street, Kariakoo Dar Es Salaam</p>
        </div>
      </div>
    </section>
  )
}
