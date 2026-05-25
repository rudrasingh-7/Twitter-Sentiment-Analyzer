from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import scipy.sparse as sp
import pandas as pd
import re
import emoji

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}},
     supports_credentials=True)

# ── In-memory history ──────────────────────────────────────────────────────
prediction_history = []

# ── Load emoji sentiment data ──────────────────────────────────────────────
emoji_df = pd.read_csv('Emoji_Sentiment_Data_v1_0.csv')
EMOJI_SENTIMENT = dict(zip(emoji_df['Emoji'], emoji_df['Positive'] / emoji_df['Occurrences']))

# ── Load binary model ──────────────────────────────────────────────────────
binary_model      = joblib.load('sentiment_model_binary.pkl')
binary_vectorizer = joblib.load('tfidf_vectorizer_binary.pkl')

# ── Load 3-class model ─────────────────────────────────────────────────────
model_3class      = joblib.load('sentiment_model_3class.pkl')
vectorizer_3class = joblib.load('tfidf_vectorizer_3class.pkl')

# ── Helper functions ───────────────────────────────────────────────────────
def emoji_sentiment_score(text):
    scores = [EMOJI_SENTIMENT[ch] for ch in text if ch in EMOJI_SENTIMENT]
    return round(sum(scores) / len(scores), 4) if scores else 0.5

def clean_text(text):
    text = emoji.demojize(text, delimiters=(' ', ' '))
    text = text.lower()
    text = re.sub(r'http\S+|www\S+', '', text)
    text = re.sub(r'@\w+', '', text)
    text = re.sub(r'#(\w+)', r'\1', text)
    text = re.sub(r'[^a-z\s_]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ── Home ───────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return "Backend Running 🚀"

# ── GET history ────────────────────────────────────────────────────────────
@app.route("/history", methods=["GET"])
def get_history():
    return jsonify(list(reversed(prediction_history)))

# ── CLEAR history ──────────────────────────────────────────────────────────
@app.route("/history/clear", methods=["DELETE"])
def clear_history():
    prediction_history.clear()
    return jsonify({"message": "History cleared"})

# ── Binary Prediction (Positive / Negative) ────────────────────────────────
@app.route("/predict-binary", methods=["POST"])
def predict_binary():
    text      = request.json["text"]
    cleaned   = clean_text(text)
    tfidf     = binary_vectorizer.transform([cleaned])
    e_score   = sp.csr_matrix([[emoji_sentiment_score(text)]])
    vec       = sp.hstack([tfidf, e_score])
    result    = binary_model.predict(vec)[0]
    sentiment = "Positive" if result == 1 else "Negative"

    # Save to history
    prediction_history.append({
        "text":      text,
        "sentiment": sentiment,
        "model":     "Binary",
    })

    return jsonify({"type": "binary", "sentiment": sentiment})

# ── 3-Class Prediction (Positive / Neutral / Negative) ────────────────────
@app.route("/predict-3class", methods=["POST"])
def predict_3class():
    text      = request.json["text"]
    cleaned   = clean_text(text)
    tfidf     = vectorizer_3class.transform([cleaned])
    e_score   = sp.csr_matrix([[emoji_sentiment_score(text)]])
    vec       = sp.hstack([tfidf, e_score])
    result    = model_3class.predict(vec)[0]
    sentiment = {0: "Negative", 1: "Neutral", 2: "Positive"}[result]

    # Save to history
    prediction_history.append({
        "text":      text,
        "sentiment": sentiment,
        "model":     "3-Class",
    })

    return jsonify({"type": "3-class", "sentiment": sentiment})

if __name__ == "__main__":
    app.run(debug=True)



