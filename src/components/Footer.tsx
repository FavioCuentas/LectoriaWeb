import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{ borderTop: '1px solid var(--color-divider)' }}>
      <div className="container" style={{ paddingTop: 'clamp(40px, 6vw, 64px)', paddingBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <img src="/assets/lectoria-logo-institucional.png" alt="Lectoria" style={{ width: '30px', height: '30px', borderRadius: '8px', objectFit: 'cover' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px' }}>Lectoria</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'color-mix(in srgb, var(--color-text) 60%, transparent)', maxWidth: '24ch' }}>Lectura y estudio inteligente para iPhone.</p>
        </div>

        <div>
          <div style={{ fontSize: '11.5px', letterSpacing: '.06em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginBottom: '12px' }}>Producto</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a className="lect-link" href="#solucion" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Funciones</a>
            <a className="lect-link" href="#solucion" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Formatos</a>
            <a className="lect-link" href="#precios" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Precios</a>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11.5px', letterSpacing: '.06em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginBottom: '12px' }}>Recursos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a className="lect-link" href="#faq" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Ayuda</a>
            <a className="lect-link" href="#faq" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Preguntas frecuentes</a>
            <a className="lect-link" href="mailto:soporte@lectoria.app" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Contacto</a>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11.5px', letterSpacing: '.06em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginBottom: '12px' }}>Legal</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a className="lect-link" href="#" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Política de privacidad</a>
            <a className="lect-link" href="#" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Términos y condiciones</a>
            <a className="lect-link" href="#" style={{ fontSize: '13px', color: 'var(--color-text)', opacity: 0.75 }}>Gestión de datos</a>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '16px', paddingBottom: '32px', borderTop: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)' }}>
        <span>© 2026 Lectoria. Todos los derechos reservados.</span>
        <span style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <span>soporte@lectoria.app</span>
          <a className="lect-link" href="#" style={{ opacity: 0.8 }}>Instagram</a>
          <a className="lect-link" href="#" style={{ opacity: 0.8 }}>X</a>
        </span>
      </div>
    </footer>
  );
};
