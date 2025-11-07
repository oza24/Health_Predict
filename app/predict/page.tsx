import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DiseasePredictor } from "@/components/disease-prediction/disease-predictor"

export default function PredictPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-balance mb-4">Disease Prediction</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Enter your symptoms and get AI-powered predictions for possible conditions. This tool is for informational
              purposes only and should not replace professional medical advice.
            </p>
          </div>
          <DiseasePredictor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
