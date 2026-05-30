import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="/" className="navbar__logo">
          <span className="navbar__logo-mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
            </svg>
          </span>
          LayoutFix
        </a>
        <nav className="navbar__links" aria-label="Main">
          <a href="#how-it-works">How it works</a>
          <a href="#upload" className="navbar__cta">
            Analyze
          </a>
        </nav>
      </div>
    </header>
  );
}
