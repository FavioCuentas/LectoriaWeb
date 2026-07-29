import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { DateRange, StatMetric } from '../../types/dashboard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const OverviewTab: React.FC = () => {
  const { dateRange } = useOutletContext<{ dateRange: DateRange }>();

  // Scale metrics according to selected date range
  const scale = dateRange === '7d' ? 0.5 : dateRange === '30d' ? 1 : 2.1;

  const stats: StatMetric[] = [
    { id: '1', label: 'Usuarios registrados', value: Math.round(4820 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'users' },
    { id: '2', label: 'Usuarios activos diarios', value: Math.round(612 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'users' },
    { id: '3', label: 'Usuarios activos semanales', value: Math.round(1940 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'users' },
    { id: '4', label: 'Usuarios activos mensuales', value: Math.round(3510 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'users' },
    { id: '5', label: 'Nuevos usuarios', value: Math.round(284 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'users' },
    { id: '6', label: 'Usuarios gratuitos', value: Math.round(4110 * scale).toLocaleString('es-ES'), delta: 'sin cambios relevantes', deltaType: 'neutral', category: 'users' },
    { id: '7', label: 'Usuarios de pago', value: Math.round(710 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'financial' },
    { id: '8', label: 'Conversión a pago', value: '14,7%', delta: 'estable', deltaType: 'neutral', category: 'financial' },
    { id: '9', label: 'Cancelaciones', value: Math.round(38 * scale).toLocaleString('es-ES'), delta: '− frente al periodo anterior', deltaType: 'negative', category: 'financial' },
    { id: '10', label: 'Documentos importados', value: Math.round(9840 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'usage' },
    { id: '11', label: 'Sesiones de lectura', value: Math.round(15200 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'usage' },
    { id: '12', label: 'Tiempo promedio de lectura', value: '24 min', delta: 'estable', deltaType: 'neutral', category: 'usage' },
    { id: '13', label: 'Uso de diccionario', value: Math.round(6210 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'usage' },
    { id: '14', label: 'Uso de traducción', value: Math.round(4030 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'usage' },
    { id: '15', label: 'Uso de IA', value: Math.round(7460 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'usage' },
    { id: '16', label: 'Uso de texto a voz', value: Math.round(1180 * scale).toLocaleString('es-ES'), delta: '+ frente al periodo anterior', deltaType: 'positive', category: 'usage' },
    { id: '17', label: 'Errores técnicos', value: Math.round(23 * scale).toLocaleString('es-ES'), delta: '− frente al periodo anterior', deltaType: 'negative', category: 'technical' },
    { id: '18', label: 'Versión más utilizada', value: '2.4.1', delta: '62% de los dispositivos', deltaType: 'neutral', category: 'technical' },
  ];

  // Recharts user growth data
  const userEvolutionData = [
    { day: 'Día 1', usuarios: Math.round(420 * scale) },
    { day: 'Día 3', usuarios: Math.round(480 * scale) },
    { day: 'Día 6', usuarios: Math.round(450 * scale) },
    { day: 'Día 9', usuarios: Math.round(590 * scale) },
    { day: 'Día 12', usuarios: Math.round(630 * scale) },
    { day: 'Día 15', usuarios: Math.round(610 * scale) },
    { day: 'Día 18', usuarios: Math.round(700 * scale) },
    { day: 'Día 21', usuarios: Math.round(750 * scale) },
    { day: 'Día 24', usuarios: Math.round(720 * scale) },
    { day: 'Día 27', usuarios: Math.round(820 * scale) },
    { day: 'Día 30', usuarios: Math.round(890 * scale) },
  ];

  // Format usage chart data
  const formatUsageData = [
    { name: 'PDF', pct: 42, color: '#c67139' },
    { name: 'EPUB', pct: 31, color: '#d67f48' },
    { name: 'PPTX', pct: 14, color: '#f6a06b' },
    { name: 'Texto pegado', pct: 8, color: '#7a8a5e' },
    { name: 'Markdown', pct: 3, color: '#8fa073' },
    { name: 'TXT', pct: 2, color: '#aebf92' },
  ];

  // Feature usage data
  const featureUsageData = [
    { name: 'Diccionario', pct: 68, color: '#7a8a5e' },
    { name: 'IA / explicar', pct: 54, color: '#c67139' },
    { name: 'Traducción', pct: 47, color: '#d67f48' },
    { name: 'Resaltados', pct: 39, color: '#8fa073' },
    { name: 'Texto a voz', pct: 21, color: '#f6a06b' },
  ];

  // Conversion funnel
  const funnelData = [
    { stage: 'Registro', pct: 100, width: '100%' },
    { stage: 'Primera lectura', pct: 71, width: '71%' },
    { stage: 'Conversión a pago', pct: 15, width: '15%' },
  ];

  // iOS Version Distribution
  const iosDistData = [
    { name: 'iOS 18', value: 58, color: '#2e2b25' },
    { name: 'iOS 17', value: 31, color: '#645c50' },
    { name: 'iOS 16', value: 8, color: '#a19786' },
    { name: 'Otras', value: 3, color: '#dcd3c4' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 18 STAT CARDS GRID */}
      <div>
        <h2 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--color-neutral-800)' }}>
          Métricas clave del periodo ({dateRange === '7d' ? 'Últimos 7 días' : dateRange === '30d' ? 'Últimos 30 días' : 'Últimos 90 días'})
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
          }}
        >
          {stats.map((st) => {
            const isPos = st.deltaType === 'positive';
            const isNeg = st.deltaType === 'negative';
            const deltaColor = isPos
              ? 'var(--color-accent-2-700)'
              : isNeg
              ? 'var(--color-accent-700)'
              : 'color-mix(in srgb, var(--color-text) 55%, transparent)';

            return (
              <div
                key={st.id}
                style={{
                  background: 'var(--color-bg)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-divider)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ fontSize: '12px', color: 'color-mix(in srgb, var(--color-text) 60%, transparent)', fontWeight: 500 }}>
                  {st.label}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 600, color: 'var(--color-text)' }}>
                  {st.value}
                </div>
                <div style={{ fontSize: '11px', color: deltaColor, fontWeight: 600 }}>
                  {st.delta}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROW 1: USER EVOLUTION CHART & FORMAT USAGE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
        {/* User Evolution Line/Area Chart */}
        <div
          style={{
            background: 'var(--color-bg)',
            padding: '22px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-divider)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '15px', margin: '0 0 14px', color: 'var(--color-text)' }}>
            Evolución de usuarios activos
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userEvolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#645c50' }} />
                <YAxis tick={{ fontSize: 11, fill: '#645c50' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-neutral-900)',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`${val.toLocaleString('es-ES')} usuarios`, 'Activos']}
                />
                <Area
                  type="monotone"
                  dataKey="usuarios"
                  stroke="var(--color-accent)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Format Usage Bar Chart */}
        <div
          style={{
            background: 'var(--color-bg)',
            padding: '22px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-divider)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '15px', margin: '0 0 14px', color: 'var(--color-text)' }}>
            Formatos más utilizados
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatUsageData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-divider)" />
                <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: '#645c50' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#201e1d' }} width={85} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-neutral-900)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`${val}%`, 'Uso']}
                />
                <Bar dataKey="pct" radius={[0, 6, 6, 0]}>
                  {formatUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 2: FEATURE USAGE, FUNNEL, AND IOS DISTRIBUTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
        {/* Feature Usage */}
        <div
          style={{
            background: 'var(--color-bg)',
            padding: '22px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-divider)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '15px', margin: '0 0 14px', color: 'var(--color-text)' }}>
            Funciones más utilizadas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {featureUsageData.map((f) => (
              <div key={f.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500 }}>{f.name}</span>
                  <span style={{ opacity: 0.7, fontWeight: 600 }}>{f.pct}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'var(--color-neutral-200)' }}>
                  <div
                    style={{
                      width: `${f.pct}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: f.color,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div
          style={{
            background: 'var(--color-bg)',
            padding: '22px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-divider)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ fontSize: '15px', margin: '0 0 14px', color: 'var(--color-text)' }}>
            Conversión: registro → primera lectura → pago
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
            {funnelData.map((fn) => (
              <div key={fn.stage} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: fn.width,
                    height: '34px',
                    background: 'var(--color-accent-500)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '10px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                  }}
                >
                  {fn.pct}%
                </div>
                <span style={{ fontSize: '12.5px', color: 'var(--color-text)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {fn.stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* iOS Distribution */}
        <div
          style={{
            background: 'var(--color-bg)',
            padding: '22px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-divider)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h3 style={{ fontSize: '15px', margin: '0 0 14px', color: 'var(--color-text)', width: '100%' }}>
            Distribución por versión de iOS
          </h3>
          <div style={{ width: '100%', height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={iosDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {iosDistData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-neutral-900)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: number) => [`${val}%`, 'Cuota']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
            {iosDistData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
                <span>
                  {item.name}: <strong>{item.value}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
