import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ModelTraining } from "@/components/ml/model-training";

export default function TrainingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <ModelTraining />
        </div>
      </main>
      <Footer />
    </div>
  );
}
