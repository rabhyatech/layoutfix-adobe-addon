import "./Hero.css";

const STEPS = [
  { num: "01", title: "Upload", text: "Drop a screenshot or UI mockup" },
  { num: "02", title: "Analyze", text: "AI checks spacing, alignment & hierarchy" },
  { num: "03", title: "Fix", text: "Get a scored report with actionable issues" },
];

export default function Hero() {
  return (
    <section className="hero" id="how-it-works">
      <p className="hero__eyebrow">AI layout analysis</p>
      <h1 className="hero__title">
        Fix layout issues
        <br />
        <span>before they ship</span>
      </h1>
      <p className="hero__subtitle">
        Upload a screenshot or design file and get instant feedback on spacing,
        alignment, hierarchy, and contrast.
      </p>
      <ol className="hero__steps" aria-label="How LayoutFix works">
        {STEPS.map((step) => (
          <li key={step.num} className="hero__step">
            <span className="hero__step-num">{step.num}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
