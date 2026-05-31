import { useState, useEffect } from "react";
import "./AnalyzingOverlay.css";

const STEPS = [
  "Reading image dimensions…",
  "Checking spacing rhythm…",
  "Measuring alignment…",
  "Evaluating hierarchy…",
  "Testing contrast…",
];

export default function AnalyzingOverlay({ previewUrl, fileName }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analyzing-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="analyzing-overlay__card">
        {previewUrl && (
          <div className="analyzing-overlay__preview">
            <img src={previewUrl} alt="" aria-hidden="true" />
            <div className="analyzing-overlay__scan" aria-hidden="true" />
            <div className="analyzing-overlay__grid-lines" aria-hidden="true" />
          </div>
        )}
        <div className="analyzing-overlay__content">
          <div className="analyzing-overlay__spinner" aria-hidden="true" />
          <h2 className="analyzing-overlay__title">Analyzing layout</h2>
          {fileName && (
            <p className="analyzing-overlay__file">{fileName}</p>
          )}
          <p className="analyzing-overlay__step">{STEPS[stepIndex]}</p>
          <div className="analyzing-overlay__progress" aria-hidden="true">
            <div className="analyzing-overlay__progress-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
