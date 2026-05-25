// ══════════════════════════════════════════════════════════════════════════
//  components/UI.jsx — Shared reusable UI components
// ══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { API_BASE } from "../constants";

// ── Badge ──────────────────────────────────────────────────────────────────
export const Badge = ({ s }) => {
  const cfg = {
    positive: { bg: "rgba(100,220,140,0.15)", color: "#6adc8c", label: "✦ Positive" },
    neutral:  { bg: "rgba(200,180,100,0.15)", color: "#c8c46a", label: "◆ Neutral"  },
    negative: { bg: "rgba(220,80,80,0.15)",   color: "#e85555", label: "✕ Negative" },
  }[s] ?? { bg: "rgba(255,255,255,0.05)", color: "#aaa", label: s };

  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}44`, padding: "3px 12px",
      borderRadius: 20, fontSize: 11, fontWeight: 700,
      letterSpacing: 0.5, whiteSpace: "nowrap",
    }}>
      {cfg.label}
    </span>
  );
};

// ── Card ───────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {} }) => (
  <div style={{
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(140,80,200,0.2)",
    borderRadius: 16, padding: "22px 24px",
    backdropFilter: "blur(10px)", ...style,
  }}>
    {children}
  </div>
);

// ── Section Title ──────────────────────────────────────────────────────────
export const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 14 }}>
    <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#e0d6f0" }}>
      {children}
    </h2>
    {sub && (
      <div style={{ fontSize: 11, color: "#6a5a8a", marginTop: 3 }}>{sub}</div>
    )}
  </div>
);

// ── Custom Recharts Tooltip ────────────────────────────────────────────────
export const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e1226", border: "1px solid #4a3060", borderRadius: 12,
      padding: "12px 16px", fontSize: 13, color: "#e0d6f0",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <div style={{ fontWeight: 800, marginBottom: 8, color: "#fff", fontSize: 14 }}>
        {label}
      </div>
      {payload.map(p => (
        <div key={p.name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          <span style={{ width: 120, fontSize: 12 }}>{p.name}</span>
          <span style={{ fontWeight: 700, color: p.color, fontFamily: "'Space Mono',monospace" }}>
            {p.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Predict Box ────────────────────────────────────────────────────────────
export const PredictBox = ({ title, endpoint, description, btnColor, btnShadow }) => {
  const [input,   setInput]   = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const normalizeSentiment = (s) =>
    ({ positive: "positive", negative: "negative", neutral: "neutral" }[s?.toLowerCase()] ?? "neutral");

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(normalizeSentiment(data.sentiment));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ border: "1px solid rgba(140,80,200,0.38)" }}>
      <SectionTitle sub={`Flask → POST ${endpoint}`}>{title}</SectionTitle>

      {/* Endpoint label */}
      <div style={{
        fontSize: 11, color: "#8a7aaa", marginBottom: 12,
        fontFamily: "'Space Mono',monospace",
        background: "rgba(255,255,255,0.04)", padding: "5px 9px", borderRadius: 6,
      }}>
        returns → {description}
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) run(); }}
        placeholder='e.g. "I love this!" or "This is terrible"'
        style={{
          width: "100%", minHeight: 82,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(140,80,200,0.25)",
          borderRadius: 10, color: "#e0d6f0",
          fontSize: 13, padding: "10px 12px",
          resize: "vertical", fontFamily: "inherit",
          lineHeight: 1.5, marginBottom: 10, outline: "none",
        }}
      />

      {/* Result badge */}
      {result && (
        <div style={{ marginBottom: 10, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          <Badge s={result} />
          <span style={{ fontSize: 11, color: "#6a5a8a" }}>via Sentiment140-trained model</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginBottom: 10, padding: "8px 12px", borderRadius: 8,
          background: "rgba(232,85,85,0.1)", border: "1px solid #e8555544",
          fontSize: 12, color: "#e85555",
        }}>
          ⚠ {error} — is Flask running on port 5000?
        </div>
      )}

      {/* Button */}
      <button
        onClick={run}
        disabled={loading || !input.trim()}
        style={{
          width: "100%", padding: "11px",
          background: loading ? "rgba(140,60,200,0.2)" : btnColor,
          border: "none", borderRadius: 10,
          color: "#fff", fontWeight: 700, fontSize: 13.5,
          cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          transition: "all 0.2s", opacity: !input.trim() ? 0.5 : 1,
          boxShadow: loading ? "none" : btnShadow,
        }}
      >
        {loading ? "Analyzing…" : "→ Analyze"}
      </button>
      <div style={{ fontSize: 11, color: "#6a5a8a", textAlign: "center", marginTop: 6 }}>
        Ctrl+Enter to submit
      </div>
    </Card>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────
export const Sidebar = ({ backendOnline }) => (
  <aside style={{
    width: 215, background: "rgba(18,10,30,0.94)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(100,60,140,0.25)",
    display: "flex", flexDirection: "column",
    padding: "28px 16px",
    position: "sticky", top: 0, height: "100vh",
    zIndex: 10, flexShrink: 0,
  }}>
    {/* Logo */}
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingLeft: 6 }}>
      <div style={{
        width: 34, height: 34,
        background: "linear-gradient(135deg,#b06be8,#6c3bcc)",
        borderRadius: 9, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 18,
        boxShadow: "0 0 22px rgba(176,107,232,0.55)",
      }}>🪶</div>
      <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: "#fff" }}>
        Tweetalyze
      </span>
    </div>

    {/* Flask status pill */}
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "7px 12px", borderRadius: 8, marginBottom: 20,
      background: backendOnline === true  ? "rgba(106,220,140,0.1)"
                : backendOnline === false ? "rgba(232,85,85,0.1)"
                : "rgba(255,255,255,0.05)",
      border: `1px solid ${
        backendOnline === true  ? "#6adc8c44"
      : backendOnline === false ? "#e8555544"
      : "#ffffff22"}`,
      fontSize: 11, fontWeight: 600,
      color: backendOnline === true  ? "#6adc8c"
           : backendOnline === false ? "#e85555"
           : "#8a7aaa",
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%", display: "inline-block",
        background: backendOnline === true  ? "#6adc8c"
                  : backendOnline === false ? "#e85555"
                  : "#8a7aaa",
        animation: backendOnline === null ? "pulse 1.5s infinite" : "none",
      }} />
      {backendOnline === null ? "Connecting…"
     : backendOnline         ? "Flask Online ✓"
     :                         "Flask Offline ✗"}
    </div>

    {/* Dashboard nav item */}
    <nav>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 10,
        background: "linear-gradient(90deg,rgba(140,60,200,0.35),rgba(100,40,160,0.2))",
        color: "#c89cf0", fontWeight: 700, fontSize: 13.5,
        borderLeft: "3px solid #a060e0",
      }}>
        <span style={{ fontSize: 15 }}>⊞</span> Dashboard
      </div>
    </nav>

    {/* Dataset info */}
    <div style={{
      marginTop: "auto", padding: "14px", borderRadius: 12,
      background: "rgba(140,60,200,0.08)", border: "1px solid rgba(140,80,200,0.2)",
      fontSize: 11,
    }}>
      <div style={{ fontWeight: 700, color: "#c89cf0", marginBottom: 8, fontSize: 12 }}>
        📊 Dataset Info
      </div>
      <div style={{ color: "#9a8ab8", marginBottom: 4 }}>Sentiment140</div>
      <div style={{ color: "#9a8ab8", marginBottom: 4 }}>Emoji Sentiment data</div>
      <div style={{ color: "#6a5a8a", marginBottom: 4 }}>1,600,000 tweets</div>
      <div style={{ color: "#6a5a8a", marginBottom: 4 }}>5,000 TF-IDF features</div>
      <div style={{ color: "#6a5a8a" }}>Unigrams + Bigrams</div>
    </div>
  </aside>
);
