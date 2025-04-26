from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load and preprocess data
df = pd.read_csv('Cleaned_Drug_Data.csv')
df['mechanism'] = df['mechanism'].apply(
    lambda x: "Not Available" if isinstance(x, str) and "TARGET" in x else x
)
# Fill NaN with empty strings to avoid issues
for col in ['generic_name', 'composition', 'indication', 'mechanism', 'pharmacodynamics']:
    df[col] = df[col].fillna("")

# Create a combined text column
df['combined'] = df['generic_name'] + " " + df['composition'] + " " + df['indication'] + " " + df['mechanism'] + " " + df['pharmacodynamics']

# TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(df['combined'])

# Helper function to get similar medicines
def get_similar_medicines(medicine_name, top_n=5):
    idx = df[df['name'].str.lower() == medicine_name.lower()].index
    if idx.empty:
        return []
    
    idx = idx[0]
    cosine_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix).flatten()
    similar_indices = cosine_sim.argsort()[-top_n-1:-1][::-1]  # Top N, excluding the input itself

    similar_meds = df.iloc[similar_indices][['drug_id', 'name', 'generic_name', 'indication']].to_dict(orient='records')
    return similar_meds

# Flask route
@app.route('/get_similar', methods=['GET'])
def get_similar():
    medicine_name = request.args.get('name')
    if not medicine_name:
        return jsonify({'error': 'Please provide a medicine name'}), 400
    
    results = get_similar_medicines(medicine_name)
    if not results:
        return jsonify({'error': 'Medicine not found'}), 404

    return jsonify({'similar_medicines': results})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=8000)