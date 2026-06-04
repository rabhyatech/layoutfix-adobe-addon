import { useState, useCallback } from "react";
import generateMockAnalysis from "../utils/generateMockAnalysis";

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

export default function useAnalyzer() {
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyze = useCallback(async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const dimensions = await loadImageDimensions(file);
      await new Promise((r) => setTimeout(r, 1600));
      setResults(
        generateMockAnalysis({
          ...dimensions,
          fileSize: file.size,
          fileName: file.name,
        })
      );
    } catch {
      setError(
        "We couldn't read this image. Please upload a valid PNG, JPG, or JPEG file under 10 MB."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setIsAnalyzing(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { results, isAnalyzing, error, analyze, reset, clearError };
}
