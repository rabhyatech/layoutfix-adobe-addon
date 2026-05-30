import "./IssueCard.css";

const SEVERITY_LABELS = {
  high: "Critical",
  medium: "Warning",
  low: "Note",
};

export default function IssueCard({ issue }) {
  const { severity, title, detail, suggestion, categoryLabel } = issue;
  const badge = SEVERITY_LABELS[severity] ?? severity;

  return (
    <article className={`issue-card issue-card--${severity}`}>
      <div className="issue-card__tags">
        {categoryLabel && (
          <span className="issue-card__category">{categoryLabel}</span>
        )}
        <span className="issue-card__badge">{badge}</span>
      </div>
      <div className="issue-card__body">
        <h3 className="issue-card__title">{title}</h3>
        <p className="issue-card__detail">{detail}</p>
        {suggestion && (
          <p className="issue-card__suggestion">
            <span>Fix:</span> {suggestion}
          </p>
        )}
      </div>
    </article>
  );
}
