// Planes canónicos de Lectoria. Deben coincidir con las apps iOS y Android
// (decisión del 2026-11-22):
//   iOS:     com.lectoria.premium.semiannual / .yearly / .lifetime
//   Android: premium_semiannual / premium_annual / premium_lifetime
// Las suscripciones (semestral y anual) incluyen 7 días de prueba gratis.
export type PlanCode = 'free' | 'semiannual' | 'annual' | 'lifetime';

export const TRIAL_DAYS = 7;

export interface ProductPlan {
  code: PlanCode;
  name: string;
  priceCents: number;
  priceLabel: string;
  cadenceLabel: string;
  description: string;
  features: string[];
  featured: boolean;
  /** Texto corto sobre la prueba gratis; solo para suscripciones. */
  trialLabel?: string;
}

const PREMIUM_FEATURES = [
  'Documentos ilimitados',
  'PDF y presentaciones PowerPoint',
  'Traducción en el dispositivo',
  'Asistente de estudio con IA sin límite mensual',
];

export const PRODUCT_PLANS: ProductPlan[] = [
  {
    code: 'free',
    name: 'Gratis',
    priceCents: 0,
    priceLabel: 'USD 0',
    cadenceLabel: 'sin costo',
    description: 'Para comenzar a leer y conocer Lectoria.',
    features: [
      'Hasta 5 documentos',
      'EPUB, TXT y texto pegado',
      'Resaltados y notas ilimitados',
      '3 consultas de IA al mes',
    ],
    featured: false,
  },
  {
    code: 'semiannual',
    name: 'Semestral',
    priceCents: 499,
    priceLabel: 'USD 4,99',
    cadenceLabel: 'cada 6 meses',
    description: 'Acceso completo por un semestre de estudio.',
    features: PREMIUM_FEATURES,
    featured: false,
    trialLabel: `${TRIAL_DAYS} días gratis`,
  },
  {
    code: 'annual',
    name: 'Anual',
    priceCents: 799,
    priceLabel: 'USD 7,99',
    cadenceLabel: 'por año',
    description: 'La opción recomendada: todo el año por menos.',
    features: PREMIUM_FEATURES,
    featured: true,
    trialLabel: `${TRIAL_DAYS} días gratis`,
  },
  {
    code: 'lifetime',
    name: 'De por vida',
    priceCents: 1999,
    priceLabel: 'USD 19,99',
    cadenceLabel: 'pago único',
    description: 'Una sola compra, sin renovaciones.',
    features: [...PREMIUM_FEATURES, 'Sin renovaciones ni suscripción'],
    featured: false,
  },
];

const planByCode = Object.fromEntries(PRODUCT_PLANS.map((plan) => [plan.code, plan])) as Record<PlanCode, ProductPlan>;

export const PLAN_CODES: PlanCode[] = PRODUCT_PLANS.map((plan) => plan.code);

export const PLAN_LABELS: Record<PlanCode, string> = {
  free: 'Gratis',
  semiannual: `Semestral · ${planByCode.semiannual.priceLabel}/6 meses`,
  annual: `Anual · ${planByCode.annual.priceLabel}/año`,
  lifetime: `De por vida · ${planByCode.lifetime.priceLabel}`,
};

/** Precio + cadencia en una línea, p. ej. "USD 7,99 por año". */
export const planPriceDetail = (code: PlanCode): string => {
  const plan = planByCode[code];
  return `${plan.priceLabel} ${plan.cadenceLabel}`;
};
