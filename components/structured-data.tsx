export function BusinessStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Africa Stickers",
    description: "Professional sticker printing, vinyl cutting, and custom graphics in Dar Es Salaam, Tanzania",
    url: "https://www.africastickers.co.tz",
    telephone: "+255-XXX-XXX-XXX", // Replace with actual phone
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dar Es Salaam", // Replace with actual address
      addressLocality: "Dar Es Salaam",
      addressCountry: "TZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.7924,
      longitude: 39.2083,
    },
    openingHours: "Mo-Fr 08:00-17:00, Sa 08:00-14:00",
    priceRange: "$$",
    servesCuisine: null,
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: -6.7924,
        longitude: 39.2083,
      },
      geoRadius: "50000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Sticker and Vinyl Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Vinyl Stickers",
            description: "High-quality custom vinyl stickers for vehicles, businesses, and personal use",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Reflective Sheeting",
            description: "Safety reflective materials for vehicles and industrial applications",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Window Films",
            description: "Tinted and frosted films for privacy and decoration",
          },
        },
      ],
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

export function ProductStructuredData({ product }: { product: any }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "Africa Stickers",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Africa Stickers",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "TZS",
      seller: {
        "@type": "Organization",
        name: "Africa Stickers",
      },
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
