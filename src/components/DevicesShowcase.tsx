import React from 'react';

// Capturas reales de la app (las mismas de las tiendas) dentro de dos marcos dibujados con CSS:
// un iPhone 18 (biblioteca) y un iPhone plegable "duo" abierto (notas, captura de iPad 4:3).
// Las imágenes viven en public/media/ (public/assets/ está fuera del sparse checkout local).

const titanium = 'linear-gradient(145deg, #3a3d42 0%, #1b1d20 45%, #2c2f33 100%)';

const SideButton: React.FC<{ side: 'left' | 'right'; top: string; height: string }> = ({ side, top, height }) => (
  <span
    aria-hidden="true"
    style={{ position: 'absolute', [side]: '-3px', top, width: '3px', height, borderRadius: '2px', background: '#2a2c30' }}
  />
);

const IPhoneFrame: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div style={{ position: 'relative', width: 'min(270px, 64vw)', padding: '9px', borderRadius: '50px', background: titanium, boxShadow: '0 30px 60px -20px rgba(20, 22, 26, 0.45), inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
    <SideButton side="left" top="18%" height="7%" />
    <SideButton side="left" top="28%" height="11%" />
    <SideButton side="left" top="41%" height="11%" />
    <SideButton side="right" top="30%" height="15%" />
    <div style={{ position: 'relative', borderRadius: '42px', overflow: 'hidden', background: '#000', aspectRatio: '1320 / 2868' }}>
      <img src={src} alt={alt} loading="lazy" width={660} height={1434} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span aria-hidden="true" style={{ position: 'absolute', top: '2.1%', left: '50%', transform: 'translateX(-50%)', width: '31%', height: '3.6%', borderRadius: '999px', background: '#000' }} />
    </div>
  </div>
);

const DuoFrame: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <div style={{ position: 'relative', width: 'min(440px, 86vw)', padding: '10px', borderRadius: '30px', background: titanium, boxShadow: '0 30px 60px -20px rgba(20, 22, 26, 0.45), inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
    <SideButton side="right" top="14%" height="9%" />
    <SideButton side="right" top="26%" height="9%" />
    <div style={{ position: 'relative', borderRadius: '22px', overflow: 'hidden', background: '#000', aspectRatio: '2064 / 2752' }}>
      <img src={src} alt={alt} loading="lazy" width={1200} height={1600} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      {/* Pliegue central de la pantalla plegable */}
      <span
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '18px', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.045) 40%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.045) 60%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }}
      />
    </div>
  </div>
);

const Caption: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div style={{ textAlign: 'center', marginTop: '20px', maxWidth: '30ch' }}>
    <div className="card-title">{title}</div>
    <p className="card-body" style={{ margin: '4px 0 0' }}>{text}</p>
  </div>
);

export const DevicesShowcase: React.FC = () => (
  <section id="dispositivos" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
    <div style={{ maxWidth: '60ch', marginBottom: '40px' }}>
      <span className="tag tag-accent">En tu bolsillo y en pantalla grande</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 0' }}>Tu biblioteca y tus apuntes, en el dispositivo que tengas a mano.</h2>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 'clamp(36px, 7vw, 96px)' }}>
      <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IPhoneFrame src="/media/iphone-biblioteca.jpg" alt="Biblioteca de Lectoria en iPhone con libros y portadas" />
        <Caption title="Biblioteca" text="Tus libros y documentos con su portada, listos para seguir leyendo." />
      </figure>
      <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DuoFrame src="/media/duo-notas.jpg" alt="Notas y resaltados de Lectoria en un iPhone plegable abierto" />
        <Caption title="Notas y resaltados" text="Todo lo que marcaste, ordenado y fácil de repasar en pantalla grande." />
      </figure>
    </div>
  </section>
);
