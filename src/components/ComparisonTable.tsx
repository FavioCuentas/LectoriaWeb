import React from 'react';

export const ComparisonTable: React.FC = () => {
  const rows = [
    { activity: 'Leer varios formatos', without: 'Varias aplicaciones', with: 'Una biblioteca' },
    { activity: 'Consultar palabras', without: 'Cambiar de app', with: 'Dentro del lector' },
    { activity: 'Traducir', without: 'Copiar y pegar', with: 'Acción contextual' },
    { activity: 'Explicar conceptos', without: 'Buscar manualmente', with: 'Ayuda integrada' },
    { activity: 'Guardar información', without: 'Herramientas separadas', with: 'Notas y resaltados' },
    { activity: 'Retomar lectura', without: 'Buscar posición', with: 'Progreso guardado' }
  ];

  return (
    <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--color-divider)' }}>
      <span className="tag tag-accent-2">Comparativa</span>
      <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '14px 0 26px' }}>Antes y después de Lectoria.</h2>
      
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Sin Lectoria</th>
              <th>Con Lectoria</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{row.activity}</td>
                <td style={{ opacity: 0.7 }}>{row.without}</td>
                <td style={{ color: 'var(--color-accent-700)', fontWeight: 600 }}>{row.with}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
