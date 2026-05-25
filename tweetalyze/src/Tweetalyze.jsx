// ══════════════════════════════════════════════════════════════════════════
//  Tweetalyze.jsx — Main entry point (clean & minimal)
//  Just wires together: Sidebar + Tabs + layout
// ══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";

import { Sidebar }                                          from "./components/UI";
import { OverviewTab, BinaryModelsTab, ThreeClassTab, ErrorAnalysisTab } from "./components/Tabs";
import { API_BASE, TABS }                                   from "./constants";

export default function Tweetalyze() {
  const [activeTab,     setActiveTab]     = useState("Overview");
  const [backendOnline, setBackendOnline] = useState(null);

  // Check Flask health on mount
  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then(r  => r.ok ? setBackendOnline(true) : setBackendOnline(false))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#0e0818",
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      color: "#e0d6f0", position: "relative", overflow: "hidden",
    }}>

      {/* ── Animated starfield background ── */}
      <Starfield />

      {/* ── Global CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700;800&family=Space+Mono:wght@400;700&display=swap');
        @keyframes twinkle    { from{opacity:0.05} to{opacity:0.4} }
        @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes fadeSlide  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar       { width: 4px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: #4a3060; border-radius: 4px }
        * { box-sizing: border-box }
      `}</style>

      {/* ── Sidebar ── */}
      <Sidebar backendOnline={backendOnline} />

      {/* ── Main content ── */}
      <main style={{ flex: 1, overflowY: "auto", zIndex: 1, padding: "28px 24px" }}>

        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 23, fontWeight: 800, color: "#fff", margin: 0 }}>
            Twitter Sentiment Analysis
          </h1>
          <div style={{ fontSize: 12, color: "#6a5a8a", marginTop: 3 }}>
            Sentiment140 Dataset, Emoji Sentiment Data · 1.6M tweets · TF-IDF + ML
          </div>
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "8px 18px", borderRadius: 10, border: "1px solid",
              borderColor: activeTab === t ? "#a060e0" : "rgba(140,80,200,0.25)",
              background:  activeTab === t ? "rgba(140,60,200,0.3)" : "transparent",
              color:       activeTab === t ? "#d0a0ff" : "#8a7aaa",
              fontWeight:  activeTab === t ? 700 : 400,
              fontSize: 13, cursor: "pointer", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>

        {/* Tab content — each tab is its own component */}
        {activeTab === "Overview"       && <OverviewTab />}
        {activeTab === "Binary Models"  && <BinaryModelsTab />}
        {activeTab === "3-Class Models" && <ThreeClassTab />}
        {activeTab === "Error Analysis" && <ErrorAnalysisTab />}

      </main>
    </div>
  );
}

// ── Starfield (extracted to keep main component clean) ─────────────────────
const Starfield = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
    {Array.from({ length: 55 }).map((_, i) => (
      <div key={i} style={{
        position: "absolute",
        width:  Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        background: "#fff", borderRadius: "50%",
        top:  `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.35 + 0.05,
        animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
        animationDelay: `${Math.random() * 4}s`,
      }} />
    ))}
  </div>
);
