import React from 'react';

export const PrivacySection: React.FC = () => {
  const points = [
    'Tú controlas tus documentos y decides cuándo eliminarlos.',
    'Puedes ajustar tu configuración de analítica.',
    'La seguridad de tu cuenta se protege con buenas prácticas estándar.',
    'Somos transparentes sobre cuándo y cómo se usa la inteligencia artificial.',
    'Puedes revisar y eliminar tus documentos cuando quieras.',
    'Publicamos nuestra política de privacidad y términos con claridad.'
  ];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--color-divider)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'clamp(32px, 5vw, 64px)' }}>
      <div>
        <span className="tag tag-accent-2">Privacidad</span>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 18px', maxWidth: '16ch' }}>Tus lecturas son tuyas.</h2>
        <p style={{ fontSize: '14.5px', color: 'color-mix(in srgb, var(--color-text) 78%, transparent)', maxWidth: '52ch' }}>
          Diseñamos Lectoria para que mantengas el control de tus documentos: puedes revisar qué se almacena, ajustar tu configuración de analítica, eliminar documentos cuando quieras y entender cómo se usa la inteligencia artificial en tu lectura.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '16px' }}>
          <a className="lect-link" href="#" style={{ fontSize: '13.5px' }}>Política de privacidad</a>
          <a className="lect-link" href="#" style={{ fontSize: '13.5px' }}>Términos y condiciones</a>
          <a className="lect-link" href="#" style={{ fontSize: '13.5px' }}>Gestión de datos</a>
        </div>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {points.map((pp, idx) => (
          <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '14px' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '2px' }}>
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
            </svg>
            <span>{pp}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
