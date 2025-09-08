import { Package, Shapes, Hash, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Package,
      title: "Any Size",
      description: "Custom sizes to fit your needs",
    },
    {
      icon: Shapes,
      title: "Any Shape",
      description: "Die-cut to any shape you want",
    },
    {
      icon: Hash,
      title: "Any Quantity",
      description: "From single pieces to bulk orders",
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Quick delivery on all orders",
    },
  ]

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
