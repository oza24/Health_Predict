"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Activity, CheckCircle, Clock, XCircle, Brain, BarChart3 } from "lucide-react";

interface TrainingJob {
  id: string;
  status: 'pending' | 'training' | 'completed' | 'failed';
  algorithm: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingLoss: number[];
  validationLoss: number[];
}

export function ModelTraining() {
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedJob, setSelectedJob] = useState<TrainingJob | null>(null);
  const [jobMetrics, setJobMetrics] = useState<ModelMetrics | null>(null);
  
  // Training configuration
  const [config, setConfig] = useState({
    algorithm: 'random_forest',
    nEstimators: 100,
    maxDepth: 10,
    learningRate: 0.01,
    testSize: 0.2,
    randomState: 42
  });

  // Fetch training jobs
  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/ml/train');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Fetch job details and metrics
  const fetchJobDetails = async (jobId: string) => {
    try {
      const response = await fetch(`/api/ml/jobs/${jobId}`);
      const data = await response.json();
      if (data.success && data.job) {
        setSelectedJob(data.job);
        if (data.job.metrics) {
          setJobMetrics(data.job.metrics);
        }
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  // Start training
  const startTraining = async () => {
    setIsTraining(true);
    try {
      const response = await fetch('/api/ml/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh jobs list
        await fetchJobs();
        // Select the new job
        if (data.jobId) {
          setTimeout(() => fetchJobDetails(data.jobId), 1000);
        }
      } else {
        throw new Error(data.error || 'Failed to start training');
      }
    } catch (error) {
      console.error('Training error:', error);
    } finally {
      setIsTraining(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'training':
        return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'training':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Model Training & Fine-tuning</h1>
        <p className="text-lg text-muted-foreground">
          Train and fine-tune machine learning models for disease prediction
        </p>
      </div>

      <Tabs defaultValue="training" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="training">Start Training</TabsTrigger>
          <TabsTrigger value="jobs">Training Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Training Configuration
              </CardTitle>
              <CardDescription>
                Configure the parameters for your machine learning model
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="algorithm">Algorithm</Label>
                  <Select
                    value={config.algorithm}
                    onValueChange={(value) => setConfig({ ...config, algorithm: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random_forest">Random Forest</SelectItem>
                      <SelectItem value="neural_network">Neural Network</SelectItem>
                      <SelectItem value="svm">Support Vector Machine</SelectItem>
                      <SelectItem value="gradient_boosting">Gradient Boosting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testSize">Test Size</Label>
                  <Input
                    id="testSize"
                    type="number"
                    min="0.1"
                    max="0.5"
                    step="0.1"
                    value={config.testSize}
                    onChange={(e) => setConfig({ ...config, testSize: parseFloat(e.target.value) })}
                  />
                </div>

                {config.algorithm === 'random_forest' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nEstimators">Number of Estimators</Label>
                      <Input
                        id="nEstimators"
                        type="number"
                        min="10"
                        max="1000"
                        value={config.nEstimators}
                        onChange={(e) => setConfig({ ...config, nEstimators: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxDepth">Max Depth</Label>
                      <Input
                        id="maxDepth"
                        type="number"
                        min="1"
                        max="50"
                        value={config.maxDepth}
                        onChange={(e) => setConfig({ ...config, maxDepth: parseInt(e.target.value) })}
                      />
                    </div>
                  </>
                )}

                {config.algorithm === 'neural_network' && (
                  <div className="space-y-2">
                    <Label htmlFor="learningRate">Learning Rate</Label>
                    <Input
                      id="learningRate"
                      type="number"
                      min="0.001"
                      max="0.1"
                      step="0.001"
                      value={config.learningRate}
                      onChange={(e) => setConfig({ ...config, learningRate: parseFloat(e.target.value) })}
                    />
                  </div>
                )}
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Training may take several minutes depending on the dataset size and algorithm complexity.
                  The model will be automatically saved upon successful completion.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={startTraining} 
                disabled={isTraining}
                className="w-full"
              >
                {isTraining ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-pulse" />
                    Starting Training...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Start Training
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Training Jobs
              </CardTitle>
              <CardDescription>
                Monitor the status of your training jobs and view results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No training jobs found. Start a new training job to see it here.
                  </p>
                ) : (
                  jobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => fetchJobDetails(job.id)}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <p className="font-medium">{job.algorithm}</p>
                          <p className="text-sm text-muted-foreground">
                            Started: {new Date(job.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(job.status)} variant="outline">
                        {job.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {selectedJob && (
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Job ID: {selectedJob.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedJob.status)} variant="outline">
                      {selectedJob.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Algorithm</Label>
                    <p>{selectedJob.algorithm}</p>
                  </div>
                  <div>
                    <Label>Created</Label>
                    <p>{new Date(selectedJob.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedJob.completedAt && (
                    <div>
                      <Label>Completed</Label>
                      <p>{new Date(selectedJob.completedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {selectedJob.error && (
                  <Alert>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Error:</strong> {selectedJob.error}
                    </AlertDescription>
                  </Alert>
                )}

                {jobMetrics && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Model Performance</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {(jobMetrics.accuracy * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {(jobMetrics.precision * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Precision</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {(jobMetrics.recall * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Recall</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {(jobMetrics.f1Score * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">F1 Score</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
