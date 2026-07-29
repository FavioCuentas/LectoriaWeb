import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <img src="/assets/lectoria-logo-institucional.png" alt="Lectoria Logo" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', color: 'var(--color-text)' }}>Lectoria</span>
        </a>

        <button
          type="button"
          className="btn btn-icon btn-secondary mobile-menu-toggle"
          aria-label="Abrir menú"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <a className="lect-link" href="#solucion" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Funciones</a>
            <a className="lect-link" href="#como-funciona" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Cómo funciona</a>
            <a className="lect-link" href="#para-quien" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Para estudiantes</a>
            <a className="lect-link" href="#precios" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Precios</a>
            <a className="lect-link" href="#faq" style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>Preguntas frecuentes</a>
          </nav>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '13.5px',
              whiteSpace: 'nowrap',
              borderRadius: '999px',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-bg)',
              backgroundColor: 'var(--color-accent)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Próximamente en App Store
          </a>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mobile-nav-panel">
          <a className="lect-link" href="#solucion" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px' }}>Funciones</a>
          <a className="lect-link" href="#como-funciona" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px' }}>Cómo funciona</a>
          <a className="lect-link" href="#para-quien" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px' }}>Para estudiantes</a>
          <a className="lect-link" href="#precios" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px' }}>Precios</a>
          <a className="lect-link" href="#faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '15px' }}>Preguntas frecuentes</a>
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              textAlign: 'center',
              borderRadius: '999px',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-bg)',
              backgroundColor: 'var(--color-accent)',
              marginTop: '6px'
            }}
          >
            Próximamente en App Store
          </a>
        </nav>
      )}
    </header>
  );
};
