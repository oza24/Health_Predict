import { NextRequest, NextResponse } from 'next/server';
import { DiseasePredictionModel, ModelFactory } from '@/lib/ml/model';
import { PredictionRequest } from '@/lib/ml/types';

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    
    // Validate request
    if (!body.symptoms || !Array.isArray(body.symptoms) || body.symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Symptoms array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Create model instance (in production, this would load a trained model)
    const model = ModelFactory.createModel(ModelFactory.getDefaultConfig());
    
    // Make prediction
    const results = await model.predict(body);
    
    return NextResponse.json({
      success: true,
      predictions: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to make prediction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Disease prediction endpoint',
    method: 'POST',
    requiredFields: {
      symptoms: 'string[] (required)',
      age: 'number (optional)',
      gender: 'string (optional)',
      medicalHistory: 'string[] (optional)'
    },
    example: {
      symptoms: ['fever', 'cough', 'fatigue'],
      age: 30,
      gender: 'male'
    }
  });
}
