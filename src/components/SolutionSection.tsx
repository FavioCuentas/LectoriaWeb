import React from 'react';

export const SolutionSection: React.FC = () => {
  const features = [
    {
      title: 'Biblioteca organizada',
      desc: 'Todos tus documentos en un solo lugar, con portadas y colecciones automáticas.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 5.5v15" />
        </svg>
      )
    },
    {
      title: 'Lectura personalizada',
      desc: 'Ajusta tema, tipografía, tamaño y márgenes a tu gusto.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    },
    {
      title: 'Diccionario contextual',
      desc: 'Consulta el significado de cualquier palabra sin salir de la página.',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      )
    },
    {
      title: 'Traducción inmediata',
      desc: 'Traduce fragmentos seleccionados al instante.',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
        </svg>
      )
    },
    {
      title: 'Asistencia con IA',
      desc: 'Pide explicaciones, resúmenes y guías de estudio sobre lo que lees.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
        </svg>
      )
    },
    {
      title: 'Resaltados y notas',
      desc: 'Marca y anota directamente sobre el texto.',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l3-1 9-9-2-2-9 9z" /><path d="M14 6l4 4" />
        </svg>
      )
    },
    {
      title: 'Marcadores',
      desc: 'Guarda tus puntos clave para volver a ellos fácilmente.',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
      )
    },
    {
      title: 'Lectura en voz alta',
      desc: 'Escucha tus documentos cuando no puedas leer.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="2" width="10" height="20" rx="2.5" /><line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      )
    },
    {
      title: 'Seguimiento de progreso',
      desc: 'Ve cuánto llevas de cada documento, siempre actualizado.',
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 9 9" />
        </svg>
      )
    }
  ];

  return (
    <section id="solucion" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <div style={{ maxWidth: '60ch', marginBottom: '32px' }}>
        <span className="tag tag-accent">La solución</span>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 0' }}>Todo lo que necesitas para leer y estudiar, en un solo lugar.</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {features.map((f, idx) => (
          <div key={idx} className="card elev-sm interactive-hover-card" style={{ padding: '22px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'var(--color-accent-100)', display: 'grid', placeContent: 'center', color: 'var(--color-accent-700)', marginBottom: '4px' }}>
              {f.icon}
            </div>
            <div className="card-title">{f.title}</div>
            <p className="card-body">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
