export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Lucas Msuya",
      product: "Vinyl Stickers",
      testimonial:
        "Excellent quality vinyl stickers for my business. The colors are vibrant and the adhesion is perfect.",
    },
    {
      name: "Khalifa Omary",
      product: "Reflective Sheeting",
      testimonial: "Professional service and high-quality reflective materials. Highly recommend Africa Stickers.",
    },
    {
      name: "John Mrema",
      product: "Custom Stickers",
      testimonial: "Amazing custom sticker designs that perfectly matched my brand. Fast delivery and great prices.",
    },
    {
      name: "Salum Ahmed",
      product: "3M Reflective Tapes",
      testimonial: "Top quality 3M products and excellent customer service. Will definitely order again.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-lg">Trusted by businesses and individuals across Tanzania</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-primary relative z-20"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="mb-4">
                <div className="flex text-primary text-lg mb-2">{"★".repeat(5)}</div>
                <p className="text-gray-700 text-sm mb-4">"{testimonial.testimonial}"</p>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold" style={{ color: "#1f2937", backgroundColor: "#ffffff" }}>
                  {testimonial.name}
                </h4>
                <p className="text-primary text-sm font-medium">{testimonial.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
