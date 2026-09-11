import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, Database, RefreshCw } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AdminOutletContext, StatMetric } from '../../types/dashboard';
import { PLAN_LABELS } from '../../config/plans';

const numberFormatter = new Intl.NumberFormat('es-ES');
const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const chartColors = ['#c67139', '#7a8a5e', '#d67f48', '#56633f', '#f6a06b', '#8fa073'];

const EmptyChart: React.FC = () => (
  <div style={{ minHeight: '190px', display: 'grid', placeContent: 'center', color: 'var(--color-neutral-600)', fontSize: '13px' }}>
    Sin eventos para el periodo seleccionado.
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="card elev-sm" style={{ padding: '22px', background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}>
    <h3 style={{ fontSize: '15px', margin: '0 0 14px' }}>{title}</h3>
    {children}
  </section>
);

export const OverviewTab: React.FC = () => {
  const { dateRange, dashboard, dashboardLoading, dashboardError, reloadDashboard } =
    useOutletContext<AdminOutletContext>();

  if (dashboardLoading) {
    return (
      <div role="status" className="card elev-sm" style={{ padding: '36px', alignItems: 'center', textAlign: 'center' }}>
        <Database size={30} color="var(--color-accent-700)" />
        <h2 style={{ fontSize: '18px', margin: 0 }}>Cargando métricas reales</h2>
        <p style={{ margin: 0, color: 'var(--color-neutral-700)' }}>Consultando el resumen administrativo en Supabase…</p>
      </div>
    );
  }

  if (dashboardError || !dashboard) {
    return (
      <div role="alert" className="card elev-sm" style={{ padding: '36px', alignItems: 'center', textAlign: 'center' }}>
        <AlertCircle size={32} color="var(--color-accent-700)" />
        <h2 style={{ fontSize: '18px', margin: 0 }}>No se pudieron mostrar las métricas</h2>
        <p style={{ maxWidth: '62ch', margin: 0, color: 'var(--color-neutral-700)' }}>
          {dashboardError ?? 'El dashboard no recibió datos.'} No se muestran cifras inventadas como reemplazo.
        </p>
        <button type="button" className="btn btn-primary" onClick={reloadDashboard}>
          <RefreshCw size={16} /> Reintentar
        </button>
      </div>
    );
  }

  const { kpis } = dashboard;
  const planChartData = dashboard.planDistribution.map((item) => ({
    ...item,
    label: PLAN_LABELS[item.plan],
  }));
  const stats: StatMetric[] = [
    { id: 'users', label: 'Usuarios registrados', value: numberFormatter.format(kpis.usersRegistered), delta: 'Total acumulado', deltaType: 'neutral', category: 'users' },
    { id: 'dau', label: 'Usuarios activos diarios', value: numberFormatter.format(kpis.dailyActiveUsers), delta: 'DAU de las últimas 24 horas', deltaType: 'neutral', category: 'users' },
    { id: 'wau', label: 'Usuarios activos semanales', value: numberFormatter.format(kpis.weeklyActiveUsers), delta: 'WAU de los últimos 7 días', deltaType: 'neutral', category: 'users' },
    { id: 'mau', label: 'Usuarios activos mensuales', value: numberFormatter.format(kpis.monthlyActiveUsers), delta: 'MAU de los últimos 30 días', deltaType: 'neutral', category: 'users' },
    { id: 'new-users', label: 'Nuevos usuarios', value: numberFormatter.format(kpis.newUsers), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'neutral', category: 'users' },
    { id: 'free', label: 'Plan Free', value: numberFormatter.format(kpis.freeUsers), delta: 'USD 0', deltaType: 'neutral', category: 'financial' },
    { id: 'annual', label: 'Plan Anual', value: numberFormatter.format(kpis.annualUsers), delta: 'USD 5 por año', deltaType: 'positive', category: 'financial' },
    { id: 'lifetime', label: 'Plan De por vida', value: numberFormatter.format(kpis.lifetimeUsers), delta: 'USD 20 pago único', deltaType: 'positive', category: 'financial' },
    { id: 'paying', label: 'Usuarios de pago', value: numberFormatter.format(kpis.payingUsers), delta: 'Anual + De por vida', deltaType: 'positive', category: 'financial' },
    { id: 'conversion', label: 'Conversión a pago', value: `${kpis.paymentConversionPct.toLocaleString('es-ES')}%`, delta: 'Usuarios de pago / registrados', deltaType: 'neutral', category: 'financial' },
    { id: 'revenue', label: 'Ingresos brutos', value: currencyFormatter.format(kpis.grossRevenueCents / 100), delta: `Transacciones de ${dashboard.rangeDays} días`, deltaType: 'positive', category: 'financial' },
    { id: 'cancellations', label: 'Cancelaciones', value: numberFormatter.format(kpis.cancellations), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'negative', category: 'financial' },
    { id: 'documents', label: 'Documentos importados', value: numberFormatter.format(kpis.documentsImported), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'neutral', category: 'usage' },
    { id: 'reading', label: 'Sesiones de lectura', value: numberFormatter.format(kpis.readingSessions), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'neutral', category: 'usage' },
    { id: 'reading-time', label: 'Tiempo promedio de lectura', value: `${kpis.avgReadingMinutes.toLocaleString('es-ES')} min`, delta: 'Por sesión finalizada', deltaType: 'neutral', category: 'usage' },
    { id: 'dictionary', label: 'Uso de diccionario', value: numberFormatter.format(kpis.dictionaryUses), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'neutral', category: 'usage' },
    { id: 'translation', label: 'Uso de traducción', value: numberFormatter.format(kpis.translationUses), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'neutral', category: 'usage' },
    { id: 'ai', label: 'Uso de IA', value: numberFormatter.format(kpis.aiUses), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'neutral', category: 'usage' },
    { id: 'tts', label: 'Uso de texto a voz', value: numberFormatter.format(kpis.textToSpeechUses), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'neutral', category: 'usage' },
    { id: 'errors', label: 'Errores técnicos', value: numberFormatter.format(kpis.technicalErrors), delta: `Últimos ${dashboard.rangeDays} días`, deltaType: 'negative', category: 'technical' },
    { id: 'version', label: 'Versión más utilizada', value: kpis.topAppVersion ?? 'Sin datos', delta: kpis.topAppVersion ? `${kpis.topAppVersionPct.toLocaleString('es-ES')}% de dispositivos` : 'Aún sin telemetría', deltaType: 'neutral', category: 'technical' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section>
        <h2 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--color-neutral-800)' }}>
          Métricas clave ({dateRange === '7d' ? 'últimos 7 días' : dateRange === '30d' ? 'últimos 30 días' : 'últimos 90 días'})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {stats.map((metric) => (
            <article
              key={metric.id}
              className="card elev-sm"
              style={{ padding: '16px', gap: '6px', background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}
            >
              <div style={{ fontSize: '12px', color: 'var(--color-neutral-700)', fontWeight: 500 }}>{metric.label}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px' }}>{metric.value}</div>
              <div style={{ fontSize: '11px', color: metric.deltaType === 'positive' ? 'var(--color-accent-2-700)' : metric.deltaType === 'negative' ? 'var(--color-accent-700)' : 'var(--color-neutral-600)' }}>
                {metric.delta}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: '18px' }}>
        <ChartCard title="Evolución de usuarios activos">
          {dashboard.activeUsers.length === 0 ? <EmptyChart /> : (
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboard.activeUsers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#645c50' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#645c50' }} allowDecimals={false} />
                  <Tooltip formatter={(value: number) => [numberFormatter.format(value), 'Usuarios activos']} />
                  <Area type="monotone" dataKey="users" stroke="var(--color-accent)" strokeWidth={3} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Formatos más utilizados">
          {dashboard.formatUsage.length === 0 ? <EmptyChart /> : (
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.formatUsage} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-divider)" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [numberFormatter.format(value), 'Importaciones']} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {dashboard.formatUsage.map((item, index) => <Cell key={item.name} fill={chartColors[index % chartColors.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Funciones más utilizadas">
          {dashboard.featureUsage.length === 0 ? <EmptyChart /> : (
            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.featureUsage} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-divider)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value: number) => [numberFormatter.format(value), 'Usos']} />
                  <Bar dataKey="count" fill="var(--color-accent-2-500)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Conversión: registro → primera lectura → pago">
          {dashboard.funnel.length === 0 ? <EmptyChart /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
              {dashboard.funnel.map((step) => (
                <div key={step.stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span>{step.stage}</span>
                    <span>{numberFormatter.format(step.count)} · {step.pct.toLocaleString('es-ES')}%</span>
                  </div>
                  <div style={{ height: '28px', borderRadius: '8px', background: 'var(--color-neutral-200)' }}>
                    <div style={{ width: `${Math.max(step.pct, step.count > 0 ? 2 : 0)}%`, height: '100%', borderRadius: '8px', background: 'var(--color-accent-500)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title="Planes de Lectoria">
          {dashboard.planDistribution.length === 0 ? <EmptyChart /> : (
            <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planChartData} dataKey="count" nameKey="label" cx="50%" cy="50%" innerRadius={45} outerRadius={78} label={(entry) => `${String(entry.label)} · ${Number(entry.pct).toLocaleString('es-ES')}%`}>
                    {planChartData.map((item, index) => <Cell key={item.plan} fill={chartColors[index % chartColors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => [numberFormatter.format(value), 'Usuarios']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Versiones por plataforma">
          {dashboard.platformVersions.length === 0 ? <EmptyChart /> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%' }}>
                <thead><tr><th>Plataforma</th><th>Versión</th><th>Dispositivos</th><th>%</th></tr></thead>
                <tbody>
                  {dashboard.platformVersions.map((item) => (
                    <tr key={`${item.platform}-${item.version}`}>
                      <td>{item.platform === 'ios' ? 'iOS' : item.platform === 'android' ? 'Android' : 'Otra'}</td>
                      <td>{item.version}</td>
                      <td>{numberFormatter.format(item.devices)}</td>
                      <td>{item.pct.toLocaleString('es-ES')}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  );
};
