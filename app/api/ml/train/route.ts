import { NextRequest, NextResponse } from 'next/server';
import { TrainingJobManager, ModelFactory } from '@/lib/ml/model';
import { ModelConfig } from '@/lib/ml/types';

// Global training job manager instance
const jobManager = new TrainingJobManager();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate and set default config
    const config: ModelConfig = {
      algorithm: body.algorithm || 'random_forest',
      nEstimators: body.nEstimators || 100,
      maxDepth: body.maxDepth || 10,
      learningRate: body.learningRate || 0.01,
      hiddenLayers: body.hiddenLayers || [64, 32],
      regularization: body.regularization || 0.01,
      testSize: body.testSize || 0.2,
      randomState: body.randomState || 42
    };

    // Validate algorithm
    const validAlgorithms = ['random_forest', 'neural_network', 'svm', 'gradient_boosting'];
    if (!validAlgorithms.includes(config.algorithm)) {
      return NextResponse.json(
        { error: `Invalid algorithm. Must be one of: ${validAlgorithms.join(', ')}` },
        { status: 400 }
      );
    }

    // Create training job
    const jobId = await jobManager.createTrainingJob(config);
    
    return NextResponse.json({
      success: true,
      jobId,
      message: 'Training job created successfully',
      status: 'pending'
    });

  } catch (error) {
    console.error('Training job creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create training job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const jobs = jobManager.getAllJobs();
    
    return NextResponse.json({
      success: true,
      jobs: jobs.map(job => ({
        id: job.id,
        status: job.status,
        algorithm: job.config.algorithm,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        error: job.error
      }))
    });

  } catch (error) {
    console.error('Error fetching training jobs:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch training jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
