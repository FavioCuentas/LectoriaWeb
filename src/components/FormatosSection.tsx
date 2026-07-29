import React from 'react';

export const FormatosSection: React.FC = () => {
  const formats = ['EPUB', 'PDF', 'PPTX', 'TXT', 'Markdown', 'Texto pegado'];
  const importMethods = [
    {
      label: 'Selector de archivos de iOS',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4M8 8l4-4 4 4" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
      )
    },
    {
      label: 'Arrastrar y soltar',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="5" width="14" height="14" rx="2" strokeDasharray="4 3" />
        </svg>
      )
    },
    {
      label: 'Menú Compartir de iOS',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" />
          <line x1="8.3" y1="10.7" x2="15.7" y2="6.3" /><line x1="8.3" y1="13.3" x2="15.7" y2="17.7" />
        </svg>
      )
    },
    {
      label: 'Texto pegado',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="4" width="10" height="16" rx="1.5" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
        </svg>
      )
    }
  ];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--color-divider)' }}>
      <span className="tag tag-accent-2">Formatos</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 22px', maxWidth: '20ch' }}>Tus documentos, sin importar el formato.</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
        {formats.map((fmt, idx) => (
          <span key={idx} className="tag tag-outline" style={{ fontSize: '13px', padding: '8px 16px' }}>{fmt}</span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {importMethods.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--color-accent-700)' }}>{m.icon}</div>
            <span style={{ fontSize: '14px' }}>{m.label}</span>
          </div>
        ))}
      </div>
      
      <p style={{ fontSize: '13.5px', color: 'color-mix(in srgb, var(--color-text) 65%, transparent)', maxWidth: '60ch' }}>
        Al importar, Lectoria genera automáticamente una portada, detecta documentos duplicados y mantiene tu biblioteca organizada por colecciones.
      </p>
    </section>
  );
};
