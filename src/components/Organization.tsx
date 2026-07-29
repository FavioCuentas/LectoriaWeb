import React from 'react';

export const Organization: React.FC = () => {
  const items = [
    {
      label: 'Marcadores',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
      )
    },
    {
      label: 'Resaltados',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l3-1 9-9-2-2-9 9z" /><path d="M14 6l4 4" />
        </svg>
      )
    },
    {
      label: 'Notas',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 4h11l3 3v13H5z" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" />
        </svg>
      )
    },
    {
      label: 'Historial',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" /><polyline points="12 8 12 12 15 14" />
        </svg>
      )
    },
    {
      label: 'Última posición',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 9 9" />
        </svg>
      )
    },
    {
      label: 'Documentos recientes',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="5" width="16" height="15" rx="2" /><line x1="4" y1="10" x2="20" y2="10" />
        </svg>
      )
    },
    {
      label: 'Colecciones',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h6l2 2h8v11H4z" />
        </svg>
      )
    },
    {
      label: 'Filtros',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="4 4 20 4 14 12 14 19 10 21 10 12" />
        </svg>
      )
    },
    {
      label: 'Búsqueda',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      )
    },
    {
      label: 'Progreso por documento',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 3 21 8 12 13 3 8 12 3" /><path d="M3 15l9 5 9-5" /><path d="M3 11.5l9 5 9-5" />
        </svg>
      )
    }
  ];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--color-divider)' }}>
      <span className="tag tag-accent-2">Organización</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 26px', maxWidth: '22ch' }}>Todo lo importante permanece conectado con tu lectura.</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {items.map((o, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--color-accent-700)' }}>{o.icon}</div>
            <span style={{ fontSize: '13px' }}>{o.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
