import React from 'react';
import { DeviceStage, IPhoneFrame } from './DeviceFrames';

export const ContextualTools: React.FC = () => {
  const menuItems = ['Definir', 'Traducir', 'Preguntar a Lectoria', 'Resumir', 'Explicar', 'Guardar como nota', 'Resaltar'];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--color-divider)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center' }}>
      <div>
      <span className="tag tag-accent-2">Herramientas contextuales</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 26px', maxWidth: '24ch' }}>Selecciona una palabra. Lectoria se encarga del resto.</h2>
      
      <div style={{ maxWidth: '640px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px, 4vw, 40px)', position: 'relative' }}>
        <p style={{ fontSize: '15.5px', lineHeight: 1.85, margin: '0 0 160px' }}>
          El conocimiento tácito es aquel que resulta difícil de transferir mediante la escritura o la verbalización, ya que se basa en la{' '}
          <span style={{ background: 'var(--color-accent-300)', borderRadius: '4px', padding: '1px 4px', position: 'relative', fontWeight: 600 }}>
            experiencia
            <span style={{ position: 'absolute', left: 0, top: 'calc(100% + 10px)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 'normal', textAlign: 'left', zIndex: 10 }}>
              {menuItems.map((item, idx) => (
                <span
                  key={idx}
                  className="ctx-menu-item"
                  style={{ color: item === 'Preguntar a Lectoria' ? 'var(--color-accent-700)' : 'inherit', fontWeight: item === 'Preguntar a Lectoria' ? 600 : 'normal' }}
                >
                  {item}
                </span>
              ))}
            </span>
          </span>{' '}
          personal directa.
        </p>
      </div>
      </div>
      <DeviceStage glow="var(--color-accent-200)">
        <IPhoneFrame src="/media/iphone-lector.jpg" alt="Lector de Lectoria en iPhone con resaltados de colores y la barra con Diccionario, Traducir e IA" />
      </DeviceStage>
    </section>
  );
};
