import { useState, useEffect } from "react";
import { prefersReducedMotion } from "../utils/motion";
import "./ScoreMeter.css";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function ScoreMeter({
  score,
  label = "Layout score",
  size = "large",
  color,
  animate = true,
  duration = 1400,
}) {
  const target = Math.min(100, Math.max(0, score));
  const shouldAnimate = animate && !prefersReducedMotion();
  const [display, setDisplay] = useState(shouldAnimate ? 0 : target);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplay(target);
      return;
    }

    setDisplay(0);
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, shouldAnimate, duration]);

  const offset = CIRCUMFERENCE - (display / 100) * CIRCUMFERENCE;
  const grade =
    target >= 80 ? "Great" : target >= 65 ? "Good" : target >= 50 ? "Fair" : "Needs work";
  const ariaLabel = `${label}: ${target} out of 100, ${grade}`;

  return (
    <div
      className={`score-meter score-meter--${size}`}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="score-meter__ring-wrap">
        <svg className="score-meter__svg" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="score-meter__track" cx="60" cy="60" r={RADIUS} fill="none" />
          <circle
            className="score-meter__fill"
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={color ? { stroke: color } : undefined}
          />
        </svg>
        <div className="score-meter__value-wrap" aria-hidden="true">
          <span className="score-meter__value">{display}</span>
          {size === "large" && (
            <span className="score-meter__grade">{grade}</span>
          )}
        </div>
      </div>
      {label && <span className="score-meter__label">{label}</span>}
    </div>
  );
}
