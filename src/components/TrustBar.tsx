import React from 'react';

export const TrustBar: React.FC = () => {
  const items = [
    {
      label: 'Diseñada para iPhone',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="2" width="10" height="20" rx="2.5" /><line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      )
    },
    {
      label: 'Lectura sin distracciones',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    },
    {
      label: 'Múltiples formatos',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 3 21 8 12 13 3 8 12 3" /><path d="M3 15l9 5 9-5" /><path d="M3 11.5l9 5 9-5" />
        </svg>
      )
    },
    {
      label: 'Herramientas de estudio',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
        </svg>
      )
    },
    {
      label: 'Privacidad y control',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        </svg>
      )
    },
    {
      label: 'Pensada para estudiantes',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 5.5v15" />
        </svg>
      )
    }
  ];

  return (
    <section style={{ padding: '32px 0 clamp(48px, 6vw, 72px)', borderTop: '1px solid var(--color-divider)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
        {items.map((item, idx) => (
          <div key={idx} className="card elev-sm" style={{ flex: '1 1 180px', maxWidth: '220px', minWidth: '150px', alignItems: 'center', textAlign: 'center', padding: '24px 16px', gap: '12px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', background: 'var(--color-accent-100)', display: 'grid', placeContent: 'center', color: 'var(--color-accent-700)' }}>
              {item.icon}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.35 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
