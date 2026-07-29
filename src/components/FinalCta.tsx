import React from 'react';

export const FinalCta: React.FC = () => {
  return (
    <section id="cta-final" style={{ padding: '0 0 clamp(48px, 6vw, 80px)' }}>
      <div style={{ background: 'var(--color-accent-2-100)', borderRadius: 'calc(2 * var(--radius-lg))', padding: 'clamp(32px, 5vw, 56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'clamp(26px, 3.4vw, 38px)', margin: 0, maxWidth: '16ch', color: 'var(--color-accent-2-800)' }}>Tu próxima lectura puede enseñarte mucho más.</h2>
          <p style={{ fontSize: '15px', margin: '16px 0 0', maxWidth: '48ch', color: 'var(--color-accent-2-700)' }}>Reúne tus libros, apuntes y documentos en una experiencia creada para comprender, organizar y avanzar.</p>
          <a href="#top" className="btn btn-primary" style={{ marginTop: '22px', padding: '12px 24px', fontSize: '15px' }}>Próximamente en App Store</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/assets/lectoria-mascota-3d.png" alt="Mascota de Lectoria" style={{ width: 'min(200px, 60vw)', borderRadius: '50%', boxShadow: 'var(--shadow-lg)', animation: 'lect-float 6s ease-in-out infinite' }} />
        </div>
      </div>
    </section>
  );
};
