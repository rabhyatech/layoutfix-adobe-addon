const SPACING_ISSUES = [
  {
    severity: "high",
    title: "Inconsistent section padding",
    detail: "Vertical gaps jump between 24px, 32px, and 48px with no clear spacing scale.",
    suggestion: "Define a spacing token scale (8, 16, 24, 32, 48) and apply consistently.",
  },
  {
    severity: "medium",
    title: "Elements off the 8px grid",
    detail: "Several components sit on odd pixel values (e.g. 13px, 27px) breaking rhythm.",
    suggestion: "Snap margins and padding to multiples of 8px.",
  },
  {
    severity: "low",
    title: "Tight line-height in body blocks",
    detail: "Paragraph clusters feel cramped — line-height appears below 1.5.",
    suggestion: "Use 1.5–1.65 line-height for body copy at this font size.",
  },
];

const ALIGNMENT_ISSUES = [
  {
    severity: "high",
    title: "Column edges drift from grid",
    detail: "Two content columns are offset by ~6px from the main layout grid.",
    suggestion: "Align all column edges to a shared 12-column grid.",
  },
  {
    severity: "medium",
    title: "Icon-text pairs misaligned",
    detail: "Icons sit 2–3px above their label baselines in list items.",
    suggestion: "Center icons vertically with flexbox and consistent gap tokens.",
  },
  {
    severity: "low",
    title: "Button group baseline shift",
    detail: "Secondary button sits 4px lower than the primary action.",
    suggestion: "Use equal height and vertical-align on button pairs.",
  },
];

const HIERARCHY_ISSUES = [
  {
    severity: "high",
    title: "Heading levels too similar",
    detail: "H2 and H3 differ by only 4px — scan patterns become unclear.",
    suggestion: "Increase the size step between heading levels to at least 8px.",
  },
  {
    severity: "medium",
    title: "Primary CTA lacks dominance",
    detail: "The main action competes visually with secondary links in the hero.",
    suggestion: "Increase CTA size, contrast, or whitespace to establish a clear focal point.",
  },
  {
    severity: "low",
    title: "Metadata matches label weight",
    detail: "Timestamps and captions use the same font weight as field labels.",
    suggestion: "Drop metadata to regular weight and a muted color token.",
  },
];

const CONTRAST_ISSUES = [
  {
    severity: "high",
    title: "Body text fails contrast check",
    detail: "Gray body copy on the tinted background appears below WCAG AA (4.5:1).",
    suggestion: "Darken body text or lighten the surface to meet 4.5:1 contrast.",
  },
  {
    severity: "medium",
    title: "Placeholder text too light",
    detail: "Input placeholders are nearly invisible against the field background.",
    suggestion: "Use a placeholder color at least 3:1 against the input background.",
  },
  {
    severity: "low",
    title: "Border color too subtle",
    detail: "Card borders blend into the background, reducing structural clarity.",
    suggestion: "Increase border contrast or add a subtle shadow for separation.",
  },
];

const CATEGORY_META = {
  spacing: { label: "Spacing", color: "var(--accent-amber)", pool: SPACING_ISSUES },
  alignment: { label: "Alignment", color: "var(--accent-teal)", pool: ALIGNMENT_ISSUES },
  hierarchy: { label: "Hierarchy", color: "var(--accent-coral)", pool: HIERARCHY_ISSUES },
  contrast: { label: "Contrast", color: "var(--accent-blue)", pool: CONTRAST_ISSUES },
};

function hashSeed(input) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function createRng(seed) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return ((s >>> 0) / 4294967296);
  };
}

function clamp(n, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n));
}

function scoreForCategory(rng, base, penalty = 0) {
  return clamp(Math.round(base - penalty + (rng() - 0.5) * 18));
}

function pickIssue(rng, pool, score) {
  const index =
    score < 50 ? 0 : score < 70 ? Math.min(1, pool.length - 1) : pool.length - 1;
  const variance = rng() > 0.5 ? 0 : Math.min(index + 1, pool.length - 1);
  return pool[variance];
}

function severityFromScore(score) {
  if (score < 50) return "high";
  if (score < 70) return "medium";
  return "low";
}

export default function generateMockAnalysis({ width, height, fileSize, fileName = "" }) {
  const seed = hashSeed(`${fileName}-${width}x${height}-${fileSize}`);
  const rng = createRng(seed);

  const aspect = width / height;
  const isWide = aspect > 1.6;
  const isTall = aspect < 0.75;
  const isLowRes = width < 800 || height < 600;
  const isHeavy = fileSize > 4 * 1024 * 1024;

  const penalties = {
    spacing: (isLowRes ? 12 : 0) + (isTall ? 6 : 0),
    alignment: (isWide ? 10 : 0) + (isTall ? 8 : 0),
    hierarchy: (isWide ? 14 : 0) + (isLowRes ? 8 : 0),
    contrast: isLowRes ? 16 : isHeavy ? 6 : 0,
  };

  const bases = {
    spacing: 78 - (isWide ? 5 : 0),
    alignment: 80 - (isTall ? 6 : 0),
    hierarchy: 76 - (isWide ? 8 : 0),
    contrast: 82 - (isLowRes ? 10 : 0),
  };

  const scores = {};
  const metrics = [];
  const issues = [];

  for (const [key, meta] of Object.entries(CATEGORY_META)) {
    const value = scoreForCategory(rng, bases[key], penalties[key]);
    scores[key] = value;
    metrics.push({ label: meta.label, value, color: meta.color, category: key });

    if (value < 85) {
      const template = pickIssue(rng, meta.pool, value);
      issues.push({
        id: `${key}-${template.title.toLowerCase().replace(/\s+/g, "-")}`,
        category: key,
        categoryLabel: meta.label,
        severity: severityFromScore(value),
        title: template.title,
        detail: template.detail,
        suggestion: template.suggestion,
      });
    }
  }

  if (isLowRes) {
    issues.unshift({
      id: "meta-resolution",
      category: "spacing",
      categoryLabel: "Spacing",
      severity: "high",
      title: "Low resolution limits analysis",
      detail: `Image is ${width}×${height}px — fine spacing detail may be missed.`,
      suggestion: "Re-export at 2× scale for more accurate spacing checks.",
    });
  }

  const score = clamp(Math.round(
    (scores.spacing + scores.alignment + scores.hierarchy + scores.contrast) / 4
  ));

  const summary =
    score >= 80
      ? "Strong layout foundation. Minor tweaks in the flagged areas will polish the design."
      : score >= 65
        ? "Solid structure with room to improve spacing consistency and visual hierarchy."
        : score >= 50
          ? "Several layout fundamentals need attention before this design is production-ready."
          : "Multiple critical layout issues detected — review spacing, alignment, and contrast.";

  return {
    score,
    summary,
    metrics,
    issues,
    meta: { width, height, aspect: aspect.toFixed(2) },
  };
}
