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
import { PLAN_LABELS, planPriceDetail } from '../../config/plans';
import { UNAVAILABLE_VALUE, unavailableDetail } from '../../lib/dashboardAvailability';
import { PLATFORM_LABELS } from '../../lib/adminAnalytics';

const numberFormatter = new Intl.NumberFormat('es-ES');
const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const chartColors = ['#c67139', '#7a8a5e', '#d67f48', '#56633f', '#f6a06b', '#8fa073'];

const EmptyChart: React.FC<{ unavailableKey?: string }> = ({ unavailableKey }) => (
  <div style={{ minHeight: '190px', display: 'grid', placeContent: 'center', textAlign: 'center', color: 'var(--color-neutral-600)', fontSize: '13px' }}>
    {unavailableKey ? `${UNAVAILABLE_VALUE}. ${unavailableDetail(unavailableKey)}.` : 'Sin eventos para el periodo seleccionado.'}
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="card elev-sm" style={{ padding: '22px', background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}>
    <h3 style={{ fontSize: '15px', margin: '0 0 14px' }}>{title}</h3>
    {children}
  </section>
);

export const OverviewTab: React.FC = () => {
  const { dateRange, platform, dashboard, dashboardLoading, dashboardError, reloadDashboard } =
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
  const isUnavailable = (key: string) => dashboard.unavailableMetrics.includes(key);
  const period = `Últimos ${dashboard.rangeDays} días`;
  const rawStats: Array<StatMetric & { sourceKey?: string }> = [
    { id: 'users', label: 'Usuarios registrados', value: numberFormatter.format(kpis.usersRegistered), delta: platform === 'all' ? 'Cuentas creadas (total)' : `Cuentas que usan ${PLATFORM_LABELS[platform]}`, deltaType: 'neutral', category: 'users' },
    { id: 'dau', label: 'Personas activas hoy', value: numberFormatter.format(kpis.dailyActiveUsers), delta: 'Últimas 24 h · incluye invitados', deltaType: 'neutral', category: 'users' },
    { id: 'wau', label: 'Personas activas semanales', value: numberFormatter.format(kpis.weeklyActiveUsers), delta: 'Últimos 7 días · incluye invitados', deltaType: 'neutral', category: 'users' },
    { id: 'mau', label: 'Personas activas mensuales', value: numberFormatter.format(kpis.monthlyActiveUsers), delta: 'Últimos 30 días · incluye invitados', deltaType: 'neutral', category: 'users' },
    { id: 'new-users', label: 'Nuevas cuentas', value: numberFormatter.format(kpis.newUsers), delta: period, deltaType: 'neutral', category: 'users' },
    { id: 'free', sourceKey: 'freeUsers', label: 'Plan Gratis', value: numberFormatter.format(kpis.freeUsers), delta: planPriceDetail('free'), deltaType: 'neutral', category: 'financial' },
    { id: 'semiannual', sourceKey: 'semiannualUsers', label: 'Plan Semestral', value: numberFormatter.format(kpis.semiannualUsers), delta: planPriceDetail('semiannual'), deltaType: 'positive', category: 'financial' },
    { id: 'annual', sourceKey: 'annualUsers', label: 'Plan Anual', value: numberFormatter.format(kpis.annualUsers), delta: planPriceDetail('annual'), deltaType: 'positive', category: 'financial' },
    { id: 'lifetime', sourceKey: 'lifetimeUsers', label: 'Plan De por vida', value: numberFormatter.format(kpis.lifetimeUsers), delta: planPriceDetail('lifetime'), deltaType: 'positive', category: 'financial' },
    { id: 'paying', sourceKey: 'payingUsers', label: 'Usuarios de pago', value: numberFormatter.format(kpis.payingUsers), delta: 'Semestral + Anual + De por vida', deltaType: 'positive', category: 'financial' },
    { id: 'conversion', sourceKey: 'paymentConversionPct', label: 'Conversión a pago', value: `${kpis.paymentConversionPct.toLocaleString('es-ES')}%`, delta: 'Usuarios de pago / registrados', deltaType: 'neutral', category: 'financial' },
    { id: 'revenue', sourceKey: 'grossRevenueCents', label: 'Ingresos brutos', value: currencyFormatter.format(kpis.grossRevenueCents / 100), delta: `Transacciones de ${dashboard.rangeDays} días`, deltaType: 'positive', category: 'financial' },
    { id: 'cancellations', sourceKey: 'cancellations', label: 'Cancelaciones', value: numberFormatter.format(kpis.cancellations), delta: period, deltaType: 'negative', category: 'financial' },
    { id: 'documents', sourceKey: 'documentsImported', label: 'Documentos importados', value: numberFormatter.format(kpis.documentsImported), delta: period, deltaType: 'neutral', category: 'usage' },
    { id: 'reading', sourceKey: 'readingSessions', label: 'Sesiones de lectura', value: numberFormatter.format(kpis.readingSessions), delta: period, deltaType: 'neutral', category: 'usage' },
    { id: 'reading-time', sourceKey: 'avgReadingMinutes', label: 'Tiempo promedio de lectura', value: `${kpis.avgReadingMinutes.toLocaleString('es-ES')} min`, delta: 'Por sesión finalizada', deltaType: 'neutral', category: 'usage' },
    { id: 'dictionary', sourceKey: 'dictionaryUses', label: 'Uso de diccionario', value: numberFormatter.format(kpis.dictionaryUses), delta: period, deltaType: 'neutral', category: 'usage' },
    { id: 'translation', sourceKey: 'translationUses', label: 'Uso de traducción', value: numberFormatter.format(kpis.translationUses), delta: period, deltaType: 'neutral', category: 'usage' },
    { id: 'ai', sourceKey: 'aiUses', label: 'Uso de IA', value: numberFormatter.format(kpis.aiUses), delta: period, deltaType: 'neutral', category: 'usage' },
    { id: 'tts', sourceKey: 'textToSpeechUses', label: 'Uso de texto a voz', value: numberFormatter.format(kpis.textToSpeechUses), delta: period, deltaType: 'neutral', category: 'usage' },
    { id: 'errors', sourceKey: 'technicalErrors', label: 'Errores técnicos', value: numberFormatter.format(kpis.technicalErrors), delta: period, deltaType: 'negative', category: 'technical' },
    { id: 'version', label: 'Versión más utilizada', value: kpis.topAppVersion ?? 'Sin datos', delta: kpis.topAppVersion ? `${kpis.topAppVersionPct.toLocaleString('es-ES')}% de dispositivos` : 'Aún sin telemetría', deltaType: 'neutral', category: 'technical' },
  ];
  const stats: StatMetric[] = rawStats.map(({ sourceKey, ...metric }) =>
    sourceKey && isUnavailable(sourceKey)
      ? { ...metric, value: UNAVAILABLE_VALUE, delta: unavailableDetail(sourceKey), deltaType: 'neutral' }
      : metric
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <section>
        <h2 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--color-neutral-800)' }}>
          Métricas clave ({dateRange === '7d' ? 'últimos 7 días' : dateRange === '30d' ? 'últimos 30 días' : 'últimos 90 días'}
          {platform === 'all' ? '' : ` · solo ${PLATFORM_LABELS[platform]}`})
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
        <ChartCard title="Evolución de personas activas">
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
                  <Tooltip formatter={(value: number) => [numberFormatter.format(value), 'Personas activas']} />
                  <Area type="monotone" dataKey="users" stroke="var(--color-accent)" strokeWidth={3} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Formatos más utilizados">
          {dashboard.formatUsage.length === 0 ? <EmptyChart unavailableKey={isUnavailable('formatUsage') ? 'formatUsage' : undefined} /> : (
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

        <ChartCard title="Embudo: actividad → importación → lectura → compra">
          {dashboard.funnel.length === 0 ? <EmptyChart unavailableKey={isUnavailable('funnel') ? 'funnel' : undefined} /> : (
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
          {dashboard.planDistribution.length === 0 ? <EmptyChart unavailableKey={isUnavailable('planDistribution') ? 'planDistribution' : undefined} /> : (
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
