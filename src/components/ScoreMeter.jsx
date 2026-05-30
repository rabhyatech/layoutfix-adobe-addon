import "./ScoreMeter.css";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreMeter({
  score,
  label = "Layout score",
  size = "large",
  color,
}) {
  const clamped = Math.min(100, Math.max(0, score));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const grade =
    clamped >= 80 ? "Great" : clamped >= 65 ? "Good" : clamped >= 50 ? "Fair" : "Needs work";

  return (
    <div className={`score-meter score-meter--${size}`}>
      <div className="score-meter__ring-wrap">
        <svg className="score-meter__svg" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            className="score-meter__track"
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
          />
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
        <div className="score-meter__value-wrap">
          <span className="score-meter__value">{clamped}</span>
          {size === "large" && <span className="score-meter__grade">{grade}</span>}
        </div>
      </div>
      {label && <span className="score-meter__label">{label}</span>}
    </div>
  );
}
