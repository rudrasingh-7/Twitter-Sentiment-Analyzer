// ══════════════════════════════════════════════════════════════════════════
//  components/Tabs.jsx — All 4 tab content sections
// ══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell,
} from "recharts";

import { Badge, Card, SectionTitle, CustomTooltip, PredictBox } from "./UI";
import { PredictionHistory }                                     from "./PredictionHistory";
import {
  BINARY_MODELS, THREECLASS_MODELS, WRONG_PREDICTIONS,
  POSITIVE_KEYWORDS, NEGATIVE_KEYWORDS, CLASS_DIST,
  CV_SCORES, MISCLASSIFIED, STAT_CARDS,
  PER_CLASS_STATS, ERROR_BREAKDOWN, GRIDSEARCH_RESULTS,
  sentColors,
} from "../constants";

// ── TAB 1: Overview ────────────────────────────────────────────────────────
export const OverviewTab = () => {
  const [kwTab, setKwTab] = useState("positive");

  return (
    <>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {STAT_CARDS.map(c => (
          <div key={c.label} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(140,80,200,0.2)",
            borderRadius: 16, padding: "20px 22px", backdropFilter: "blur(10px)",
            position: "relative", overflow: "hidden", animation: "fadeSlide 0.4s ease both",
          }}>
            <div style={{
              position: "absolute", top: -18, right: -18, width: 80, height: 80,
              borderRadius: "50%", background: `radial-gradient(circle,${c.color}25,transparent 70%)`,
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "#9a8ab8", fontSize: 13 }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>{c.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 5, fontFamily: "'Space Mono',monospace" }}>
              {c.value}
            </div>
            <div style={{ fontSize: 11, color: "#6a5a8a" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 20 }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Cross-validation line chart */}
          <Card>
            <SectionTitle sub="5-Fold Cross Validation — Binary Classification">
              Model Accuracy Comparison
            </SectionTitle>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={CV_SCORES} margin={{ top: 4, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="fold" tick={{ fill: "#6a5a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[74, 78]} tick={{ fill: "#6a5a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="lr"  name="Logistic Regression" stroke="#b06be8" strokeWidth={2.5} dot={{ r: 4, fill: "#b06be8" }} />
                <Line type="monotone" dataKey="svm" name="SVM"                 stroke="#6adc8c" strokeWidth={2.5} dot={{ r: 4, fill: "#6adc8c" }} />
                <Line type="monotone" dataKey="nb"  name="Naive Bayes"         stroke="#c8c46a" strokeWidth={2.5} dot={{ r: 4, fill: "#c8c46a" }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12 }}>
              {[["Logistic Regression","#b06be8"],["SVM","#6adc8c"],["Naive Bayes","#c8c46a"]].map(([n,c]) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9a8ab8" }}>
                  <span style={{ width: 24, height: 3, background: c, borderRadius: 2, display: "inline-block" }} />
                  {n}
                </div>
              ))}
            </div>
          </Card>

          {/* 3-class distribution */}
          <Card>
            <SectionTitle sub="From 300,000 tweet sample — VADER labels">
              3-Class Label Distribution
            </SectionTitle>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              {CLASS_DIST.map(c => (
                <div key={c.label} style={{
                  flex: 1, background: `${c.color}12`,
                  border: `1px solid ${c.color}44`,
                  borderRadius: 12, padding: "16px", textAlign: "center",
                }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 800, fontSize: 20, color: c.color, marginBottom: 4 }}>
                    {c.count.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: "#9a8ab8" }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: "#6a5a8a", marginTop: 2 }}>
                    {((c.count / 300000) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={CLASS_DIST} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fill: "#6a5a8a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6a5a8a", fontSize: 10 }} axisLine={false} tickLine={false} />
                 <Tooltip
  cursor={{ fill: "rgba(255,255,255,0.05)" }}
  content={({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { label, count, color } = payload[0].payload;
    return (
      <div style={{
        background: "#1e1226", border: "1px solid #4a3060",
        borderRadius: 8, padding: "10px 14px", fontSize: 12,
        color: "#e0d6f0", boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}>
        <span style={{ color, fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>
          {label}
        </span>
        <div style={{ color: "#a090c0", marginTop: 3 }}>
          count : {count.toLocaleString()}
        </div>
      </div>
    );
  }}
/>
                <Bar dataKey="count" radius={[6,6,0,0]}>
                  {CLASS_DIST.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Prediction History — full width in left column */}
          <PredictionHistory />

        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Binary predictor */}
          <PredictBox
            title="Binary Prediction"
            endpoint="/predict-binary"
            description="Positive | Negative"
            btnColor="linear-gradient(135deg,#8040d0,#b06be8)"
            btnShadow="0 4px 20px rgba(140,60,200,0.4)"
          />

          {/* 3-class predictor */}
          <PredictBox
            title="3-Class Prediction"
            endpoint="/predict-3class"
            description="Positive | Neutral | Negative"
            btnColor="linear-gradient(135deg,#1e3a8a,#3b82f6)"
            btnShadow="0 4px 20px rgba(59,130,246,0.35)"
          />

          {/* Keywords importance */}
          <Card>
            <SectionTitle sub="TF-IDF Logistic Regression coefficients">
              Top Predictive Words
            </SectionTitle>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["positive","negative"].map(t => (
                <button key={t} onClick={() => setKwTab(t)} style={{
                  flex: 1, padding: "6px", borderRadius: 8, border: "1px solid",
                  borderColor: kwTab === t ? sentColors[t] : "rgba(140,80,200,0.2)",
                  background: kwTab === t ? `${sentColors[t]}18` : "transparent",
                  color: kwTab === t ? sentColors[t] : "#8a7aaa",
                  fontWeight: kwTab === t ? 700 : 400, fontSize: 12,
                  cursor: "pointer", textTransform: "capitalize",
                }}>{t}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {(kwTab === "positive" ? POSITIVE_KEYWORDS : NEGATIVE_KEYWORDS).map(k => (
                <div key={k.word}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#a090c0", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{k.word}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", color: sentColors[kwTab], fontSize: 11 }}>{k.score}</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      width: `${k.score}%`, height: "100%",
                      background: kwTab === "positive"
                        ? "linear-gradient(90deg,#6adc8c,#a0f0b0)"
                        : "linear-gradient(90deg,#e85555,#ff8080)",
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

// ── TAB 2: Binary Models ───────────────────────────────────────────────────
export const BinaryModelsTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <Card>
      <SectionTitle sub="Trained on 1,280,000 tweets · Tested on 320,000 tweets · Sentiment140">
        Binary Classification Results (Positive vs Negative)
      </SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {BINARY_MODELS.map((m, i) => (
          <div key={m.name} style={{
            padding: "18px 20px",
            background: i === 0 ? "rgba(176,107,232,0.08)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${i === 0 ? "#b06be844" : "rgba(140,80,200,0.12)"}`,
            borderRadius: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 700, color: "#e0d6f0", fontSize: 14 }}>{m.name}</span>
                {i === 0 && (
                  <span style={{ marginLeft: 10, fontSize: 10, background: "rgba(176,107,232,0.2)", color: "#b06be8", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                    BEST
                  </span>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 800, fontSize: 22, color: m.color }}>
                  {m.accuracy}%
                </div>
                <div style={{ fontSize: 11, color: "#6a5a8a" }}>
                  {m.wrong.toLocaleString()} wrong / 320,000
                </div>
              </div>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                width: `${m.accuracy}%`, height: "100%",
                background: `linear-gradient(90deg,${m.color}99,${m.color})`,
                borderRadius: 4,
              }} />
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <SectionTitle sub="GridSearchCV on Logistic Regression — 3-fold, 8 candidates">
        Hyperparameter Tuning Result
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {GRIDSEARCH_RESULTS.map(s => (
          <div key={s.label} style={{
            background: "rgba(140,60,200,0.08)", border: "1px solid rgba(140,80,200,0.2)",
            borderRadius: 12, padding: "16px", textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "#6a5a8a", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 800, fontSize: 18, color: "#d0a0ff", marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: "#8a7aaa" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ── TAB 3: 3-Class Models ──────────────────────────────────────────────────
export const ThreeClassTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <Card>
      <SectionTitle sub="Trained on 240,000 tweets · Tested on 60,000 · VADER-labelled neutral class">
        3-Class Results (Positive / Neutral / Negative)
      </SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {THREECLASS_MODELS.map((m, i) => (
          <div key={m.name} style={{
            padding: "18px 20px",
            background: i === 0 ? "rgba(106,220,140,0.06)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${i === 0 ? "#6adc8c44" : "rgba(140,80,200,0.12)"}`,
            borderRadius: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 700, color: "#e0d6f0", fontSize: 14 }}>{m.name}</span>
                {i === 0 && (
                  <span style={{ marginLeft: 10, fontSize: 10, background: "rgba(106,220,140,0.15)", color: "#6adc8c", padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>
                    BEST
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 800, fontSize: 22, color: m.color }}>
                {m.accuracy}%
              </div>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                width: `${m.accuracy}%`, height: "100%",
                background: `linear-gradient(90deg,${m.color}88,${m.color})`,
                borderRadius: 4,
              }} />
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <SectionTitle sub="Logistic Regression — Classification Report on 60,000 test samples">
        Per-Class Performance
      </SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {PER_CLASS_STATS.map(c => (
          <div key={c.label} style={{
            background: `${c.color}0e`, border: `1px solid ${c.color}33`,
            borderRadius: 14, padding: "18px",
          }}>
            <div style={{ fontWeight: 700, color: c.color, marginBottom: 12, fontSize: 14 }}>{c.label}</div>
            {[["Precision", c.precision], ["Recall", c.recall], ["F1 Score", c.f1]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9a8ab8", marginBottom: 4 }}>
                  <span>{k}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", color: c.color }}>{v}%</span>
                </div>
                <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${v}%`, height: "100%", background: c.color, borderRadius: 3, opacity: 0.7 }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ── TAB 4: Error Analysis ──────────────────────────────────────────────────
export const ErrorAnalysisTab = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
      {WRONG_PREDICTIONS.map(w => (
        <Card key={w.name}>
          <div style={{ fontSize: 12, color: "#8a7aaa", marginBottom: 8 }}>{w.name}</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontWeight: 800, fontSize: 26, color: "#e85555", marginBottom: 6 }}>
            {w.count.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "#6a5a8a" }}>{w.desc}</div>
        </Card>
      ))}
    </div>

    <Card>
      <SectionTitle sub="Real misclassified samples from Logistic Regression on test set">
        Misclassified Tweet Examples
      </SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MISCLASSIFIED.map((m, i) => (
          <div key={i} style={{
            background: "rgba(232,85,85,0.06)", border: "1px solid rgba(232,85,85,0.2)",
            borderRadius: 12, padding: "16px",
          }}>
            <p style={{ margin: "0 0 10px", fontSize: 13, color: "#d0c0e0", lineHeight: 1.5, fontStyle: "italic" }}>
              "{m.tweet}"
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span style={{ color: "#6a5a8a" }}>True label:</span>
                <Badge s={m.trueLabel} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span style={{ color: "#6a5a8a" }}>Predicted:</span>
                <Badge s={m.predicted} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <SectionTitle sub="Binary classification — best model (Logistic Regression tuned)">
        Error Rate Breakdown
      </SectionTitle>
      {ERROR_BREAKDOWN.map(e => (
        <div key={e.label} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#a090c0", marginBottom: 5 }}>
            <span style={{ fontWeight: 600 }}>{e.label}</span>
            <span style={{ fontFamily: "'Space Mono',monospace", color: e.color }}>{e.val}%</span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              width: `${e.val}%`, height: "100%",
              background: e.color, borderRadius: 4, opacity: 0.8,
            }} />
          </div>
        </div>
      ))}
    </Card>
  </div>
);
