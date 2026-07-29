import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    { n: '1', title: 'Importa tu documento', desc: 'Desde Archivos, Compartir, arrastrar y soltar o texto pegado.' },
    { n: '2', title: 'Personaliza tu lectura', desc: 'Elige tema, tipografía, tamaño y modo de navegación.' },
    { n: '3', title: 'Comprende y organiza', desc: 'Usa diccionario, traducción, IA, notas, resaltados y marcadores.' }
  ];

  return (
    <section id="como-funciona" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <span className="tag tag-accent">Cómo funciona</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 40px' }}>Empieza en tres pasos.</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px', position: 'relative' }}>
        {steps.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--color-accent-500)', color: 'var(--color-bg)', display: 'grid', placeContent: 'center', fontFamily: 'var(--font-heading)', fontSize: '20px' }}>
              {s.n}
            </div>
            <div className="card-title" style={{ fontSize: '19px' }}>{s.title}</div>
            <p style={{ fontSize: '14px', color: 'color-mix(in srgb, var(--color-text) 76%, transparent)', margin: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
