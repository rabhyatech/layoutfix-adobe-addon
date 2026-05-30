import { useRef, useState } from "react";
import "./UploadArea.css";

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

export default function UploadArea({
  onFileAccepted,
  uploadedFile,
  previewUrl,
  onReset,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const validateAndAccept = (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Please upload a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File must be under 10 MB.");
      return;
    }
    setError(null);
    onFileAccepted(file);
  };

  const handleChange = (e) => validateAndAccept(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndAccept(e.dataTransfer.files?.[0]);
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
          <div className="upload-area__scan-line" aria-hidden="true" />
        </div>
        <div className="upload-area__file-info">
          <span className="upload-area__filename">{uploadedFile.name}</span>
          <button type="button" className="upload-area__reset" onClick={onReset}>
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
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
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
        <p className="upload-area__label">Drop your design here</p>
        <p className="upload-area__hint">PNG, JPG, or WebP — max 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handleChange}
        />
      </div>
      {error && <p className="upload-area__error">{error}</p>}
    </section>
  );
}
