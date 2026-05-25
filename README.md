<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white" />
<img src="https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
<img src="https://img.shields.io/badge/Tweets-1.6M-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />

# 🪶 Tweetalyze — Twitter Sentiment Analyzer

**A full-stack ML web app that classifies tweet sentiment in real time.**  
Trained on 1.6 million tweets using TF-IDF + emoji features. Ships with a binary (Positive/Negative) and a 3-class (Positive / Neutral / Negative) model — both served via a Flask REST API and visualized in a React dashboard.

[🚀 Live Demo](#) · [📓 ML Notebook](ml/) · [🐛 Report a Bug](../../issues)

</div>

---

## ✨ Features

- **Real-time predictions** — type any tweet text and get instant sentiment classification
- **Two models** — Binary (Positive/Negative) and 3-Class (Positive/Neutral/Negative)
- **Emoji-aware** — uses Emoji Sentiment Data v1.0 as an additional TF-IDF feature
- **Interactive dashboard** — cross-validation charts, model comparisons, error analysis, prediction history
- **Clean dark UI** — animated starfield background, responsive layout

---

## 📊 Model Performance

| Model | Type | Accuracy |
|---|---|---|
| Logistic Regression (tuned) | Binary | **76.71%** |
| SVM (LinearSVC) | Binary | 76.61% |
| Naive Bayes (Bernoulli) | Binary | 75.65% |
| VADER baseline | Binary | 66.40% |
| SVM (LinearSVC) | 3-Class | **88.13%** |
| Logistic Regression | 3-Class | 87.95% |

> Trained on Sentiment140 (1.28M tweets), tested on 320K tweets. TF-IDF with 5,000 features (unigrams + bigrams).

---

## 🗂️ Project Structure

```
Twitter-Sentiment-Analyzer/
├── backend/                  # Flask REST API
│   ├── app.py                # API endpoints (/predict-binary, /predict-3class, /history)
│   ├── requirements.txt      # Python dependencies
│   ├── sentiment_model_binary.pkl
│   ├── sentiment_model_3class.pkl
│   ├── tfidf_vectorizer_binary.pkl
│   ├── tfidf_vectorizer_3class.pkl
│   └── Emoji_Sentiment_Data_v1_0.csv
│
├── ml/                       # Jupyter notebook + outputs
│   ├── Twitter_Sentiment_Analysis_Final.ipynb
│   ├── confusion_matrices.png
│   ├── roc_curves.png
│   ├── cross_validation.png
│   ├── feature_importance.png
│   └── wordcloud.png
│
├── tweetalyze/               # React frontend
│   ├── src/
│   │   ├── Tweetalyze.jsx    # Main app component
│   │   ├── constants.js      # All model stats & chart data
│   │   └── components/
│   │       ├── Tabs.jsx      # Overview, Binary, 3-Class, Error Analysis tabs
│   │       ├── UI.jsx        # Shared components (Card, Badge, PredictBox, Sidebar)
│   │       └── PredictionHistory.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Running Locally

You need **two terminals open at the same time**.

### 1. Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
# → Running on http://localhost:5000
```

### 2. Frontend (React)

```bash
cd tweetalyze
npm install
npm start
# → Opens http://localhost:3000
```

> ⚠️ Keep both terminals running. The React app talks to Flask on port 5000.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/predict-binary` | Returns `Positive` or `Negative` |
| `POST` | `/predict-3class` | Returns `Positive`, `Neutral`, or `Negative` |
| `GET` | `/history` | Returns prediction history |
| `DELETE` | `/history/clear` | Clears prediction history |

**Request body:**
```json
{ "text": "I love this so much!" }
```

**Response:**
```json
{ "type": "binary", "sentiment": "Positive" }
```

---

## 🧠 ML Pipeline

1. **Preprocessing** — lowercase, strip URLs/mentions, demojize emoji via `emoji` library
2. **Feature extraction** — TF-IDF (5,000 features, unigrams + bigrams) + emoji sentiment score
3. **Training** — Logistic Regression, SVM (LinearSVC), Naive Bayes; tuned via GridSearchCV
4. **Evaluation** — 5-fold cross-validation, confusion matrix, ROC curves, error analysis

---

## 📸 Screenshots

| Dashboard Overview | Binary Prediction | 3-Class Models |
|---|---|---|
| *(coming soon)* | *(coming soon)* | *(coming soon)* |

> 💡 **Tip:** Add screenshots by uploading images to a `/screenshots` folder in the repo and linking them here.

---

## 🛠️ Tech Stack

**Frontend:** React 19, Recharts, DM Sans / Space Mono  
**Backend:** Flask, Flask-CORS, scikit-learn, joblib, pandas, scipy, emoji  
**ML:** Sentiment140 dataset, Emoji Sentiment Data v1.0, TF-IDF, Logistic Regression, SVM, Naive Bayes  

---

## 👤 Author

**Rudra Singh**  
[GitHub @rudrasingh-7](https://github.com/rudrasingh-7)

---

<div align="center">
  <sub>Built with Python, React, and 1.6 million tweets ☕</sub>
</div>
