import React, { useRef, useEffect } from 'react';

export const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQueryMotion.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section style={{ position: 'relative', padding: 'calc(40px + clamp(36px, 6vw, 80px)) 0 clamp(48px, 7vw, 84px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center' }}>
      <div>
        <span className="tag tag-accent" style={{ marginBottom: '18px' }}>Lectura inteligente para iPhone y Android</span>
        <h1 style={{ fontSize: 'clamp(38px, 5.2vw, 58px)', lineHeight: 1.06, margin: '14px 0 0', maxWidth: '14ch' }}>Lee, comprende y aprende mejor.</h1>
        <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'color-mix(in srgb, var(--color-text) 78%, transparent)', maxWidth: '46ch', margin: '20px 0 0' }}>
          Lectoria convierte tus libros, documentos y apuntes en una experiencia de lectura inteligente, organizada y diseñada para estudiar sin distracciones.
        </p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '28px' }}>
          <a href="#solucion" className="btn btn-secondary" style={{ padding: '12px 22px', fontSize: '15px' }}>Descubrir cómo funciona</a>
        </div>
        <p style={{ fontSize: '12.5px', color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', margin: '22px 0 0' }}>
          Compatible con EPUB, PDF, PPTX, TXT, Markdown y texto pegado
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
          </svg>
          <span style={{ fontSize: '12.5px', color: 'var(--color-accent-2-700)' }}>Tus documentos permanecen bajo tu control</span>
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <div aria-hidden="true" style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', background: 'var(--color-accent-2-200)', top: '-30px', right: '10%', zIndex: 0, filter: 'blur(2px)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
        <img
          src="/media/hero-estudiante.jpg"
          alt="Estudiante tomando apuntes junto a su iPhone con las notas de Lectoria abiertas"
          width={1122}
          height={1402}
          fetchPriority="high"
          style={{ width: 'min(440px, 88vw)', height: 'auto', borderRadius: '32px', boxShadow: 'var(--shadow-lg)', display: 'block' }}
        />

        <div style={{ position: 'absolute', zIndex: 2, bottom: '-18px', left: '-22px', width: '118px', height: '118px', borderRadius: '50%', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '4px solid var(--color-bg)', animation: 'lect-float 5s ease-in-out infinite' }}>
          <video ref={videoRef} src="/assets/lectoria-mascota-loop.mp4" poster="/assets/lectoria-mascota-3d.png" autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        </div>
      </div>
    </section>
  );
};
