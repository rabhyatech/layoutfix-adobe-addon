import { useRef, useState, useCallback, useEffect } from "react";
import "./UploadArea.css";

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const ACCEPTED_EXT = [".png", ".jpg", ".jpeg"];

function isAcceptedImage(file) {
  if (!file) return false;
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return ACCEPTED_EXT.some((ext) => name.endsWith(ext));
}

export default function UploadArea({
  onFileAccepted,
  uploadedFile,
  previewUrl,
  onReset,
  isAnalyzing = false,
}) {
  const inputRef = useRef(null);
  const dragCounter = useRef(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const validateAndAccept = useCallback(
    (file) => {
      if (!file) return;
      if (!isAcceptedImage(file)) {
        setError("Please upload a PNG, JPG, or JPEG image.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("File must be under 10 MB.");
        return;
      }
      setError(null);
      onFileAccepted(file);
    },
    [onFileAccepted]
  );

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer?.types?.includes("Files")) {
      setDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current = 0;
      setDragOver(false);
      validateAndAccept(e.dataTransfer.files?.[0]);
    },
    [validateAndAccept]
  );

  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", prevent);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", prevent);
    };
  }, []);

  const handleChange = (e) => {
    validateAndAccept(e.target.files?.[0]);
    e.target.value = "";
  };

  if (uploadedFile && previewUrl) {
    return (
      <section className="upload-area upload-area--preview" id="upload">
        <div className="upload-area__preview-wrap">
          <img
            src={previewUrl}
            alt="Upload preview"
            className="upload-area__preview"
          />
          {!isAnalyzing && (
            <div className="upload-area__scan-line" aria-hidden="true" />
          )}
        </div>
        <div className="upload-area__file-info">
          <span className="upload-area__filename">{uploadedFile.name}</span>
          <button
            type="button"
            className="upload-area__reset"
            onClick={onReset}
            disabled={isAnalyzing}
          >
            Remove
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="upload-area" id="upload">
      <div
        className={`upload-area__dropzone${dragOver ? " upload-area__dropzone--active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload design image. Drag and drop or click to browse."
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {dragOver && (
          <div className="upload-area__drag-overlay" aria-hidden="true">
            <span>Drop to upload</span>
          </div>
        )}
        <div className="upload-area__icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="upload-area__label">
          {dragOver ? "Release to upload" : "Drag & drop your design here"}
        </p>
        <p className="upload-area__hint">or click to browse · PNG, JPG, JPEG · max 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,.png,.jpg,.jpeg"
          className="sr-only"
          onChange={handleChange}
        />
      </div>
      {!uploadedFile && !error && (
        <p className="upload-area__empty">No file selected yet</p>
      )}
      {error && (
        <div className="upload-area__error" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </div>
      )}
    </section>
  );
}
