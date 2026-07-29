import React from 'react';

export const AiCapabilities: React.FC = () => {
  const capabilities = [
    'Explicar un párrafo',
    'Resumir una sección',
    'Aclarar conceptos',
    'Crear preguntas de repaso',
    'Relacionar ideas',
    'Simplificar textos técnicos',
    'Traducir contenido',
    'Generar una guía de estudio'
  ];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'start' }}>
      <div>
        <span className="tag tag-accent">Inteligencia artificial</span>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 18px', maxWidth: '20ch' }}>Comprende lo complejo sin abandonar tu lectura.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px 20px' }}>
          {capabilities.map((cap, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{cap}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card elev-sm" style={{ padding: '26px', background: 'var(--color-accent-2-100)' }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', lineHeight: 1.4, margin: 0, color: 'var(--color-accent-2-800)' }}>
          Lectoria te ayuda a comprender. Tú decides qué aprender y cómo utilizarlo.
        </p>
        <p style={{ fontSize: '13px', margin: '14px 0 0', color: 'var(--color-accent-2-700)' }}>
          La IA es una herramienta de apoyo, no un sustituto del aprendizaje.
        </p>
      </div>
    </section>
  );
};
