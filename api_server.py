# api_server.py

# --- Step 1: Confirm script is running ---
print("--- Script api_server.py has started ---")

import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- Step 2: Define paths and check working directory ---
# This shows us where the script is currently running
print(f"Current Working Directory: {os.getcwd()}")

# These are the folder and file names we expect
model_dir = 'model'
model_filename = 'disease_prediction_model.pkl'
model_path = os.path.join(model_dir, model_filename)

# This tells us the full path it's going to check
print(f"Checking for model file at absolute path: {os.path.abspath(model_path)}")

# --- Step 3: Check if the model directory and file actually exist ---
model = None
if not os.path.isdir(model_dir):
    print(f"❌ FATAL ERROR: The directory '{model_dir}' was not found in your project.")
    print("Please create a folder named 'model' in the same directory as this script.")
elif not os.path.isfile(model_path):
    print(f"❌ FATAL ERROR: The model file '{model_filename}' was not found inside the '{model_dir}' directory.")
else:
    print(f"✅ Directory and file found. Attempting to load model...")
    # --- Step 4: Load the model ONLY if the file exists ---
    try:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ FATAL ERROR: Failed to load the pickle file. The error is: {e}")
        print("This could be due to a version mismatch in scikit-learn or a corrupted file.")

# --- Flask App Initialization ---
app = Flask(__name__)
CORS(app)

# The list of all possible symptoms your model was trained on. This MUST be correct.
ALL_SYMPTOMS = [
    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering', 'chills', 'joint_pain',
    'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition',
    'spotting_ urination', 'fatigue', 'weight_gain', 'anxiety', 'cold_hands_and_feets', 'mood_swings',
    'weight_loss', 'restlessness', 'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough',
    'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache',
    'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes', 'back_pain',
    'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine', 'yellowing_of_eyes',
    'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach', 'swelled_lymph_nodes', 'malaise',
    'blurred_and_distorted_vision', 'phlegm', 'throat_irritation', 'redness_of_eyes', 'sinus_pressure',
    'runny_nose', 'congestion', 'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements',
    'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness', 'cramps',
    'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels', 'puffy_face_and_eyes', 'enlarged_thyroid',
    'brittle_nails', 'swollen_extremeties', 'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
    'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
    'movement_stiffness', 'spinning_movements', 'loss_of_balance', 'unsteadiness', 'weakness_of_one_body_side',
    'loss_of_smell', 'bladder_discomfort', 'foul_smell_of urine', 'continuous_feel_of_urine', 'passage_of_gases',
    'internal_itching', 'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium',
    'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic _patches', 'watering_from_eyes',
    'increased_appetite', 'polyuria', 'family_history', 'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration',
    'visual_disturbances', 'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma',
    'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption', 'fluid_overload.1',
    'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations', 'painful_walking', 'pus_filled_pimples',
    'blackheads', 'scurring', 'skin_peeling', 'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails',
    'blister', 'red_sore_around_nose', 'yellow_crust_ooze'
]
symptom_to_index = {symptom: i for i, symptom in enumerate(ALL_SYMPTOMS)}

@app.route('/api/ml/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'success': False, 'error': 'The machine learning model is not loaded on the server.'}), 500
    # (The rest of the prediction logic is the same)
    data = request.get_json(force=True)
    symptoms_list = data.get('symptoms', [])
    feature_vector = np.zeros(len(ALL_SYMPTOMS))
    for symptom in symptoms_list:
        symptom_cleaned = symptom.lower().replace(" ", "_")
        if symptom_cleaned in symptom_to_index:
            feature_vector[symptom_to_index[symptom_cleaned]] = 1
    prediction = model.predict([feature_vector])
    predicted_disease = prediction[0]
    prediction_proba = model.predict_proba([feature_vector])
    probability_value = round(np.max(prediction_proba) * 100)
    response = {
        'success': True,
        'predictions': [{
            'disease': str(predicted_disease).replace("_", " ").title(),
            'probability': probability_value,
            'description': 'Based on the provided symptoms.',
            'severity': 'medium',
            'recommendations': ['Consult a healthcare professional for an accurate diagnosis.']
        }]
    }
    return jsonify(response)

# This part will only run if the model was loaded successfully
if __name__ == '__main__':
    if model is not None:
        print("--- Starting Flask Server ---")
        app.run(host='0.0.0.0', port=5001, debug=True)
    else:
        print("--- Flask server did not start because the model failed to load. Please fix the errors above. ---")

