import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ClinicsFinder } from "@/components/clinics/clinics-finder"

export default function ClinicsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-balance mb-4">Find Clinics & Pharmacies</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Locate nearby healthcare facilities, check availability, and get directions to the care you need.
            </p>
          </div>
          <ClinicsFinder />
        </div>
      </main>
      <Footer />
    </div>
  )
}
