import React, { useState } from 'react';

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: '¿Qué formatos admite Lectoria?', a: 'Lectoria admite EPUB, PDF, PPTX, TXT, Markdown y texto pegado directamente en la aplicación.' },
    { q: '¿Necesito conexión a internet?', a: 'Puedes leer tus documentos sin conexión a internet. Las funciones avanzadas de inteligencia artificial y traducción en tiempo real requieren conexión para sincronizar los modelos de consulta.' },
    { q: '¿Mis documentos se almacenan en la nube?', a: 'Tus documentos se guardan localmente en tu dispositivo bajo tu control. Si activas la sincronización opcional de respaldo, tus archivos permanecen cifrados.' },
    { q: '¿Cómo funciona la inteligencia artificial?', a: 'La IA de Lectoria te ayuda a definir, traducir, resumir y explicar fragmentos de tu lectura, siempre como apoyo — tú decides qué aprender.' },
    { q: '¿Puedo leer documentos en otros idiomas?', a: 'Sí, puedes importar documentos en distintos idiomas y usar la traducción contextual mientras lees.' },
    { q: '¿Lectoria funciona en iPad?', a: 'Actualmente la app está optimizada principalmente para iPhone (iOS), con compatibilidad para ejecutar la versión en iPadOS.' },
    { q: '¿Existe una versión para Android?', a: 'El lanzamiento inicial está enfocado exclusivamente en iPhone. Puedes registrarte en nuestro boletín para enterarte cuando haya novedades para Android.' },
    { q: '¿Puedo cancelar mi suscripción?', a: 'Sí, puedes cancelar tu suscripción cuando quieras desde los ajustes de tu cuenta de App Store sin penalizaciones.' },
    { q: '¿Cómo elimino mis documentos?', a: 'Puedes eliminar cualquier documento de tu biblioteca en cualquier momento deslizando o mediante el menú de opciones del archivo.' },
    { q: '¿Dónde puedo solicitar soporte?', a: 'Puedes escribirnos al correo oficial de soporte: soporte@lectoria.app.' }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" style={{ padding: 'clamp(48px, 6vw, 80px) 0' }}>
      <span className="tag tag-accent">Preguntas frecuentes</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 26px' }}>Todo lo que quieras saber.</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: '760px' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button type="button" className="faq-button" onClick={() => toggleFaq(idx)}>
                <span style={{ fontSize: '15px', fontFamily: 'var(--font-heading)' }}>{faq.q}</span>
                <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {isOpen && (
                <p className="faq-answer">{faq.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
