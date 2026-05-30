import ScoreMeter from "./ScoreMeter";
import IssueCard from "./IssueCard";
import "./ResultsPanel.css";

export default function ResultsPanel({ results, previewUrl, onReset }) {
  return (
    <section className="results-panel">
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
        <button type="button" className="results-panel__reset" onClick={onReset}>
          New upload
        </button>
      </div>

      <div className="results-panel__grid">
        {previewUrl && (
          <div className="results-panel__preview">
            <img src={previewUrl} alt="Analyzed design" />
          </div>
        )}

        <div className="results-panel__content">
          <div className="results-panel__score-block">
            <ScoreMeter score={results.score} label="Overall layout score" size="large" />
            <p className="results-panel__summary">{results.summary}</p>
          </div>

          <div className="results-panel__metrics">
            <h3 className="results-panel__section-title">Breakdown</h3>
            <div className="results-panel__metrics-grid">
              {results.metrics.map((m) => (
                <div key={m.label} className="results-panel__metric">
                  <ScoreMeter
                    score={m.value}
                    label={m.label}
                    size="small"
                    color={m.color}
                  />
                  <div className="results-panel__metric-bar">
                    <div
                      className="results-panel__metric-fill"
                      style={{ width: `${m.value}%`, background: m.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="results-panel__issues">
            <h3 className="results-panel__section-title">
              Issues found ({results.issues.length})
            </h3>
            <ul className="results-panel__issues-list">
              {results.issues.map((issue) => (
                <li key={issue.id}>
                  <IssueCard issue={issue} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
