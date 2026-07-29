import React, { useState } from 'react';

type BillingMode = 'monthly' | 'annual';

export const PricingSection: React.FC = () => {
  const [billing, setBilling] = useState<BillingMode>('monthly');

  const plans = [
    {
      name: 'Gratis',
      desc: 'Para comenzar a leer y organizar documentos.',
      price: '$0',
      features: ['Biblioteca personal', 'Lector con temas y ajustes', 'Hasta 10 documentos activos'],
      featured: false
    },
    {
      name: 'Estudiante',
      desc: 'Recomendado para estudio frecuente.',
      price: billing === 'monthly' ? '$3.99 / mes' : '$39.99 / año',
      features: ['Todo lo del plan Gratis', 'Diccionario y traducción ilimitados', 'Hasta 150 consultas de IA / mes'],
      featured: true
    },
    {
      name: 'Pro',
      desc: 'Para profesionales e investigadores.',
      price: billing === 'monthly' ? '$7.99 / mes' : '$79.99 / año',
      features: ['Todo lo del plan Estudiante', 'IA sin límite mensual', 'Documentos ilimitados'],
      featured: false
    }
  ];

  return (
    <section id="precios" style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--color-divider)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span className="tag tag-accent-2">Precios</span>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 0' }}>Un plan para cada forma de estudiar.</h2>
        </div>

        <div className="seg" role="radiogroup" aria-label="Periodo de facturación">
          <button type="button" className={`seg-opt ${billing === 'monthly' ? 'active' : ''}`} onClick={() => setBilling('monthly')}>
            Mensual
          </button>
          <button type="button" className={`seg-opt ${billing === 'annual' ? 'active' : ''}`} onClick={() => setBilling('annual')}>
            Anual
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {plans.map((plan, idx) => (
          <div key={idx} className="card elev-md" style={{ padding: '28px', gap: '16px', border: plan.featured ? '2px solid var(--color-accent)' : 'none' }}>
            <div>
              <div className="card-title" style={{ fontSize: '20px' }}>{plan.name}</div>
              <p className="card-body" style={{ marginTop: '4px' }}>{plan.desc}</p>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '30px' }}>{plan.price}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {plan.features.map((pf, fIdx) => (
                <li key={fIdx} style={{ display: 'flex', gap: '8px', fontSize: '13px', alignItems: 'flex-start' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '2px', color: 'var(--color-accent-700)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{pf}</span>
                </li>
              ))}
            </ul>
            <a href="#cta-final" className="btn btn-primary btn-block">Próximamente en App Store</a>
          </div>
        ))}
      </div>
    </section>
  );
};
