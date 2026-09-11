export type PlanCode = 'free' | 'annual' | 'lifetime';

export interface ProductPlan {
  code: PlanCode;
  name: string;
  priceCents: number;
  priceLabel: string;
  cadenceLabel: string;
  description: string;
  features: string[];
  featured: boolean;
}

export const PRODUCT_PLANS: ProductPlan[] = [
  {
    code: 'free',
    name: 'Free',
    priceCents: 0,
    priceLabel: 'USD 0',
    cadenceLabel: 'sin costo',
    description: 'Para comenzar a leer, organizar documentos y conocer Lectoria.',
    features: [
      'Biblioteca y lector de documentos',
      'Temas y ajustes de lectura',
      'Acceso a las funciones incluidas en el plan gratuito',
    ],
    featured: false,
  },
  {
    code: 'annual',
    name: 'Anual',
    priceCents: 500,
    priceLabel: 'USD 5',
    cadenceLabel: 'por año',
    description: 'Acceso completo durante un año con una renovación anual.',
    features: [
      'Todas las funciones de Lectoria',
      'Herramientas de comprensión e inteligencia artificial',
      'Actualizaciones incluidas durante la vigencia',
    ],
    featured: true,
  },
  {
    code: 'lifetime',
    name: 'De por vida',
    priceCents: 2000,
    priceLabel: 'USD 20',
    cadenceLabel: 'pago único',
    description: 'Una sola compra para conservar el acceso completo.',
    features: [
      'Todas las funciones de Lectoria',
      'Sin renovación anual',
      'Acceso de por vida para la cuenta adquirente',
    ],
    featured: false,
  },
];

export const PLAN_LABELS: Record<PlanCode, string> = {
  free: 'Free',
  annual: 'Anual · USD 5/año',
  lifetime: 'De por vida · USD 20',
};
