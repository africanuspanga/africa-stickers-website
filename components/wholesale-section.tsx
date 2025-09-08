import { Card, CardContent } from "@/components/ui/card"
import { Package, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WholesaleSection() {
  return (
    <section className="py-20 px-6 bg-gray-50 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Kwa Wateja wa Jumla</h2>
          <p className="text-xl text-primary font-semibold mb-4">For Wholesale Customers</p>
          <p className="text-gray-600 max-w-2xl mx-auto text-pretty">
            Special pricing and services for bulk orders and business partnerships
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-gray-200 hover:border-primary/50 transition-colors bg-white relative z-20">
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                Bulk Orders
              </h3>
              <p className="text-gray-600 text-sm">Jumla Tunauza kwa Roll Moja ama kwa Mita (Kuanzia mita 10+)</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:border-primary/50 transition-colors bg-white relative z-20">
            <CardContent className="p-6 text-center">
              <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                Regional Delivery
              </h3>
              <p className="text-gray-600 text-sm">Tunasafirisha MIKOANI Kote kwa uaminifu na kwa wakati</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:border-primary/50 transition-colors bg-white relative z-20">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                Business Partnership
              </h3>
              <p className="text-gray-600 text-sm">Long-term partnerships with competitive wholesale pricing</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-primary text-black hover:bg-primary/90">
            Contact for Wholesale Pricing
          </Button>
        </div>
      </div>
    </section>
  )
}
