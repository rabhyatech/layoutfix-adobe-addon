import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadArea from "./components/UploadArea";
import AnalyzeButton from "./components/AnalyzeButton";
import ResultsPanel from "./components/ResultsPanel";
import AnalyzingOverlay from "./components/AnalyzingOverlay";
import Footer from "./components/Footer";
import useAnalyzer from "./hooks/useAnalyzer";
import "./styles/globals.css";

export default function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const { results, isAnalyzing, error, analyze, reset, clearError } = useAnalyzer();
  const resultsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (results) {
      setAnnouncement(
        `Analysis complete. Layout score ${results.score} out of 100. ${results.issues.length} issue${results.issues.length === 1 ? "" : "s"} found.`
      );
      resultsRef.current?.focus();
    }
  }, [results]);

  const handleFileAccepted = (file) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    reset();
    setAnnouncement(`${file.name} uploaded. Ready to analyze.`);
  };

  const handleAnalyze = () => {
    if (uploadedFile && !isAnalyzing) {
      setAnnouncement("Analyzing layout. Please wait.");
      analyze(uploadedFile);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(null);
    setPreviewUrl(null);
    reset();
    setAnnouncement("Ready for a new upload.");
  };

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="noise-overlay" aria-hidden="true" />
      <div className="grid-bg" aria-hidden="true" />

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <Navbar />
      <main id="main-content" className="main" tabIndex={-1}>
        {!results && (
          <>
            <Hero />
            <UploadArea
              onFileAccepted={handleFileAccepted}
              uploadedFile={uploadedFile}
              previewUrl={previewUrl}
              onReset={handleReset}
              isAnalyzing={isAnalyzing}
            />
            {error && (
              <div className="app__error" role="alert">
                <p className="app__error-text">{error}</p>
                <button
                  type="button"
                  className="app__error-dismiss"
                  onClick={clearError}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}
            {uploadedFile && (
              <AnalyzeButton onClick={handleAnalyze} isAnalyzing={isAnalyzing} />
            )}
          </>
        )}
        {results && (
          <ResultsPanel
            ref={resultsRef}
            results={results}
            previewUrl={previewUrl}
            fileName={uploadedFile?.name}
            onReset={handleReset}
          />
        )}
      </main>
      <Footer />
      {isAnalyzing && (
        <AnalyzingOverlay
          previewUrl={previewUrl}
          fileName={uploadedFile?.name}
        />
      )}
    </div>
  );
}
