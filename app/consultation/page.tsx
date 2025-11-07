import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ConsultationSystem } from "@/components/consultation/consultation-system"

export default function ConsultationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-balance mb-4">Online Doctor Consultation</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Connect with certified healthcare professionals through secure video calls or chat consultations from the
              comfort of your home.
            </p>
          </div>
          <ConsultationSystem />
        </div>
      </main>
      <Footer />
    </div>
  )
}
