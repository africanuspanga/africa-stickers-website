import { CheckCircle, Clock, Shield, Users, Truck, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function WhyChooseUs() {
  const benefits = [
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Bei ya Kiwanda",
      subtitle: "Factory Prices",
      description: "Get factory prices that give you great value for premium quality stickers.",
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Ubora wa Kudumu",
      subtitle: "Quality Products",
      description: "Our products are high-quality to attract your customers and reduce complaints.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Upatikanaji wa Bidhaa",
      subtitle: "Always Available",
      description: "We ensure you never miss out on important products when you need them.",
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Delivery ya Haraka",
      subtitle: "On-Time Delivery",
      description: "We guarantee you get your products on time, every time.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Ushirikiano wa Kudumu",
      subtitle: "Long-Term Partnership",
      description: "We work with you as a partner, not just a seller.",
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Usafirishaji Mikoani",
      subtitle: "Regional Shipping",
      description: "For wholesale customers, we ship to all regions with trust and reliability.",
    },
  ]

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Kwa nini ufanye kazi nasi?</h2>
          <p className="text-xl text-primary font-semibold mb-2">Why Choose Us?</p>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            We are committed to providing the best sticker solutions with unmatched quality and service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{benefit.title}</h3>
                <p className="text-primary font-semibold mb-3">{benefit.subtitle}</p>
                <p className="text-muted-foreground text-sm text-pretty">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
