// ══════════════════════════════════════════════════════════════════════════
//  PredictionHistory.jsx
// ══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { API_BASE } from "../constants";
import { Badge, Card, SectionTitle } from "./UI";

export const PredictionHistory = () => {
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [clearing, setClearing] = useState(false);

  // Fetch history from Flask
  const fetchHistory = async () => {
    try {
      const res  = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error("History fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // Clear history from Flask
  const clearHistory = async () => {
    setClearing(true);
    try {
      await fetch(`${API_BASE}/history/clear`, { method: "DELETE" });
      setHistory([]);
    } catch (e) {
      console.error("Clear failed:", e);
    } finally {
      setClearing(false);
    }
  };

  // Fetch on mount + every 3 seconds (auto-refresh)
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <SectionTitle sub={`${history.length} prediction${history.length !== 1 ? "s" : ""} this session`}>
          Prediction History
        </SectionTitle>

        {/* Clear button */}
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            disabled={clearing}
            style={{
              padding: "6px 14px",
              background: "rgba(232,85,85,0.12)",
              border: "1px solid rgba(232,85,85,0.35)",
              borderRadius: 8, color: "#e85555",
              fontSize: 12, fontWeight: 600,
              cursor: clearing ? "not-allowed" : "pointer",
              opacity: clearing ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            {clearing ? "Clearing…" : "🗑 Clear All"}
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "24px", color: "#6a5a8a", fontSize: 13 }}>
          Loading history…
        </div>
      )}

      {/* Empty state */}
      {!loading && history.length === 0 && (
        <div style={{
          textAlign: "center", padding: "32px 16px",
          color: "#6a5a8a", fontSize: 13,
          border: "1px dashed rgba(140,80,200,0.2)",
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
          No predictions yet — analyze a tweet to get started!
        </div>
      )}

      {/* History list */}
      {!loading && history.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 420, overflowY: "auto" }}>
          {history.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between", gap: 12,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(140,80,200,0.12)",
              borderRadius: 10,
              animation: "fadeSlide 0.3s ease both",
            }}>
              {/* Left — tweet text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: "0 0 6px", fontSize: 13,
                  color: "#c0b0e0", lineHeight: 1.5,
                  wordBreak: "break-word",
                  // Truncate long tweets
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {item.text}
                </p>
                {/* Model type tag */}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: item.model === "Binary" ? "#b06be8" : "#3b82f6",
                  background: item.model === "Binary" ? "rgba(176,107,232,0.1)" : "rgba(59,130,246,0.1)",
                  border: `1px solid ${item.model === "Binary" ? "#b06be833" : "#3b82f633"}`,
                  padding: "2px 7px", borderRadius: 6,
                  fontFamily: "'Space Mono', monospace",
                }}>
                  {item.model}
                </span>
              </div>

              {/* Right — sentiment badge */}
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <Badge s={item.sentiment.toLowerCase()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
