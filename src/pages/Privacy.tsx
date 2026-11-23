import React, { useEffect } from 'react';

// Política de privacidad pública. Es la URL que piden App Store Connect y Google Play
// (https://lectoria.orvexaio.com/privacidad) y la de eliminación de cuenta (#eliminar-cuenta).
// Describe lo que hacen las apps de verdad: si cambia lo que se envía, actualizar aquí.

export const SUPPORT_EMAIL = 'favio.cuentas@orvexaio.com';
const UPDATED_AT = '23 de noviembre de 2026';

const Section: React.FC<{ id?: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} style={{ marginTop: '36px', scrollMarginTop: '24px' }}>
    <h2 style={{ fontSize: '20px', margin: '0 0 12px' }}>{title}</h2>
    {children}
  </section>
);

export const Privacy: React.FC = () => {
  useEffect(() => {
    document.title = 'Política de privacidad — Lectoria';
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="container" style={{ paddingTop: '24px', paddingBottom: '8px' }}>
        <a href="/" className="lect-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--color-text)' }}>
          <img src="/assets/lectoria-logo-institucional.png" alt="" style={{ width: '30px', height: '30px', borderRadius: '8px', objectFit: 'cover' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '16px' }}>Lectoria</span>
        </a>
      </header>

      <main className="container" style={{ maxWidth: '760px', paddingTop: '24px', paddingBottom: '72px', lineHeight: 1.7, fontSize: '15.5px' }}>
        <h1 style={{ fontSize: 'clamp(30px, 4vw, 40px)', margin: '0 0 8px' }}>Política de privacidad</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>Lectoria para iPhone, iPad y Android · Última actualización: {UPDATED_AT}</p>

        <p style={{ marginTop: '24px' }}>
          Lectoria es una app de lectura y estudio de Orvexa IO (Bolivia). Está diseñada para que tus libros y apuntes
          se queden en tu dispositivo. Aquí explicamos, sin letra pequeña, qué datos salen de él y para qué.
        </p>

        <Section title="Lo que se queda en tu dispositivo">
          <ul>
            <li>Tus documentos (EPUB, PDF, TXT, Markdown, presentaciones y texto pegado), resaltados, notas, marcadores y progreso de lectura.</li>
            <li>El texto que seleccionas para la IA de estudio, el diccionario o la traducción: estas funciones trabajan en el propio dispositivo.
              La primera vez que traduces a un idioma, el sistema descarga un paquete de idioma (Apple en iOS, Google ML Kit en Android); tu texto no se envía.</li>
          </ul>
          <p>No subimos tus documentos a nuestros servidores. Si borras la app, se borran también.</p>
        </Section>

        <Section title="Estadísticas de uso anónimas">
          <p>
            Para saber qué funciones se usan y detectar errores, la app envía eventos de uso como «se importó un documento EPUB»,
            «terminó una sesión de lectura de 12 minutos», «se creó un resaltado» o «se abrió la pantalla de planes». Cada evento incluye:
          </p>
          <ul>
            <li>el tipo de evento y datos técnicos sin contenido (formato del archivo, rango de tamaño, duración, idioma de destino de una traducción, código de error);</li>
            <li>un identificador aleatorio de la instalación y de la sesión, creados por la app (no son identificadores del teléfono ni publicitarios);</li>
            <li>la versión de la app, la versión del sistema y el tipo de dispositivo (teléfono o tableta);</li>
            <li>tu identificador de cuenta, solo si iniciaste sesión.</li>
          </ul>
          <p>
            Nunca incluyen títulos, nombres de archivo, el texto de tus documentos, resaltados o notas, ni tu correo.
            Puedes desactivarlas cuando quieras: en iOS en <strong>Perfil → Privacidad → Compartir analítica anónima</strong> y en Android en{' '}
            <strong>Perfil → Compartir estadísticas anónimas</strong>. Al desactivarlas, la app deja de registrar y de enviar eventos.
          </p>
        </Section>

        <Section title="Cuenta (opcional)">
          <p>
            Puedes usar Lectoria sin cuenta. Si inicias sesión guardamos tu correo electrónico y, si entras con Google, el nombre que Google nos comparte.
            Los usamos para identificarte y, si estudias en una institución con convenio, para validar tu acceso institucional
            (guardamos el correo institucional y la institución).
          </p>
        </Section>

        <Section title="Compras">
          <p>
            Las suscripciones y compras las procesan Apple (App Store) y Google (Google Play). Nosotros no recibimos ni guardamos los datos de tu tarjeta;
            la app solo recibe la confirmación de la tienda para activar Premium.
          </p>
        </Section>

        <Section title="Con quién compartimos datos">
          <p>
            No vendemos datos, no mostramos publicidad y no usamos rastreo entre apps. Solo trabajamos con los proveedores necesarios para el servicio:
            Supabase (inicio de sesión y almacenamiento de la cuenta y de las estadísticas de uso), Apple y Google (tiendas, compras y paquetes de idioma).
            Toda la comunicación viaja cifrada (HTTPS).
          </p>
        </Section>

        <Section title="Tus derechos">
          <p>
            Puedes pedirnos acceso, corrección o eliminación de tus datos escribiendo a <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            Conservamos los datos de la cuenta mientras la cuenta exista, y las estadísticas de uso solo el tiempo necesario para elaborar cifras agregadas.
          </p>
        </Section>

        <Section id="eliminar-cuenta" title="Eliminar tu cuenta y tus datos">
          <ul>
            <li><strong>Desde la app:</strong> Perfil → Eliminar cuenta. Se borran al instante tu cuenta, tu acceso institucional y tus datos de compras en nuestros servidores; las estadísticas de uso que ya existían quedan desvinculadas de ti y son totalmente anónimas.</li>
            <li>
              <strong>Si ya no tienes la app:</strong> escribe a <a href={`mailto:${SUPPORT_EMAIL}?subject=Eliminar%20mi%20cuenta%20de%20Lectoria`}>{SUPPORT_EMAIL}</a>{' '}
              desde el correo de tu cuenta con el asunto «Eliminar mi cuenta de Lectoria». La eliminamos en un plazo máximo de 30 días y te avisamos al terminar.
            </li>
            <li>Los documentos y apuntes guardados en tu dispositivo se borran al desinstalar la app.</li>
          </ul>
        </Section>

        <Section title="Menores">
          <p>Lectoria no está dirigida a menores de 13 años y no recopilamos a sabiendas datos de menores de esa edad.</p>
        </Section>

        <Section title="Cambios y contacto">
          <p>
            Si cambiamos esta política publicaremos la nueva versión en esta página con su fecha. Para cualquier consulta escribe a{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        </Section>
      </main>
    </div>
  );
};
