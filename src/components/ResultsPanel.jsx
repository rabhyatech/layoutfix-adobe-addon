import { useState, useEffect } from "react";
import ScoreMeter from "./ScoreMeter";
import IssueCard from "./IssueCard";
import { exportReportAsJson, exportReportAsText } from "../utils/exportReport";
import "./ResultsPanel.css";

function MetricBar({ value, color, delay = 0 }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 80 + delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="results-panel__metric-bar">
      <div
        className="results-panel__metric-fill"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}

export default function ResultsPanel({ results, previewUrl, fileName, onReset }) {
  const [visible, setVisible] = useState(false);
  const [exportMsg, setExportMsg] = useState(null);

  useEffect(() => {
    setVisible(false);
    const timer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(timer);
  }, [results]);

  const handleExport = (format) => {
    if (format === "json") {
      exportReportAsJson(results, fileName);
    } else {
      exportReportAsText(results, fileName);
    }
    setExportMsg(`Report exported as ${format.toUpperCase()}`);
    setTimeout(() => setExportMsg(null), 3000);
  };

  return (
    <section className={`results-panel${visible ? " results-panel--visible" : ""}`}>
      <div className="results-panel__header">
        <div>
          <p className="results-panel__eyebrow">Analysis complete</p>
          <h2 className="results-panel__title">Layout report</h2>
          {results.meta && (
            <p className="results-panel__meta">
              {results.meta.width}×{results.meta.height}px · aspect {results.meta.aspect}
            </p>
          )}
        </div>
        <div className="results-panel__actions">
          <button
            type="button"
            className="results-panel__btn results-panel__btn--secondary"
            onClick={() => handleExport("txt")}
          >
            Export report
          </button>
          <button
            type="button"
            className="results-panel__btn results-panel__btn--primary"
            onClick={onReset}
          >
            Analyze Another Design
          </button>
        </div>
      </div>

      {exportMsg && (
        <p className="results-panel__toast" role="status">{exportMsg}</p>
      )}

      <div className="results-panel__grid">
        {previewUrl && (
          <div className="results-panel__preview">
            <img src={previewUrl} alt="Analyzed design" />
          </div>
        )}

        <div className="results-panel__content">
          <div className="results-panel__score-block">
            <ScoreMeter
              score={results.score}
              label="Overall layout score"
              size="large"
              animate
              duration={1600}
            />
            <p className="results-panel__summary">{results.summary}</p>
          </div>

          <div className="results-panel__metrics">
            <h3 className="results-panel__section-title">Breakdown</h3>
            <div className="results-panel__metrics-grid">
              {results.metrics.map((m, i) => (
                <div key={m.category} className="results-panel__metric">
                  <ScoreMeter
                    score={m.value}
                    label={m.label}
                    size="small"
                    color={m.color}
                    animate
                    duration={1200 + i * 150}
                  />
                  <MetricBar value={m.value} color={m.color} delay={i * 120} />
                </div>
              ))}
            </div>
          </div>

          <div className="results-panel__issues">
            <h3 className="results-panel__section-title">
              Issues found ({results.issues.length})
            </h3>
            {results.issues.length === 0 ? (
              <div className="results-panel__empty">
                <span className="results-panel__empty-icon" aria-hidden="true">✓</span>
                <p className="results-panel__empty-title">No issues detected</p>
                <p className="results-panel__empty-text">
                  Your layout scored well across spacing, alignment, hierarchy, and contrast.
                </p>
              </div>
            ) : (
              <ul className="results-panel__issues-list">
                {results.issues.map((issue, i) => (
                  <li
                    key={issue.id}
                    className="results-panel__issue-item"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <IssueCard issue={issue} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="results-panel__footer-actions">
            <button
              type="button"
              className="results-panel__btn results-panel__btn--ghost"
              onClick={() => handleExport("json")}
            >
              Download JSON
            </button>
            <button
              type="button"
              className="results-panel__btn results-panel__btn--primary results-panel__btn--full-mobile"
              onClick={onReset}
            >
              Analyze Another Design
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
