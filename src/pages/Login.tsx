import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/auth-context';

const emailSchema = z.object({
  email: z.string().min(1, 'Introduce tu correo').email('Introduce un correo electrónico válido'),
});

const otpSchema = z.object({
  token: z.string().regex(/^\d{6}$/, 'Introduce el código de 6 dígitos'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const {
    isAuthenticated,
    initializing,
    loading,
    error,
    otpRequested,
    pendingEmail,
    requestOtp,
    verifyOtp,
    resetOtp,
  } = useAuth();

  const destination =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin';

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [destination, initializing, isAuthenticated, navigate]);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { token: '' },
  });

  const onRequestOtp = async ({ email }: EmailFormData) => {
    setResendMessage(null);
    await requestOtp(email);
  };

  const onVerifyOtp = async ({ token }: OtpFormData) => {
    setResendMessage(null);
    await verifyOtp(token);
  };

  const resendOtp = async () => {
    if (!pendingEmail) return;
    const sent = await requestOtp(pendingEmail);
    if (sent) setResendMessage('Enviamos un código nuevo. Revisa también tu carpeta de spam.');
  };

  const editEmail = () => {
    otpForm.reset();
    setResendMessage(null);
    resetOtp();
  };

  const fieldError = otpRequested ? otpForm.formState.errors.token?.message : emailForm.formState.errors.email?.message;

  return (
    <main
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
          aria-label="Volver al inicio de Lectoria"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '22px',
            textDecoration: 'none',
          }}
        >
          <img
            src="/assets/lectoria-logo-institucional.png"
            alt=""
            style={{ width: '34px', height: '34px', borderRadius: '9px', objectFit: 'cover' }}
          />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--color-neutral-100)' }}>
            Lectoria
          </span>
        </Link>

        <section
          className="card elev-lg"
          style={{
            background: 'var(--color-bg)',
            padding: 'clamp(28px, 5vw, 40px)',
            gap: '22px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '21px', margin: '0 0 4px', color: 'var(--color-text)' }}>
              {otpRequested ? 'Verifica tu código' : 'Administración de Lectoria'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-neutral-700)', margin: 0 }}>
              {otpRequested
                ? `Escribe el código de 6 dígitos enviado a ${pendingEmail ?? 'tu correo'}.`
                : 'Acceso restringido exclusivamente a cuentas con rol de administrador.'}
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
              border: '1px solid var(--color-accent-2-300)',
            }}
          >
            <Shield size={18} style={{ color: 'var(--color-accent-2-700)', flex: 'none', marginTop: '2px' }} />
            <span style={{ fontSize: '12.5px', color: 'var(--color-accent-2-800)', lineHeight: '1.5' }}>
              El código es de un solo uso. No compartas el correo ni el código con otras personas.
            </span>
          </div>

          {(error || fieldError) && (
            <div
              role="alert"
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
                background: 'var(--color-accent-100)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                border: '1px solid var(--color-accent-300)',
              }}
            >
              <AlertCircle size={18} style={{ color: 'var(--color-accent-800)', flex: 'none', marginTop: '1px' }} />
              <span style={{ fontSize: '12.5px', color: 'var(--color-accent-800)', lineHeight: '1.5' }}>
                {error || fieldError}
              </span>
            </div>
          )}

          {resendMessage && (
            <p role="status" style={{ margin: 0, fontSize: '12.5px', color: 'var(--color-accent-2-800)' }}>
              {resendMessage}
            </p>
          )}

          {otpRequested ? (
            <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="field">
                <label htmlFor="admin-code">Código de acceso</label>
                <input
                  id="admin-code"
                  className="input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  disabled={loading || initializing}
                  {...otpForm.register('token', {
                    onChange: (event) => {
                      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
                    },
                  })}
                  style={{ letterSpacing: '6px', fontSize: '18px', textAlign: 'center' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading || initializing}>
                {loading ? <Loader2 size={18} className="lect-spinner" /> : <KeyRound size={18} />}
                {loading ? 'Verificando…' : 'Verificar y entrar'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-secondary" onClick={editEmail} disabled={loading}>
                  <ArrowLeft size={16} /> Cambiar correo
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => void resendOtp()} disabled={loading}>
                  Reenviar código
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={emailForm.handleSubmit(onRequestOtp)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="field">
                <label htmlFor="admin-email">Correo</label>
                <input
                  id="admin-email"
                  className="input"
                  type="email"
                  placeholder="tu@lectoria.app"
                  autoComplete="email"
                  disabled={loading || initializing}
                  {...emailForm.register('email')}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading || initializing}>
                {loading || initializing ? <Loader2 size={18} className="lect-spinner" /> : <Mail size={18} />}
                {initializing ? 'Comprobando sesión…' : loading ? 'Enviando código…' : 'Enviar código de acceso'}
              </button>
            </form>
          )}
        </section>

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
    </main>
  );
};
