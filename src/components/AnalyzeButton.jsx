import "./AnalyzeButton.css";

export default function AnalyzeButton({ onClick, isAnalyzing }) {
  return (
    <div className="analyze-btn-wrap">
      <button
        type="button"
        className={`analyze-btn${isAnalyzing ? " analyze-btn--loading" : ""}`}
        onClick={onClick}
        disabled={isAnalyzing}
        aria-busy={isAnalyzing}
        aria-label={isAnalyzing ? "Analyzing layout, please wait" : "Analyze layout"}
      >
        {isAnalyzing ? (
          <>
            <span className="analyze-btn__spinner" aria-hidden="true" />
            Analyzing layout…
          </>
        ) : (
          <>
            <span className="analyze-btn__icon" aria-hidden="true">
              ✦
            </span>
            Analyze layout
          </>
        )}
      </button>
    </div>
  );
}
