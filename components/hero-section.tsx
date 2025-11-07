"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, MapPin, MessageCircle, Stethoscope } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginModal } from "@/components/auth/login-modal"

export function HeroSection() {
  const [user, setUser] = useState<{ name: string; email: string; userType?: string } | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  const handleButtonClick = (route: string) => {
    if (user) {
      // User is logged in, navigate to the page
      router.push(route)
    } else {
      // User is not logged in, open login modal
      setIsLoginModalOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    // Update user state after successful login
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-secondary/10"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Your Personal <span className="text-primary">Health Assistant</span>
          </h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto mb-8">
            Predict diseases, find nearby clinics and pharmacies, and consult doctors online – all in one place.
          </p>
          <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-muted/40 relative">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Comprehensive Health Solutions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Disease Prediction */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 bg-gradient-to-b from-card to-card/80">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Disease Prediction</h3>
                <p className="text-muted-foreground mb-6">
                  Get accurate disease predictions based on your symptoms using advanced AI algorithms.
                </p>
                <Button 
                  variant="outline" 
                  className="border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  onClick={() => handleButtonClick("/predict")}
                >
                  Try Now
                </Button>
              </CardContent>
            </Card>

            {/* Nearby Clinics & Pharmacies */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-secondary/20 bg-gradient-to-b from-card to-card/80">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Nearby Clinics & Pharmacies</h3>
                <p className="text-muted-foreground mb-6">
                  Find healthcare centers and pharmacies near you with real-time availability and directions.
                </p>
                <Button 
                  variant="outline" 
                  className="border-secondary/30 hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                  onClick={() => handleButtonClick("/clinics")}
                >
                  Find Locations
                </Button>
              </CardContent>
            </Card>

            {/* Online Doctor Consultation */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-accent/20 bg-gradient-to-b from-card to-card/80">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageCircle className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">Online Doctor Consultation</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with certified doctors through secure chat or video calls from anywhere.
                </p>
                <Button 
                  variant="outline" 
                  className="border-accent/30 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  onClick={() => handleButtonClick("/consultation")}
                >
                  Consult Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/10 to-background relative">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Trusted by Healthcare Professionals</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform is designed with medical professionals and follows industry standards to ensure accurate
            predictions and secure consultations.
          </p>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}
