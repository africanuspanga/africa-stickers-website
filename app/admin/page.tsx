"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, ImageIcon, Package, Home, LogOut, Upload, Settings } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/admin/login")
  }

  const dashboardCards = [
    {
      title: "Homepage Management",
      titleSw: "Usimamizi wa Ukurasa wa Kwanza",
      description: "Manage hero images, features, and testimonials",
      descriptionSw: "Simamia picha za hero, vipengele, na ushuhuda",
      icon: Home,
      href: "/admin/homepage",
      color: "bg-primary",
    },
    {
      title: "Product Management",
      titleSw: "Usimamizi wa Bidhaa",
      description: "Manage product images and details",
      descriptionSw: "Simamia picha za bidhaa na maelezo",
      icon: Package,
      href: "/admin/products",
      color: "bg-secondary",
    },
    {
      title: "Image Library",
      titleSw: "Maktaba ya Picha",
      description: "View and organize all uploaded images",
      descriptionSw: "Ona na panga picha zote zilizopakiwa",
      icon: ImageIcon,
      href: "/admin/images",
      color: "bg-accent",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">Africa Stickers Admin</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout / Toka
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome to the Africa Stickers admin panel. Manage your website content and images.
          </p>
          <p className="text-muted-foreground text-sm">
            Karibu kwenye paneli ya msimamizi wa Africa Stickers. Simamia maudhui na picha za tovuti yako.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card) => (
            <Card key={card.href} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{card.titleSw}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{card.description}</p>
                <p className="text-xs text-muted-foreground mb-4">{card.descriptionSw}</p>
                <Button onClick={() => router.push(card.href)} className="w-full" variant="outline">
                  Manage / Simamia
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-muted-foreground">Products / Bidhaa</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Images / Picha</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-muted-foreground">Homepage Sections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">Active</p>
                  <p className="text-sm text-muted-foreground">System Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
