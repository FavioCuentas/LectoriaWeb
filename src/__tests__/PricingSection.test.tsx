import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PricingSection } from '../components/PricingSection';

describe('Precios de Lectoria', () => {
  it('muestra los mismos planes y precios que las apps iOS y Android', () => {
    render(<PricingSection />);

    expect(screen.getByText('Gratis')).toBeInTheDocument();
    expect(screen.getByText('Semestral')).toBeInTheDocument();
    expect(screen.getByText('Anual')).toBeInTheDocument();
    expect(screen.getByText('De por vida')).toBeInTheDocument();
    expect(screen.getByText('USD 4,99')).toBeInTheDocument();
    expect(screen.getByText('cada 6 meses')).toBeInTheDocument();
    expect(screen.getByText('USD 7,99')).toBeInTheDocument();
    expect(screen.getByText('por año')).toBeInTheDocument();
    expect(screen.getByText('USD 19,99')).toBeInTheDocument();
    expect(screen.getByText('pago único')).toBeInTheDocument();
    // La prueba gratis solo aplica a las dos suscripciones; el anual es el recomendado.
    expect(screen.getAllByText('7 días gratis')).toHaveLength(2);
    expect(screen.getAllByText('Recomendado')).toHaveLength(1);
    expect(screen.queryByText(/USD 5\b|USD 20\b/)).not.toBeInTheDocument();
    expect(screen.queryByText(/por mes/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Estudiante')).not.toBeInTheDocument();
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });
});
