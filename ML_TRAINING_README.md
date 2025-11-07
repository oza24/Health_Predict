# Disease Prediction Model Fine-tuning

This document explains how to fine-tune machine learning models for disease prediction in your health prediction application.

## Overview

The system includes:
- **Rule-based prediction** (current implementation) - Works immediately without training
- **Machine learning models** - Trainable models for improved accuracy
- **Training interface** - Web-based interface for model training
- **Python training script** - Standalone script for advanced training

## Quick Start

### 1. Using the Web Interface

1. Navigate to `/admin/training` in your application
2. Configure your model parameters:
   - **Algorithm**: Choose from Random Forest, Neural Network, SVM, or Gradient Boosting
   - **Parameters**: Adjust algorithm-specific settings
3. Click "Start Training" to begin the training process
4. Monitor training progress and view results

### 2. Using the Python Script

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the training script:
   ```bash
   python scripts/train_model.py --data data/training_data.json --output models/disease_model --algorithm random_forest
   ```

## Available Algorithms

### Random Forest
- **Best for**: General-purpose classification
- **Parameters**:
  - `nEstimators`: Number of trees (default: 100)
  - `maxDepth`: Maximum tree depth (default: 10)

### Neural Network
- **Best for**: Complex pattern recognition
- **Parameters**:
  - `hiddenLayers`: Hidden layer sizes (default: [64, 32])
  - `learningRate`: Learning rate (default: 0.001)
  - `regularization`: L2 regularization (default: 0.01)

### Support Vector Machine (SVM)
- **Best for**: High-dimensional data
- **Parameters**: Automatically optimized

### Gradient Boosting
- **Best for**: High accuracy requirements
- **Parameters**:
  - `nEstimators`: Number of boosting stages (default: 100)
  - `learningRate`: Learning rate (default: 0.1)
  - `maxDepth`: Maximum tree depth (default: 3)

## Data Format

### Training Data Structure
```json
{
  "id": "unique_identifier",
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "disease": "disease_id",
  "age": 30,
  "gender": "male",
  "outcome": "confirmed",
  "confidence": 0.9
}
```

### Available Symptoms
- **Respiratory**: cough, shortness_breath, chest_pain, runny_nose, sore_throat
- **Gastrointestinal**: nausea, vomiting, diarrhea, abdominal_pain, loss_appetite
- **Neurological**: headache, dizziness, fatigue, confusion
- **Systemic**: fever, chills, sweating, weight_loss
- **Dermatological**: rash, itching, swelling

### Available Diseases
- **common_cold**: Common Cold
- **flu**: Influenza (Flu)
- **covid19**: COVID-19
- **gastroenteritis**: Viral Gastroenteritis
- **migraine**: Migraine
- **allergic_reaction**: Allergic Reaction

## API Endpoints

### Prediction
```bash
POST /api/ml/predict
{
  "symptoms": ["fever", "cough", "fatigue"],
  "age": 30,
  "gender": "male"
}
```

### Training
```bash
POST /api/ml/train
{
  "algorithm": "random_forest",
  "nEstimators": 100,
  "maxDepth": 10,
  "testSize": 0.2
}
```

### Training Jobs
```bash
GET /api/ml/train          # List all training jobs
GET /api/ml/jobs/{jobId}   # Get specific job details
```

### Dataset
```bash
GET /api/ml/dataset        # Get symptoms and diseases
POST /api/ml/dataset       # Validate symptoms or get by category
```

## Model Performance

### Metrics Tracked
- **Accuracy**: Overall correctness
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1 Score**: Harmonic mean of precision and recall
- **Cross-validation**: 5-fold CV for robust evaluation

### Expected Performance
- **Random Forest**: 85-90% accuracy
- **Neural Network**: 80-88% accuracy
- **SVM**: 82-87% accuracy
- **Gradient Boosting**: 87-92% accuracy

## Integration with Frontend

The disease predictor component automatically uses the trained models:

```typescript
// In components/disease-prediction/disease-predictor.tsx
const response = await fetch('/api/ml/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ symptoms: symptoms })
});
```

## Advanced Usage

### Custom Training Data

1. Prepare your data in the required JSON format
2. Include diverse cases with confirmed diagnoses
3. Ensure balanced representation across diseases
4. Include demographic information when available

### Model Persistence

Models are automatically saved with metadata:
- Model weights/parameters
- Feature names and scaling parameters
- Performance metrics
- Training configuration

### Production Deployment

1. Train models on representative data
2. Validate performance on held-out test set
3. Deploy trained models to production
4. Monitor performance and retrain as needed

## Troubleshooting

### Common Issues

1. **Low Accuracy**: Increase training data, try different algorithms
2. **Training Fails**: Check data format, ensure sufficient samples
3. **API Errors**: Verify endpoint URLs, check request format
4. **Memory Issues**: Reduce model complexity, use smaller datasets

### Performance Optimization

1. **Feature Engineering**: Add derived features (symptom combinations)
2. **Data Augmentation**: Generate synthetic training cases
3. **Ensemble Methods**: Combine multiple models
4. **Hyperparameter Tuning**: Optimize algorithm parameters

## Future Enhancements

- **Real-time Learning**: Update models with new cases
- **Multi-modal Data**: Include lab results, imaging data
- **Deep Learning**: Implement transformer-based models
- **Federated Learning**: Train across multiple institutions
- **Explainable AI**: Provide model interpretability

## Support

For issues or questions:
1. Check the API documentation
2. Review training logs
3. Validate data format
4. Test with sample data

The system is designed to be robust and provide fallback predictions even when ML models are not available.
