function formatReportText(results, fileName) {
  const lines = [
    "LayoutFix — Layout Analysis Report",
    "===================================",
    "",
    fileName ? `File: ${fileName}` : "",
    results.meta
      ? `Dimensions: ${results.meta.width}×${results.meta.height}px (aspect ${results.meta.aspect})`
      : "",
    "",
    `Overall Score: ${results.score}/100`,
    "",
    results.summary,
    "",
    "Breakdown",
    "---------",
    ...results.metrics.map((m) => `${m.label}: ${m.value}%`),
    "",
    `Issues (${results.issues.length})`,
    "-------",
  ].filter(Boolean);

  results.issues.forEach((issue, i) => {
    lines.push("");
    lines.push(`${i + 1}. [${issue.severity.toUpperCase()}] ${issue.categoryLabel ?? ""} — ${issue.title}`);
    lines.push(`   ${issue.detail}`);
    if (issue.suggestion) lines.push(`   Fix: ${issue.suggestion}`);
  });

  lines.push("");
  lines.push(`Generated ${new Date().toLocaleString()}`);
  return lines.join("\n");
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportReportAsJson(results, fileName = "design") {
  const payload = {
    exportedAt: new Date().toISOString(),
    fileName,
    ...results,
  };
  downloadFile(
    JSON.stringify(payload, null, 2),
    `layoutfix-report-${fileName.replace(/\.[^.]+$/, "")}.json`,
    "application/json"
  );
}

export function exportReportAsText(results, fileName = "design") {
  downloadFile(
    formatReportText(results, fileName),
    `layoutfix-report-${fileName.replace(/\.[^.]+$/, "")}.txt`,
    "text/plain"
  );
}
