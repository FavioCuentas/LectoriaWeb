import React from 'react';
import { AndroidFrame, DuoFrame, IPhoneFrame } from './DeviceFrames';

const Caption: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <figcaption style={{ textAlign: 'center', marginTop: '20px', maxWidth: '28ch' }}>
    <div className="card-title">{title}</div>
    <p className="card-body" style={{ margin: '4px 0 0' }}>{text}</p>
  </figcaption>
);

const figureStyle: React.CSSProperties = { margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' };

export const DevicesShowcase: React.FC = () => (
  <section id="dispositivos" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
    <div style={{ maxWidth: '60ch', marginBottom: '40px' }}>
      <span className="tag tag-accent">iPhone, Android y pantalla grande</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 0' }}>Tu biblioteca y tus apuntes, en el dispositivo que tengas a mano.</h2>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 'clamp(32px, 5vw, 64px)' }}>
      <figure style={figureStyle}>
        <IPhoneFrame src="/media/iphone-biblioteca.jpg" alt="Biblioteca de Lectoria en iPhone con libros y portadas" width="min(240px, 62vw)" />
        <Caption title="Biblioteca" text="Tus libros y documentos con su portada." />
      </figure>
      <figure style={figureStyle}>
        <DuoFrame src="/media/duo-ia.jpg" alt="Lector de Lectoria en un iPhone plegable abierto, con resaltados y preguntas de estudio generadas por la IA" />
        <Caption title="Lee y estudia en grande" text="Resaltados y preguntas de estudio sin salir de la página." />
      </figure>
      <figure style={figureStyle}>
        <AndroidFrame src="/media/android-inicio.jpg" alt="Pantalla de inicio de Lectoria en Android con la lectura en curso" width="min(272px, 66vw)" />
        <Caption title="También en Android" text="Retoma tu lectura donde la dejaste." />
      </figure>
    </div>
  </section>
);
