import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

const credentialsSchema = z.object({
  email: z.string().min(1, 'Introduce tu correo').email('Introduce un correo electrónico válido'),
  password: z.string().min(1, 'Introduce tu contraseña'),
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    step,
    loading,
    error,
    remember,
    loginWithCredentials,
    toggleRemember,
    setError,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerCredentials,
    handleSubmit: handleSubmitCredentials,
    formState: { errors: credentialsErrors },
  } = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: 'admin@lectoria.app',
      password: '',
    },
  });

  const onSubmitCredentials = async (data: CredentialsFormData) => {
    const success = await loginWithCredentials(data.email, data.password);
    if (success) {
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-neutral-900)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '22px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '999px',
              background: 'var(--color-accent)',
              display: 'grid',
              placeContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            L
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-neutral-100)' }}>
            Lectoria
          </span>
        </Link>

        <div
          className="card elev-lg"
          style={{
            background: 'var(--color-bg)',
            padding: 'clamp(28px, 5vw, 40px)',
            gap: '22px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {step === 'credentials' && (
            <div>
              <div style={{ marginBottom: '18px' }}>
                <h1 style={{ fontSize: '21px', margin: '0 0 4px', color: 'var(--color-text)' }}>
                  Administración de Lectoria
                </h1>
                <p style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--color-text) 60%, transparent)', margin: 0 }}>
                  Acceso restringido al personal autorizado.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  background: 'var(--color-accent-2-100)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  border: '1px solid var(--color-accent-2-300)',
                }}
              >
                <Shield size={18} style={{ color: 'var(--color-accent-2-700)', flex: 'none', marginTop: '2px' }} />
                <span style={{ fontSize: '12.5px', color: 'var(--color-accent-2-800)', lineHeight: '1.5' }}>
                  Este panel es solo para administradores de Lectoria. No es posible registrarse públicamente.
                </span>
              </div>

              {(error || credentialsErrors.email || credentialsErrors.password) && (
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start',
                    background: 'var(--color-accent-100)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    border: '1px solid var(--color-accent-300)',
                  }}
                  role="alert"
                >
                  <AlertCircle size={18} style={{ color: 'var(--color-accent-800)', flex: 'none', marginTop: '1px' }} />
                  <span style={{ fontSize: '12.5px', color: 'var(--color-accent-800)', lineHeight: '1.5' }}>
                    {error || credentialsErrors.email?.message || credentialsErrors.password?.message}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmitCredentials(onSubmitCredentials)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="field">
                  <label htmlFor="admin-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Correo
                  </label>
                  <input
                    id="admin-email"
                    className="input"
                    type="email"
                    placeholder="tu@lectoria.app"
                    autoComplete="username"
                    disabled={loading}
                    {...registerCredentials('email')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-divider)',
                      background: '#fff',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div className="field">
                  <label htmlFor="admin-password" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="admin-password"
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={loading}
                      {...registerCredentials('password')}
                      style={{
                        width: '100%',
                        padding: '10px 44px 10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-divider)',
                        background: '#fff',
                        fontSize: '14px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-accent-700)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        padding: '4px 6px',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0' }}>
                  <label
                    style={{
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={toggleRemember}
                      style={{
                        accentColor: 'var(--color-accent)',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    Recordarme
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      setError('Contacta al administrador del sistema para restablecer tu clave.');
                    }}
                    style={{ fontSize: '13px', color: 'var(--color-accent-700)', textDecoration: 'none' }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    minHeight: '44px',
                    width: '100%',
                    background: 'var(--color-accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="lect-spinner" />
                      <span>Verificando…</span>
                    </>
                  ) : (
                    <span>Iniciar sesión</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '12px',
                padding: '12px 0',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--color-accent-2-100)',
                  display: 'grid',
                  placeContent: 'center',
                  color: 'var(--color-accent-2-700)',
                }}
              >
                <CheckCircle2 size={28} />
              </div>
              <h1 style={{ fontSize: '20px', margin: 0 }}>Acceso verificado</h1>
              <p style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--color-text) 65%, transparent)', margin: 0 }}>
                Entrando al panel administrativo de Lectoria…
              </p>
            </div>
          )}
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: 'color-mix(in srgb, var(--color-neutral-100) 55%, transparent)',
            marginTop: '20px',
          }}
        >
          © {new Date().getFullYear()} Lectoria — Panel administrativo interno.
        </p>
      </div>
    </div>
  );
};
