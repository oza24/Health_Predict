"use client";
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Activity, Info, X } from "lucide-react";

// Interface for the structure of a prediction result
interface PredictionResult {
  disease: string;
  probability: number;
  description: string;
  severity: "low" | "medium" | "high";
  recommendations: string[];
}

export function DiseasePredictor() {
  // State for the list of symptoms added by the user
  const [symptoms, setSymptoms] = useState<string[]>([]);
  // State for the symptom currently being typed in the input
  const [currentSymptom, setCurrentSymptom] = useState<string>("");
  // State to manage the loading spinner during API calls
  const [isLoading, setIsLoading] = useState(false);
  // State to store the prediction results from the API
  const [results, setResults] = useState<PredictionResult[]>([]);
  // State to track if a search has been performed, to show "No Results" message
  const [hasSearched, setHasSearched] = useState(false);
  // State to hold any error messages
  const [error, setError] = useState<string | null>(null);

  // --- Handlers for Symptom Input ---

  /**
   * Adds the current symptom from the input field to the symptoms list.
   * Prevents adding empty or duplicate symptoms.
   */
  const handleAddSymptom = () => {
    const trimmedSymptom = currentSymptom.trim();
    if (trimmedSymptom && !symptoms.includes(trimmedSymptom)) {
      setSymptoms([...symptoms, trimmedSymptom]);
      setCurrentSymptom(""); // Clear the input field
    }
  };

  /**
   * Handles the 'Enter' key press in the input field to add a symptom.
   * @param e - The keyboard event.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter
      handleAddSymptom();
    }
  };

  /**
   * Removes a symptom from the list when its 'x' button is clicked.
   * @param symptomToRemove - The symptom string to remove.
   */
  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter((symptom) => symptom !== symptomToRemove));
  };

  // --- API Call and Prediction Logic ---

  /**
   * Fetches disease predictions from the backend API based on the current symptoms.
   */
  const handlePredict = async () => {
    if (symptoms.length === 0) return;

    setIsLoading(true);
    setHasSearched(true);
    setError(null); // Reset error state on new prediction
    setResults([]); // Clear previous results

    try {
      const response = await fetch('/api/ml/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.predictions) {
        setResults(data.predictions);
      } else {
        throw new Error(data.error || 'Failed to get predictions');
      }
    } catch (err) {
      console.error('Prediction error:', err);
      // Instead of showing mock data, set an error message for the user
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Helper Functions ---

  /**
   * Returns Tailwind CSS classes based on the severity of the disease.
   * @param severity - The severity string ('low', 'medium', 'high').
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700";
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-0">
      {/* Medical Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical advice. Always consult a healthcare provider for any medical concerns.
        </AlertDescription>
      </Alert>

      {/* Symptom Input Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-b from-card to-card/80 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            Enter Your Symptoms
          </CardTitle>
          <CardDescription>
            Type a symptom and press Enter to add it. Be as specific as possible for better predictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Input field and Add button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              type="text"
              placeholder="e.g., fever, headache, cough"
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow"
            />
            <Button onClick={handleAddSymptom} className="w-full sm:w-auto">Add Symptom</Button>
          </div>

          {/* Display added symptoms as badges */}
          <div className="mt-4 flex flex-wrap gap-2 min-h-[2.5rem]">
            {symptoms.map((symptom, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2 text-base">
                {symptom}
                <button onClick={() => handleRemoveSymptom(symptom)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Predict Button */}
          <div className="mt-6">
            <Button 
              onClick={handlePredict} 
              disabled={symptoms.length === 0 || isLoading} 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            >
              {isLoading ? "Analyzing..." : "Predict Conditions"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Analyzing your symptoms...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Prediction Failed:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results Display */}
      {!isLoading && hasSearched && results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Prediction Results</h2>
          <div className="grid gap-6">
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{result.disease}</CardTitle>
                      <CardDescription>{result.description}</CardDescription>
                    </div>
                    <Badge className={getSeverityColor(result.severity)} variant="outline">
                      {result.severity} risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Probability Match</span>
                      <span className="font-medium">{result.probability}%</span>
                    </div>
                    <Progress value={result.probability} className="h-2 mt-1" />
                  </div>
                  <div>
                    <h4 className="font-medium">Recommendations:</h4>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {result.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="text-sm text-muted-foreground">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && hasSearched && results.length === 0 && !error && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No predictions could be made. Please try adding more specific symptoms or check for typos.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

