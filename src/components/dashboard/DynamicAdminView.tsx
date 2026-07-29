import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRecord, AuditRecord } from '../../types/dashboard';
import {
  Search,
  UserPlus,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Save,
} from 'lucide-react';

const configSchema = z.object({
  siteName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  supportEmail: z.string().email('Introduce un correo válido'),
  sessionTimeout: z.coerce.number().min(5).max(120),
  require2FA: z.boolean(),
  maintenanceMode: z.boolean(),
});

type ConfigFormData = z.infer<typeof configSchema>;

export const DynamicAdminView: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // State for Users tab
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<'Todos' | 'Gratuito' | 'Premium'>('Todos');
  const [userList, setUserList] = useState<UserRecord[]>([
    { id: 'usr-1', name: 'Sofía Martínez', email: 'sofia.m@gmail.com', plan: 'Premium', registeredAt: '2026-06-12', lastActive: 'Hace 10 min', documentsCount: 14, status: 'Activo' },
    { id: 'usr-2', name: 'Carlos Mendoza', email: 'carlos.m@hotmail.com', plan: 'Gratuito', registeredAt: '2026-06-18', lastActive: 'Hace 2 horas', documentsCount: 3, status: 'Activo' },
    { id: 'usr-3', name: 'Valentina López', email: 'v.lopez@yahoo.es', plan: 'Premium', registeredAt: '2026-05-04', lastActive: 'Ayer', documentsCount: 29, status: 'Activo' },
    { id: 'usr-4', name: 'Mateo Hernández', email: 'mateo.h@outlook.com', plan: 'Gratuito', registeredAt: '2026-07-01', lastActive: 'Hace 5 días', documentsCount: 1, status: 'Inactivo' },
    { id: 'usr-5', name: 'Camila Torres', email: 'camila.t@universidad.edu', plan: 'Premium', registeredAt: '2026-04-20', lastActive: 'Hace 15 min', documentsCount: 42, status: 'Activo' },
  ]);

  // Settings form with Zod
  const {
    register: registerConfig,
    handleSubmit: handleSubmitConfig,
    formState: { errors: configErrors, isSubmitSuccessful },
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      siteName: 'Lectoria Admin Panel',
      supportEmail: 'soporte@lectoria.app',
      sessionTimeout: 30,
      require2FA: true,
      maintenanceMode: false,
    },
  });

  // Notification broadcast form state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSent, setNotifSent] = useState(false);

  // Sample Audit Logs
  const auditLogs: AuditRecord[] = [
    { id: 'aud-101', timestamp: '2026-07-24 14:32:05', adminName: 'Administrador Lectoria', action: 'Login verificado', details: 'Inicio de sesión con 2FA exitoso', ipAddress: '190.142.12.84' },
    { id: 'aud-102', timestamp: '2026-07-24 12:15:22', adminName: 'Administrador Lectoria', action: 'Exportación CSV', details: 'Informe de Resumen generado (30d)', ipAddress: '190.142.12.84' },
    { id: 'aud-103', timestamp: '2026-07-23 18:40:10', adminName: 'Soporte Técnico', action: 'Modificación de rol', details: 'Usuario #usr-3 actualizado a Premium', ipAddress: '186.90.101.4' },
  ];

  // Filtering users
  const filteredUsers = userList.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'Todos' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const toggleUserStatus = (id: string) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Activo' ? 'Inactivo' : 'Activo' } : u))
    );
  };

  // 1. USUARIOS TAB
  if (path === '/admin/usuarios') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', margin: 0 }}>Gestión de Usuarios</h2>
          <button
            type="button"
            onClick={() => alert('Modal para registrar nuevo usuario administrativo en desarrollo.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <UserPlus size={16} /> Crear usuario
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#82796a' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o correo…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                background: '#fff',
                fontSize: '13.5px',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={15} style={{ color: '#82796a' }} />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as 'Todos' | 'Gratuito' | 'Premium')}
              style={{
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                background: '#fff',
                fontSize: '13px',
              }}
            >
              <option value="Todos">Todos los planes</option>
              <option value="Gratuito">Gratuito</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}>
                <th style={{ padding: '12px 16px' }}>Usuario</th>
                <th style={{ padding: '12px 16px' }}>Plan</th>
                <th style={{ padding: '12px 16px' }}>Registro</th>
                <th style={{ padding: '12px 16px' }}>Última actividad</th>
                <th style={{ padding: '12px 16px' }}>Docs</th>
                <th style={{ padding: '12px 16px' }}>Estado</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#645c50' }}>
                    No se encontraron usuarios coincidentes.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: '#645c50' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          background: u.plan === 'Premium' ? 'var(--color-accent-100)' : 'var(--color-neutral-200)',
                          color: u.plan === 'Premium' ? 'var(--color-accent-800)' : 'var(--color-neutral-800)',
                        }}
                      >
                        {u.plan}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12.5px' }}>{u.registeredAt}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12.5px' }}>{u.lastActive}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.documentsCount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: u.status === 'Activo' ? 'var(--color-accent-2-700)' : 'var(--color-accent-700)',
                        }}
                      >
                        ● {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-divider)',
                          background: '#fff',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        {u.status === 'Activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. CONFIGURACION TAB
  if (path === '/admin/configuracion') {
    return (
      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Configuración General del Sistema</h2>

        {isSubmitSuccessful && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              background: 'var(--color-accent-2-100)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-accent-2-800)',
              fontSize: '13.5px',
            }}
          >
            <CheckCircle2 size={18} /> Configuración guardada correctamente.
          </div>
        )}

        <form
          onSubmit={handleSubmitConfig((data) => {
            console.log('Config saved:', data);
          })}
          style={{
            background: 'var(--color-bg)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-divider)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Nombre del sistema
            </label>
            <input
              type="text"
              {...registerConfig('siteName')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                background: '#fff',
              }}
            />
            {configErrors.siteName && (
              <span style={{ fontSize: '12px', color: 'var(--color-accent-800)' }}>{configErrors.siteName.message}</span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Correo de contacto de soporte
            </label>
            <input
              type="email"
              {...registerConfig('supportEmail')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                background: '#fff',
              }}
            />
            {configErrors.supportEmail && (
              <span style={{ fontSize: '12px', color: 'var(--color-accent-800)' }}>{configErrors.supportEmail.message}</span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              Tiempo de expiración de sesión (minutos)
            </label>
            <input
              type="number"
              {...registerConfig('sessionTimeout')}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                background: '#fff',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px' }}>
              <input type="checkbox" {...registerConfig('require2FA')} style={{ accentColor: 'var(--color-accent)', width: '16px', height: '16px' }} />
              Requerir autenticación en 2 pasos para todos los administradores
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px' }}>
              <input type="checkbox" {...registerConfig('maintenanceMode')} style={{ accentColor: 'var(--color-accent)', width: '16px', height: '16px' }} />
              Activar modo de mantenimiento
            </label>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Save size={16} /> Guardar cambios
          </button>
        </form>
      </div>
    );
  }

  // 3. NOTIFICACIONES TAB
  if (path === '/admin/notificaciones') {
    return (
      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Centro de Notificaciones Push</h2>

        {notifSent && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              background: 'var(--color-accent-2-100)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-accent-2-800)',
              fontSize: '13.5px',
            }}
          >
            <CheckCircle2 size={18} /> Notificación programada y enviada a los usuarios.
          </div>
        )}

        <div
          style={{
            background: 'var(--color-bg)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-divider)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Título del mensaje</label>
            <input
              type="text"
              placeholder="Ej. ¡Nueva función de lectura inteligente!"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                background: '#fff',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Cuerpo del mensaje</label>
            <textarea
              rows={3}
              placeholder="Escribe la descripción corta que recibirán en sus dispositivos..."
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-divider)',
                background: '#fff',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (notifTitle) {
                setNotifSent(true);
                setNotifTitle('');
                setNotifMessage('');
                setTimeout(() => setNotifSent(false), 3000);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Bell size={16} /> Enviar notificación
          </button>
        </div>
      </div>
    );
  }

  // 4. AUDITORIA TAB
  if (path === '/admin/auditoria') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Registro de Auditoría y Seguridad</h2>

        <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-divider)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-divider)' }}>
                <th style={{ padding: '12px 16px' }}>Fecha y hora</th>
                <th style={{ padding: '12px 16px' }}>Administrador</th>
                <th style={{ padding: '12px 16px' }}>Acción</th>
                <th style={{ padding: '12px 16px' }}>Detalles</th>
                <th style={{ padding: '12px 16px' }}>Dirección IP</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--color-divider)' }}>
                  <td style={{ padding: '12px 16px', fontSize: '12.5px' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.adminName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'var(--color-neutral-200)', fontSize: '12px', fontWeight: 600 }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{log.details}</td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#645c50' }}>{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // DEFAULT FALLBACK VIEW FOR OTHER TABS
  const sectionTitle = path.replace('/admin/', '').toUpperCase();

  return (
    <div
      style={{
        background: 'var(--color-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-divider)',
        padding: '48px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '14px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--color-accent-100)',
          display: 'grid',
          placeContent: 'center',
          color: 'var(--color-accent-700)',
        }}
      >
        <ShieldCheck size={26} />
      </div>
      <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--color-text)' }}>
        Módulo Administrativo: {sectionTitle}
      </h2>
      <p style={{ maxWidth: '42ch', fontSize: '14px', color: 'color-mix(in srgb, var(--color-text) 65%, transparent)', margin: 0 }}>
        Esta vista interactiva del panel administrativo está lista para conectarse con los endpoints en tiempo real del servidor.
      </p>
    </div>
  );
};
