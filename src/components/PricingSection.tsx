import React from 'react';
import { PRODUCT_PLANS } from '../config/plans';

export const PricingSection: React.FC = () => {
  return (
    <section id="precios" style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--color-divider)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <span className="tag tag-accent-2">Precios</span>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 0' }}>Simple, accesible y sin precios ocultos.</h2>
          <p style={{ marginTop: '10px', color: 'var(--color-neutral-700)' }}>
            Elige Free, USD 5 por año o USD 20 en un único pago de por vida.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {PRODUCT_PLANS.map((plan) => (
          <div key={plan.code} className="card elev-md" style={{ padding: '28px', gap: '16px', border: plan.featured ? '2px solid var(--color-accent)' : 'none' }}>
            <div>
              <div className="card-title" style={{ fontSize: '20px' }}>{plan.name}</div>
              <p className="card-body" style={{ marginTop: '4px' }}>{plan.description}</p>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '30px' }}>{plan.priceLabel}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-neutral-700)' }}>{plan.cadenceLabel}</div>
            </div>
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
            <a href="#cta-final" className="btn btn-primary btn-block">Obtener Lectoria</a>
          </div>
        ))}
      </div>
    </section>
  );
};
