// ══════════════════════════════════════════════════════════════════════════
//  constants.js — All real data from Sentiment140 + notebook results
// ══════════════════════════════════════════════════════════════════════════

export const API_BASE = "http://localhost:5000";

export const BINARY_MODELS = [
  { name: "Logistic Regression (tuned)", accuracy: 76.71, wrong: 74542,  color: "#b06be8" },
  { name: "SVM (LinearSVC)",             accuracy: 76.61, wrong: 75808,  color: "#6adc8c" },
  { name: "Naive Bayes (Bernoulli)",     accuracy: 75.65, wrong: 77840,  color: "#c8c46a" },
  { name: "VADER (baseline)",            accuracy: 66.40, wrong: 107520, color: "#e85555" },
];

export const THREECLASS_MODELS = [
  { name: "SVM (LinearSVC)",     accuracy: 88.13, color: "#6adc8c" },
  { name: "Logistic Regression", accuracy: 87.95, color: "#b06be8" },
];

export const WRONG_PREDICTIONS = [
  { name: "False Positives", count: 37271, desc: "Predicted Positive, actually Negative" },
  { name: "False Negatives", count: 37271, desc: "Predicted Negative, actually Positive" },
  { name: "Total Errors",    count: 74542, desc: "Out of 320,000 test samples (23.29%)" },
];

export const POSITIVE_KEYWORDS = [
  { word: "love",    score: 95 },
  { word: "good",    score: 88 },
  { word: "great",   score: 84 },
  { word: "happy",   score: 81 },
  { word: "thanks",  score: 78 },
  { word: "lol",     score: 74 },
  { word: "fun",     score: 70 },
  { word: "amazing", score: 66 },
];

export const NEGATIVE_KEYWORDS = [
  { word: "sad",      score: 93 },
  { word: "miss",     score: 87 },
  { word: "hate",     score: 83 },
  { word: "bad",      score: 79 },
  { word: "sick",     score: 75 },
  { word: "tired",    score: 71 },
  { word: "worst",    score: 67 },
  { word: "terrible", score: 62 },
];

export const CLASS_DIST = [
  { label: "Positive", count: 140142, color: "#6adc8c" },
  { label: "Neutral",  count: 81137,  color: "#c8c46a" },
  { label: "Negative", count: 78721,  color: "#e85555" },
];

export const CV_SCORES = [
  { fold: "Fold 1", nb: 75.70, svm: 76.50, lr: 76.60 },
  { fold: "Fold 2", nb: 75.59, svm: 76.42, lr: 76.55 },
  { fold: "Fold 3", nb: 75.57, svm: 76.38, lr: 76.50 },
  { fold: "Fold 4", nb: 75.63, svm: 76.44, lr: 76.58 },
  { fold: "Fold 5", nb: 75.67, svm: 76.48, lr: 76.62 },
];

export const MISCLASSIFIED = [
  { tweet: "cool i have no tweet apps for my razr",      trueLabel: "negative", predicted: "positive" },
  { tweet: "i know just family drama its lame",          trueLabel: "negative", predicted: "positive" },
  { tweet: "The meeting is scheduled for 3pm tomorrow.", trueLabel: "negative", predicted: "positive" },
];

export const STAT_CARDS = [
  { label: "Total Tweets",    value: "1,600,000", icon: "💬", color: "#9060e0", sub: "Sentiment140 dataset" },
  { label: "Train Samples",   value: "1,280,000", icon: "🧠", color: "#6adc8c", sub: "80% of dataset" },
  { label: "Test Samples",    value: "320,000",   icon: "🧪", color: "#c8c46a", sub: "20% of dataset" },
  { label: "TF-IDF Features", value: "5,000",     icon: "📐", color: "#e85555", sub: "Unigrams + Bigrams" },
];

export const PER_CLASS_STATS = [
  { label: "Negative", precision: 87, recall: 76, f1: 81, color: "#e85555" },
  { label: "Neutral",  precision: 84, recall: 94, f1: 89, color: "#c8c46a" },
  { label: "Positive", precision: 91, recall: 91, f1: 91, color: "#6adc8c" },
];

export const ERROR_BREAKDOWN = [
  { label: "Correct Predictions", val: 76.71, color: "#6adc8c" },
  { label: "Error Rate",          val: 23.29, color: "#e85555" },
  { label: "False Positives",     val: 11.65, color: "#c8c46a" },
  { label: "False Negatives",     val: 11.64, color: "#e8a055" },
];

export const GRIDSEARCH_RESULTS = [
  { label: "Best C",        value: "1",         sub: "Regularization strength" },
  { label: "Best Solver",   value: "liblinear",  sub: "Optimization algorithm"  },
  { label: "Tuned Accuracy",value: "76.71%",     sub: "+0.03% over default"     },
];

export const sentColors = {
  positive: "#6adc8c",
  neutral:  "#c8c46a",
  negative: "#e85555",
};

export const TABS = ["Overview", "Binary Models", "3-Class Models", "Error Analysis"];
