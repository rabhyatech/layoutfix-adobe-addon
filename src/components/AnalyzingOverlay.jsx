import { useState, useEffect, useRef } from "react";
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
  const dialogRef = useRef(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="analyzing-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analyzing-title"
      aria-describedby="analyzing-step"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="analyzing-overlay__card">
        {previewUrl && (
          <div className="analyzing-overlay__preview" aria-hidden="true">
            <img src={previewUrl} alt="" />
            <div className="analyzing-overlay__scan" />
            <div className="analyzing-overlay__grid-lines" />
          </div>
        )}
        <div className="analyzing-overlay__content">
          <div className="analyzing-overlay__spinner" aria-hidden="true" />
          <h2 id="analyzing-title" className="analyzing-overlay__title">
            Analyzing layout
          </h2>
          {fileName && (
            <p className="analyzing-overlay__file">{fileName}</p>
          )}
          <p id="analyzing-step" className="analyzing-overlay__step" aria-live="polite">
            {STEPS[stepIndex]}
          </p>
          <div
            className="analyzing-overlay__progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Analysis in progress"
            aria-valuetext={STEPS[stepIndex]}
          >
            <div className="analyzing-overlay__progress-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
