import { useState, useEffect } from "react";
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
  const { results, isAnalyzing, error, analyze, reset } = useAnalyzer();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileAccepted = (file) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    reset();
  };

  const handleAnalyze = () => {
    if (uploadedFile && !isAnalyzing) analyze(uploadedFile);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setUploadedFile(null);
    setPreviewUrl(null);
    reset();
  };

  return (
    <div className="app">
      <div className="noise-overlay" />
      <div className="grid-bg" />
      <Navbar />
      <main className="main">
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
                <span aria-hidden="true">⚠</span> {error}
              </div>
            )}
            {uploadedFile && (
              <AnalyzeButton onClick={handleAnalyze} isAnalyzing={isAnalyzing} />
            )}
          </>
        )}
        {results && (
          <ResultsPanel
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
