import React, { useState } from 'react';

type ReaderTheme = 'light' | 'sepia' | 'dark';

export const ReaderExperience: React.FC = () => {
  const [theme, setTheme] = useState<ReaderTheme>('light');

  const themeStyles: Record<ReaderTheme, { bg: string; color: string }> = {
    light: { bg: 'var(--color-bg)', color: 'var(--color-text)' },
    sepia: { bg: '#f2e4c8', color: '#4a3a24' },
    dark: { bg: '#221f1c', color: '#efe6d8' }
  };

  const options = ['Tamaño de texto', 'Tipografía', 'Espaciado', 'Márgenes', 'Navegación', 'Progreso', 'Índice', 'Búsqueda'];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center' }}>
      <div>
        <span className="tag tag-accent">Lectura</span>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 18px', maxWidth: '18ch' }}>Una experiencia que se adapta a tu forma de leer.</h2>

        <div className="seg" role="radiogroup" aria-label="Tema de lectura" style={{ marginBottom: '20px' }}>
          <button type="button" className={`seg-opt ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
            Claro
          </button>
          <button type="button" className={`seg-opt ${theme === 'sepia' ? 'active' : ''}`} onClick={() => setTheme('sepia')}>
            Sepia
          </button>
          <button type="button" className={`seg-opt ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
            Oscuro
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {options.map((opt, idx) => (
            <span key={idx} className="tag tag-neutral">{opt}</span>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: 'calc(2 * var(--radius-lg))', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div
          style={{
            backgroundColor: themeStyles[theme].bg,
            color: themeStyles[theme].color,
            padding: 'clamp(28px, 4vw, 44px) clamp(24px, 4vw, 40px)',
            minHeight: '320px',
            transition: 'background-color 0.3s ease, color 0.3s ease'
          }}
        >
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', marginBottom: '14px' }}>Capítulo 3 — La memoria y el aprendizaje</div>
          <p style={{ fontSize: '15px', lineHeight: 1.8, maxWidth: '44ch', opacity: 0.88 }}>
            La comprensión lectora profunda ocurre cuando el lector conecta ideas nuevas con conocimiento previo, formando una red de significado duradera. Este proceso mejora con la práctica constante y con pausas para reflexionar sobre lo leído.
          </p>
        </div>
      </div>
    </section>
  );
};
