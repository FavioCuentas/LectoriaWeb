import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PricingSection } from '../components/PricingSection';

describe('Precios de Lectoria', () => {
  it('muestra únicamente Free, USD 5/año y USD 20 de por vida', () => {
    render(<PricingSection />);

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Anual')).toBeInTheDocument();
    expect(screen.getByText('De por vida')).toBeInTheDocument();
    expect(screen.getByText('USD 5')).toBeInTheDocument();
    expect(screen.getByText('por año')).toBeInTheDocument();
    expect(screen.getByText('USD 20')).toBeInTheDocument();
    expect(screen.getByText('pago único')).toBeInTheDocument();
    expect(screen.queryByText(/por mes/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Estudiante')).not.toBeInTheDocument();
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });
});
