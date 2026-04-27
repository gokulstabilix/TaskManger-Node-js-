import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, RefreshCw, Lightbulb, TrendingUp } from "lucide-react";
import { taskService } from "../services/taskService";
import "./AISummaryCard.css";

/**
 * Renders a markdown-like summary string into styled JSX.
 * Handles **bold**, line breaks, and tip paragraphs.
 */
function renderSummary(text) {
  if (!text) return null;

  // Split into paragraphs
  const paragraphs = text.split("\n\n").filter(Boolean);

  return paragraphs.map((para, pIdx) => {
    const isTip = para.toLowerCase().startsWith("**tip");
    const lines = para.split("\n");

    const renderInline = (line, lIdx) => {
      // Replace **bold** with <strong>
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={lIdx}>
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={i} className="ai-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    };

    if (isTip) {
      return (
        <div key={pIdx} className="ai-tip-block">
          <div className="ai-tip-icon">
            <Lightbulb size={14} />
          </div>
          <p className="ai-tip-text">
            {lines.map((line, li) => (
              <React.Fragment key={li}>
                {renderInline(line, li)}
                {li < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      );
    }

    return (
      <p key={pIdx} className="ai-para">
        {lines.map((line, li) => (
          <React.Fragment key={li}>
            {renderInline(line, li)}
            {li < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

export const AISummaryCard = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAISummary();
      setSummary(data.summary || "");
      setHasLoaded(true);
    } catch (err) {
      setError("Could not load AI summary. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="ai-card" role="region" aria-label="AI Task Summary">
      {/* Animated background blobs */}
      <div className="ai-blob ai-blob-1" aria-hidden="true" />
      <div className="ai-blob ai-blob-2" aria-hidden="true" />

      {/* Header */}
      <div className="ai-header">
        <div className="ai-badge">
          <Sparkles size={14} className="ai-badge-icon" />
          <span>AI Insights</span>
        </div>
        <button
          id="ai-summary-refresh-btn"
          className={`ai-refresh-btn ${loading ? "ai-refresh-spinning" : ""}`}
          onClick={fetchSummary}
          disabled={loading}
          title="Refresh AI summary"
          aria-label="Refresh AI summary"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="ai-title-row">
        <TrendingUp size={20} className="ai-title-icon" />
        <h2 className="ai-title">Your Progress at a Glance</h2>
      </div>

      {/* Content */}
      <div className="ai-content">
        {loading && !hasLoaded && (
          <div className="ai-skeleton-wrap">
            <div className="ai-skeleton ai-skeleton-lg" />
            <div className="ai-skeleton ai-skeleton-md" />
            <div className="ai-skeleton ai-skeleton-sm" />
            <div className="ai-skeleton-tip">
              <div className="ai-skeleton ai-skeleton-md" />
              <div className="ai-skeleton ai-skeleton-sm" />
            </div>
          </div>
        )}

        {loading && hasLoaded && (
          <div className="ai-refreshing">
            <div className="ai-spinner" aria-hidden="true" />
            <span>Refreshing insights…</span>
          </div>
        )}

        {!loading && error && (
          <div className="ai-error" role="alert">
            <span>{error}</span>
            <button className="ai-retry-btn" onClick={fetchSummary}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && summary && (
          <div className="ai-summary-body">{renderSummary(summary)}</div>
        )}
      </div>

      {/* Footer glow line */}
      <div className="ai-footer-line" aria-hidden="true" />
    </div>
  );
};
