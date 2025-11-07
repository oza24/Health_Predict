import Link from "next/link"
import { Activity } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40 border-t border-primary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-primary/80 group-hover:to-secondary/80 transition-all duration-300">HealthPredict</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Your comprehensive health assistant for disease prediction, finding healthcare providers, and connecting
              with medical professionals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/predict" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 block">
                  Disease Prediction
                </Link>
              </li>
              <li>
                <Link href="/clinics" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 block">
                  Find Clinics
                </Link>
              </li>
              <li>
                <Link href="/consultation" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 block">
                  Consult Doctors
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground bg-gradient-to-r from-foreground to-secondary bg-clip-text text-transparent">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/20 mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 HealthPredict. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
