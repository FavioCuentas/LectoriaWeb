import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const magicLinkSchema = z.object({
  email: z.string().min(1, 'Introduce tu correo').email('Introduce un correo electrónico válido'),
});

type MagicLinkFormData = z.infer<typeof magicLinkSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isAuthenticated,
    initializing,
    loading,
    error,
    magicLinkSent,
    signInWithMagicLink,
    resetMagicLink,
  } = useAuth();

  const destination =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin';

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [destination, initializing, isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkFormData>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }: MagicLinkFormData) => {
    await signInWithMagicLink(email);
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
          {magicLinkSent ? (
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
              <h1 style={{ fontSize: '20px', margin: 0 }}>Revisa tu correo</h1>
              <p style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--color-text) 65%, transparent)', margin: 0 }}>
                Te enviamos un enlace seguro para acceder a Lectoria. El enlace abrirá una sesión válida en este navegador.
              </p>
              <button
                type="button"
                onClick={resetMagicLink}
                style={{ background: 'none', border: 'none', color: 'var(--color-accent-700)', cursor: 'pointer', fontWeight: 600 }}
              >
                Usar otro correo
              </button>
            </div>
          ) : (
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
                  Recibirás un enlace de acceso de un solo uso. No compartas el correo ni el enlace con otras personas.
                </span>
              </div>

              {(error || errors.email) && (
                <div
                  role="alert"
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
                >
                  <AlertCircle size={18} style={{ color: 'var(--color-accent-800)', flex: 'none', marginTop: '1px' }} />
                  <span style={{ fontSize: '12.5px', color: 'var(--color-accent-800)', lineHeight: '1.5' }}>
                    {error || errors.email?.message}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="field">
                  <label htmlFor="admin-email" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Correo
                  </label>
                  <input
                    id="admin-email"
                    className="input"
                    type="email"
                    placeholder="tu@lectoria.app"
                    autoComplete="email"
                    disabled={loading || initializing}
                    {...register('email')}
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

                <button
                  type="submit"
                  disabled={loading || initializing}
                  style={{
                    minHeight: '44px',
                    width: '100%',
                    background: 'var(--color-accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: loading || initializing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {loading || initializing ? (
                    <>
                      <Loader2 size={18} className="lect-spinner" />
                      <span>{initializing ? 'Comprobando sesión…' : 'Enviando enlace…'}</span>
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      <span>Enviar enlace de acceso</span>
                    </>
                  )}
                </button>
              </form>
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
