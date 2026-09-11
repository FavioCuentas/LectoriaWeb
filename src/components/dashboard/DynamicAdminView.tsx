import React from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { AlertCircle, Database, RefreshCw, ShieldCheck } from 'lucide-react';
import { PLAN_LABELS } from '../../config/plans';
import type { AdminOutletContext } from '../../types/dashboard';

const numberFormatter = new Intl.NumberFormat('es-ES');
const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const Card: React.FC<{ title: string; value: string; detail: string }> = ({ title, value, detail }) => (
  <article className="card elev-sm" style={{ padding: '20px', background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}>
    <div style={{ fontSize: '12px', color: 'var(--color-neutral-700)' }}>{title}</div>
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px' }}>{value}</div>
    <div style={{ fontSize: '11.5px', color: 'var(--color-neutral-600)' }}>{detail}</div>
  </article>
);

const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
    {children}
  </div>
);

const DataTable: React.FC<{ headers: string[]; rows: Array<Array<string | number>> }> = ({ headers, rows }) => (
  <div style={{ overflowX: 'auto', background: 'var(--color-bg)', border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)' }}>
    <table className="table" style={{ width: '100%' }}>
      <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={headers.length} style={{ textAlign: 'center', color: 'var(--color-neutral-600)' }}>Sin datos para el periodo.</td></tr>
        ) : rows.map((row, rowIndex) => (
          <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PendingModule: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <section className="card elev-sm" style={{ padding: '40px', alignItems: 'center', textAlign: 'center', background: 'var(--color-bg)', border: '1px solid var(--color-divider)' }}>
    <ShieldCheck size={36} color="var(--color-accent-700)" />
    <h2 style={{ fontSize: '20px', margin: 0 }}>{title}</h2>
    <p style={{ maxWidth: '62ch', margin: 0, color: 'var(--color-neutral-700)' }}>{description}</p>
    <span className="tag tag-accent-2">Backend administrativo pendiente</span>
  </section>
);

export const DynamicAdminView: React.FC = () => {
  const { pathname } = useLocation();
  const { dashboard, dashboardLoading, dashboardError, reloadDashboard } = useOutletContext<AdminOutletContext>();

  if (dashboardLoading) {
    return (
      <div role="status" className="card elev-sm" style={{ padding: '36px', alignItems: 'center', textAlign: 'center' }}>
        <Database size={30} color="var(--color-accent-700)" />
        <h2 style={{ fontSize: '18px', margin: 0 }}>Cargando datos del módulo</h2>
      </div>
    );
  }

  if (dashboardError || !dashboard) {
    return (
      <div role="alert" className="card elev-sm" style={{ padding: '36px', alignItems: 'center', textAlign: 'center' }}>
        <AlertCircle size={32} color="var(--color-accent-700)" />
        <h2 style={{ fontSize: '18px', margin: 0 }}>Datos no disponibles</h2>
        <p style={{ maxWidth: '62ch', margin: 0, color: 'var(--color-neutral-700)' }}>
          {dashboardError ?? 'El módulo no recibió datos.'} No se muestran registros simulados.
        </p>
        <button type="button" className="btn btn-primary" onClick={reloadDashboard}>
          <RefreshCw size={16} /> Reintentar
        </button>
      </div>
    );
  }

  const { kpis } = dashboard;
  const period = `Últimos ${dashboard.rangeDays} días`;

  if (pathname === '/admin/usuarios') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Usuarios y planes</h2>
        <CardGrid>
          <Card title="Usuarios registrados" value={numberFormatter.format(kpis.usersRegistered)} detail="Total acumulado" />
          <Card title="Nuevos usuarios" value={numberFormatter.format(kpis.newUsers)} detail={period} />
          <Card title="Plan Free" value={numberFormatter.format(kpis.freeUsers)} detail="USD 0" />
          <Card title="Plan Anual" value={numberFormatter.format(kpis.annualUsers)} detail="USD 5 por año" />
          <Card title="Plan De por vida" value={numberFormatter.format(kpis.lifetimeUsers)} detail="USD 20 pago único" />
        </CardGrid>
        <p style={{ margin: 0, color: 'var(--color-neutral-700)', fontSize: '13px' }}>
          Esta vista muestra agregados. El listado con correos, invitaciones y cambios de rol requiere un RPC administrativo separado y auditado.
        </p>
      </section>
    );
  }

  if (pathname === '/admin/analitica') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Analítica de adopción</h2>
        <CardGrid>
          <Card title="DAU" value={numberFormatter.format(kpis.dailyActiveUsers)} detail="Usuarios únicos en 24 horas" />
          <Card title="WAU" value={numberFormatter.format(kpis.weeklyActiveUsers)} detail="Usuarios únicos en 7 días" />
          <Card title="MAU" value={numberFormatter.format(kpis.monthlyActiveUsers)} detail="Usuarios únicos en 30 días" />
          <Card title="Conversión a pago" value={`${kpis.paymentConversionPct.toLocaleString('es-ES')}%`} detail="Pagadores / registrados" />
        </CardGrid>
        <DataTable
          headers={['Fecha', 'Usuarios activos']}
          rows={dashboard.activeUsers.map((item) => [item.date, numberFormatter.format(item.users)])}
        />
      </section>
    );
  }

  if (pathname === '/admin/documentos') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Documentos importados</h2>
        <CardGrid><Card title="Importaciones" value={numberFormatter.format(kpis.documentsImported)} detail={period} /></CardGrid>
        <DataTable headers={['Formato', 'Importaciones', 'Participación']} rows={dashboard.formatUsage.map((item) => [item.name, numberFormatter.format(item.count), `${item.pct.toLocaleString('es-ES')}%`])} />
      </section>
    );
  }

  if (pathname === '/admin/lectura') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Actividad de lectura</h2>
        <CardGrid>
          <Card title="Sesiones de lectura" value={numberFormatter.format(kpis.readingSessions)} detail={period} />
          <Card title="Duración promedio" value={`${kpis.avgReadingMinutes.toLocaleString('es-ES')} min`} detail="Solo sesiones finalizadas" />
          <Card title="Uso de texto a voz" value={numberFormatter.format(kpis.textToSpeechUses)} detail={period} />
        </CardGrid>
      </section>
    );
  }

  if (pathname === '/admin/herramientas') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Herramientas educativas</h2>
        <CardGrid>
          <Card title="Diccionario" value={numberFormatter.format(kpis.dictionaryUses)} detail={period} />
          <Card title="Traducción" value={numberFormatter.format(kpis.translationUses)} detail={period} />
          <Card title="Texto a voz" value={numberFormatter.format(kpis.textToSpeechUses)} detail={period} />
        </CardGrid>
        <DataTable headers={['Función', 'Usos', 'Participación']} rows={dashboard.featureUsage.map((item) => [item.name, numberFormatter.format(item.count), `${item.pct.toLocaleString('es-ES')}%`])} />
      </section>
    );
  }

  if (pathname === '/admin/ia') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Inteligencia artificial</h2>
        <CardGrid><Card title="Acciones de IA" value={numberFormatter.format(kpis.aiUses)} detail={period} /></CardGrid>
        <p style={{ margin: 0, color: 'var(--color-neutral-700)', fontSize: '13px' }}>
          La analítica registra el tipo de acción y su resultado técnico; no almacena prompts ni contenido de los documentos.
        </p>
      </section>
    );
  }

  if (pathname === '/admin/suscripciones') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Suscripciones e ingresos</h2>
        <CardGrid>
          <Card title="Usuarios de pago" value={numberFormatter.format(kpis.payingUsers)} detail="Anual + De por vida" />
          <Card title="Conversión a pago" value={`${kpis.paymentConversionPct.toLocaleString('es-ES')}%`} detail="Pagadores / registrados" />
          <Card title="Ingresos brutos" value={currencyFormatter.format(kpis.grossRevenueCents / 100)} detail={period} />
          <Card title="Cancelaciones" value={numberFormatter.format(kpis.cancellations)} detail={period} />
        </CardGrid>
        <DataTable headers={['Plan', 'Usuarios', 'Participación']} rows={dashboard.planDistribution.map((item) => [PLAN_LABELS[item.plan], numberFormatter.format(item.count), `${item.pct.toLocaleString('es-ES')}%`])} />
      </section>
    );
  }

  if (pathname === '/admin/errores') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Errores técnicos</h2>
        <CardGrid><Card title="Eventos de error" value={numberFormatter.format(kpis.technicalErrors)} detail={period} /></CardGrid>
        <p style={{ margin: 0, color: 'var(--color-neutral-700)', fontSize: '13px' }}>
          Los eventos deben incluir código, plataforma y versión de la app, sin texto de documentos, credenciales ni datos personales.
        </p>
      </section>
    );
  }

  if (pathname === '/admin/versiones') {
    return (
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Versiones de iOS y Android</h2>
        <CardGrid><Card title="Versión más utilizada" value={kpis.topAppVersion ?? 'Sin datos'} detail={kpis.topAppVersion ? `${kpis.topAppVersionPct.toLocaleString('es-ES')}% de dispositivos` : 'Esperando telemetría'} /></CardGrid>
        <DataTable headers={['Plataforma', 'Versión', 'Dispositivos', 'Participación']} rows={dashboard.platformVersions.map((item) => [item.platform === 'ios' ? 'iOS' : item.platform === 'android' ? 'Android' : 'Otra', item.version, numberFormatter.format(item.devices), `${item.pct.toLocaleString('es-ES')}%`])} />
      </section>
    );
  }

  const pendingModules: Record<string, { title: string; description: string }> = {
    '/admin/notificaciones': {
      title: 'Centro de notificaciones',
      description: 'El diseño está reservado, pero el envío se mantendrá deshabilitado hasta integrar APNs/FCM, segmentación, aprobación y registro de auditoría.',
    },
    '/admin/configuracion': {
      title: 'Configuración del sistema',
      description: 'La interfaz no simula guardados. Este módulo necesita una tabla de configuración con RLS, validación y bitácora de cambios.',
    },
    '/admin/roles': {
      title: 'Roles y permisos',
      description: 'Los roles se administrarán mediante una operación de servidor. Ningún usuario podrá elevar su propio rol desde el navegador.',
    },
    '/admin/auditoria': {
      title: 'Auditoría administrativa',
      description: 'La bitácora se mostrará cuando las acciones administrativas escriban eventos inmutables desde funciones de servidor.',
    },
  };

  const pending = pendingModules[pathname] ?? {
    title: 'Módulo administrativo',
    description: 'Esta ruta todavía no tiene un contrato de datos aprobado.',
  };
  return <PendingModule title={pending.title} description={pending.description} />;
};
