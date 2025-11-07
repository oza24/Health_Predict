import { NextRequest, NextResponse } from 'next/server';
import { TrainingJobManager } from '@/lib/ml/model';

// Global training job manager instance
const jobManager = new TrainingJobManager();

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    
    const job = jobManager.getJob(jobId);
    
    if (!job) {
      return NextResponse.json(
        { error: 'Training job not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        status: job.status,
        config: job.config,
        metrics: job.metrics,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
        error: job.error,
        modelPath: job.modelPath
      }
    });

  } catch (error) {
    console.error('Error fetching training job:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch training job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
