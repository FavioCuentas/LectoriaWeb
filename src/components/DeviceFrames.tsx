import React from 'react';

// Marcos de dispositivo dibujados con CSS para mostrar capturas reales de la app
// (las mismas de las tiendas). Las imágenes viven en public/media/
// (public/assets/ está fuera del sparse checkout local).

const titanium = 'linear-gradient(145deg, #3a3d42 0%, #1b1d20 45%, #2c2f33 100%)';
const deviceShadow = '0 30px 60px -20px rgba(20, 22, 26, 0.45), inset 0 0 0 1px rgba(255,255,255,0.08)';

const SideButton: React.FC<{ side: 'left' | 'right'; top: string; height: string }> = ({ side, top, height }) => (
  <span
    aria-hidden="true"
    style={{ position: 'absolute', [side]: '-3px', top, width: '3px', height, borderRadius: '2px', background: '#2a2c30' }}
  />
);

interface FrameProps {
  src: string;
  alt: string;
  /** Ancho CSS del dispositivo completo. */
  width?: string;
  style?: React.CSSProperties;
}

/** iPhone 18: bordes de titanio, Dynamic Island. Capturas 1320×2868 (servidas a 660×1434). */
export const IPhoneFrame: React.FC<FrameProps> = ({ src, alt, width = 'min(270px, 64vw)', style }) => (
  <div style={{ position: 'relative', width, padding: '9px', borderRadius: '50px', background: titanium, boxShadow: deviceShadow, ...style }}>
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

/** Teléfono Android: borde fino y cámara perforada. Capturas 1080×1920 (servidas a 720×1280). */
export const AndroidFrame: React.FC<FrameProps> = ({ src, alt, width = 'min(250px, 62vw)', style }) => (
  <div style={{ position: 'relative', width, padding: '8px', borderRadius: '34px', background: 'linear-gradient(145deg, #45484e 0%, #222428 55%, #34373c 100%)', boxShadow: deviceShadow, ...style }}>
    <SideButton side="right" top="22%" height="12%" />
    <SideButton side="right" top="38%" height="7%" />
    <div style={{ position: 'relative', borderRadius: '27px', overflow: 'hidden', background: '#000', aspectRatio: '1080 / 1920' }}>
      <img src={src} alt={alt} loading="lazy" width={720} height={1280} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span aria-hidden="true" style={{ position: 'absolute', top: '1.3%', left: '50%', transform: 'translateX(-50%)', width: '3.8%', aspectRatio: '1', borderRadius: '50%', background: '#0b0b0c' }} />
    </div>
  </div>
);

/**
 * iPhone plegable "duo" abierto y en vertical (más alto que ancho), con el pliegue al centro.
 * Usa capturas de iPad 13" (2064×2752, servidas a 1200×1600), que tienen la misma proporción 3:4.
 */
export const DuoFrame: React.FC<FrameProps> = ({ src, alt, width = 'min(400px, 84vw)', style }) => (
  <div style={{ position: 'relative', width, padding: '10px', borderRadius: '32px', background: titanium, boxShadow: deviceShadow, ...style }}>
    <SideButton side="right" top="12%" height="8%" />
    <SideButton side="right" top="23%" height="8%" />
    <div style={{ position: 'relative', borderRadius: '23px', overflow: 'hidden', background: '#000', aspectRatio: '2064 / 2752' }}>
      <img src={src} alt={alt} loading="lazy" width={1200} height={1600} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <span
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '18px', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.045) 40%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.045) 60%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }}
      />
    </div>
  </div>
);

/** Columna de un dispositivo con un halo de color detrás, para las secciones de dos columnas. */
export const DeviceStage: React.FC<{ children: React.ReactNode; glow?: string }> = ({ children, glow = 'var(--color-accent-2-200)' }) => (
  <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 0' }}>
    <div aria-hidden="true" style={{ position: 'absolute', width: 'min(320px, 70vw)', aspectRatio: '1', borderRadius: '50%', background: glow, opacity: 0.7, filter: 'blur(2px)' }} />
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
