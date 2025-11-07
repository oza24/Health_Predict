import { NextResponse } from 'next/server';
import { SYMPTOMS, DISEASES, DatasetManager } from '@/lib/ml/dataset';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        symptoms: SYMPTOMS,
        diseases: DISEASES,
        statistics: {
          totalSymptoms: SYMPTOMS.length,
          totalDiseases: DISEASES.length,
          categories: {
            symptoms: [...new Set(SYMPTOMS.map(s => s.category))],
            diseases: [...new Set(DISEASES.map(d => d.category))]
          }
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dataset:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch dataset',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'validate_symptoms':
        const validation = DatasetManager.validateSymptomIds(data.symptomIds || []);
        return NextResponse.json({
          success: true,
          validation
        });

      case 'get_symptoms_by_category':
        const symptoms = DatasetManager.getSymptomsByCategory(data.category);
        return NextResponse.json({
          success: true,
          symptoms
        });

      case 'get_diseases_by_category':
        const diseases = DatasetManager.getDiseasesByCategory(data.category);
        return NextResponse.json({
          success: true,
          diseases
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: validate_symptoms, get_symptoms_by_category, get_diseases_by_category' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing dataset request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process dataset request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
