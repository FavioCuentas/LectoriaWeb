import React from 'react';

export const TargetAudience: React.FC = () => {
  const profiles = [
    { title: 'Estudiantes universitarios', need: 'Leer mucho material en poco tiempo', benefit: 'Organiza apuntes y lecturas en una sola biblioteca, con IA para repasar conceptos.' },
    { title: 'Estudiantes de posgrado', need: 'Comprender textos densos y especializados', benefit: 'Resúmenes y explicaciones contextuales sin salir del documento.' },
    { title: 'Profesionales', need: 'Estudiar documentos técnicos entre tareas', benefit: 'Retoma la lectura exactamente donde la dejaste, desde cualquier documento.' },
    { title: 'Investigadores', need: 'Cruzar ideas entre varias fuentes', benefit: 'Notas y resaltados conectados a cada documento de tu biblioteca.' },
    { title: 'Lectores de documentos técnicos', need: 'Entender terminología especializada', benefit: 'Diccionario contextual y explicaciones bajo demanda.' },
    { title: 'Estudio en otro idioma', need: 'Leer y traducir sin cambiar de app', benefit: 'Traducción inmediata integrada en la misma pantalla de lectura.' }
  ];

  return (
    <section id="para-quien" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <span className="tag tag-accent">Para quién es Lectoria</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 28px' }}>Diseñada para quienes leen para aprender.</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {profiles.map((prof, idx) => (
          <div key={idx} className="card elev-sm" style={{ padding: '22px', gap: '10px' }}>
            <div className="card-title" style={{ fontSize: '17px' }}>{prof.title}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--color-accent-700)', fontWeight: 600 }}>{prof.need}</div>
            <p className="card-body">{prof.benefit}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
