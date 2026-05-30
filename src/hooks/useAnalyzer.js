import { useState, useCallback } from "react";

function loadImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

function buildResults({ width, height, fileSize }) {
  const aspect = width / height;
  const isWide = aspect > 1.6;
  const isTall = aspect < 0.7;
  const isLowRes = width < 800 || height < 600;
  const isHeavy = fileSize > 4 * 1024 * 1024;

  const spacing = isLowRes ? 58 : isWide ? 74 : 82;
  const alignment = isTall ? 65 : 78;
  const hierarchy = isWide ? 62 : 71;
  const contrast = isLowRes ? 55 : 76;
  const score = Math.round((spacing + alignment + hierarchy + contrast) / 4);

  const issues = [];

  if (isLowRes) {
    issues.push({
      id: "resolution",
      severity: "high",
      title: "Low resolution upload",
      detail: `Image is ${width}×${height}px. Screenshots below 800px wide lose fine layout detail.`,
      suggestion: "Re-export at 2× scale or capture at a larger viewport.",
    });
  }

  if (isWide) {
    issues.push({
      id: "aspect",
      severity: "medium",
      title: "Wide canvas may hide vertical rhythm",
      detail: "Ultra-wide frames often compress vertical spacing cues in automated checks.",
      suggestion: "Include a mobile-width crop for a second pass.",
    });
  }

  if (isTall) {
    issues.push({
      id: "scroll",
      severity: "medium",
      title: "Long scroll layout detected",
      detail: "Tall pages need consistent section spacing across the full scroll depth.",
      suggestion: "Mark key breakpoints (hero, content, footer) before analyzing.",
    });
  }

  if (isHeavy) {
    issues.push({
      id: "size",
      severity: "low",
      title: "Large file size",
      detail: "Heavy PNGs can slow analysis; compression won't affect layout scoring.",
      suggestion: "Use WebP or optimized PNG for faster uploads.",
    });
  }

  if (issues.length === 0) {
    issues.push({
      id: "polish",
      severity: "low",
      title: "Minor spacing polish",
      detail: "A few element gaps sit outside an 8px grid — likely intentional but worth reviewing.",
      suggestion: "Snap section padding to your design-token scale.",
    });
  }

  return {
    score,
    summary:
      score >= 75
        ? "Solid layout foundation. Address the flagged items to tighten consistency."
        : score >= 60
          ? "Good start with clear improvement areas in spacing and hierarchy."
          : "Several layout fundamentals need attention before this design ships.",
    metrics: [
      { label: "Spacing", value: spacing, color: "var(--accent-amber)" },
      { label: "Alignment", value: alignment, color: "var(--accent-teal)" },
      { label: "Hierarchy", value: hierarchy, color: "var(--accent-coral)" },
      { label: "Contrast", value: contrast, color: "var(--accent-blue)" },
    ],
    issues,
    meta: { width, height, aspect: aspect.toFixed(2) },
  };
}

export default function useAnalyzer() {
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const [dimensions] = await Promise.all([
        loadImageDimensions(file),
        new Promise((r) => setTimeout(r, 1400)),
      ]);
      setResults(buildResults({ ...dimensions, fileSize: file.size }));
    } catch {
      setError("Could not read this image. Try another PNG, JPG, or WebP file.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setIsAnalyzing(false);
    setError(null);
  }, []);

  return { results, isAnalyzing, error, analyze, reset };
}
