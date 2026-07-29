import React from 'react';

export const ProblemSection: React.FC = () => {
  const problems = [
    'Un lector distinto para cada formato.',
    'Traductores abiertos en otra pantalla.',
    'Búsquedas manuales de conceptos.',
    'Notas y resaltados dispersos.',
    'Distracciones constantes.',
    'Dificultad para retomar el progreso.',
    'Documentos desorganizados.'
  ];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center' }}>
      <div>
        <span className="tag tag-accent-2">El problema</span>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 0', maxWidth: '16ch' }}>Estudiar no debería significar saltar entre cinco aplicaciones.</h2>
        <ul style={{ listStyle: 'none', margin: '22px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {problems.map((p, idx) => (
            <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14.5px', color: 'color-mix(in srgb, var(--color-text) 78%, transparent)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-600)" strokeWidth="2.75" strokeLinecap="round" style={{ flex: 'none', marginTop: '2px' }}>
                <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
              </svg>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card elev-md" style={{ padding: '28px', background: 'var(--color-accent-2-100)' }}>
        <div className="card-kicker" style={{ color: 'var(--color-accent-2-700)' }}>La simplificación</div>
        <h3 className="card-title" style={{ fontSize: '22px' }}>Una sola biblioteca. Una sola forma de leer.</h3>
        <p className="card-body" style={{ fontSize: '14.5px', opacity: 0.85 }}>
          Lectoria reúne el lector, el diccionario, la traducción, la IA y tus notas en la misma pantalla — sin cambiar de aplicación ni perder el hilo de la lectura.
        </p>
      </div>
    </section>
  );
};
