"use client";

import { Formik, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import BtnTheme from '../components/btnTheme';

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}

function HomeContent() {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <>
      <BtnTheme dark={dark} toggleTheme={toggleTheme} />
      <Formik
        initialValues={{ files: null, password: '' }}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          try {
            const formData = new FormData();
            Array.from(values.files ?? []).forEach((file) => {
              formData.append('files', file);
            });
            formData.append('password', values.password);

            const response = await fetch('/api/files', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              const body = (await response.json().catch(() => null)) as {
                error?: string;
              } | null;
              throw new Error(body?.error ?? 'No se pudieron guardar los archivos');
            }

            const body = (await response.json()) as {
              metadata?: { id?: string };
            };
            if (!body.metadata?.id) {
              throw new Error('La respuesta no contiene un enlace de descarga');
            }

            setDownloadLink(`${window.location.origin}/${body.metadata.id}`);
            setCopied(false);
            setStatus('Archivos guardados correctamente');
          } catch (error) {
            setStatus(
              error instanceof Error
                ? error.message
                : 'No se pudieron guardar los archivos',
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, handleSubmit, isSubmitting, status }) => (
          <main
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem',
              background:
                dark ?
                  'radial-gradient(circle at top left, #0f172a 0, transparent 36%), linear-gradient(135deg, #1e293b 0%, #0f172a 52%, #0f172a 100%)'
                  :
                  'radial-gradient(circle at top left, #dbeafe 0, transparent 36%), linear-gradient(135deg, #eff6ff 0%, #f8fafc 52%, #eef2ff 100%)',
              fontFamily: 'Arial, Helvetica, sans-serif',
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                borderRadius: '24px',
                backgroundColor: dark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                boxShadow: dark ? 'none' : '0 24px 70px rgba(30, 64, 175, 0.16)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  color: '#ffffff',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  boxShadow: '0 12px 24px rgba(37, 99, 235, 0.28)',
                }}
                aria-hidden="true"
              >
                ↑
              </div>
              <h1
                style={{
                  margin: 0,
                  color: dark ? '#f1f5f9' : '#0f172a',
                  fontSize: 'clamp(1.6rem, 5vw, 2rem)',
                  textAlign: 'center',
                  letterSpacing: '-0.03em',
                }}
              >
                Subir archivos
              </h1>
              <p
                style={{
                  margin: '0 0 1rem',
                  color: dark ? '#94a3b8' : '#64748b',
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}
              >
                Seleccioná tus archivos y protegé el ZIP con una contraseña.
              </p>
              <label
                htmlFor="files"
                style={{
                  color: dark ? '#f1f5f9' : '#334155',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                Archivos
                <input
                  id="files"
                  name="files"
                  type="file"
                  multiple
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFieldValue('files', e.target.files)
                  }
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: '0.55rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    boxSizing: 'border-box',
                    backgroundColor: dark ? '#1e293b' : '#ffffff',
                    color: dark ? '#f1f5f9' : '#475569',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                />
              </label>
              <label
                htmlFor="password"
                style={{
                  color: dark ? '#f1f5f9' : '#334155',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                Contraseña
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Ingresá una contraseña"
                  autoComplete="new-password"
                  style={{
                    width: '100%',
                    display: 'block',
                    marginTop: '0.55rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    boxSizing: 'border-box',
                    backgroundColor: dark ? '#1e293b' : '#ffffff',
                    color: dark ? '#f1f5f9' :  '#0f172a',
                    fontSize: '1rem',
                  }}
                />
              </label>
              <ErrorMessage
                name="files"
                render={(message) => (
                  <div
                    style={{
                      color: '#dc2626',
                      fontSize: '0.85rem',
                      marginTop: '-0.5rem',
                    }}
                  >
                    {message}
                  </div>
                )}
              />
              <ErrorMessage
                name="password"
                render={(message) => (
                  <div
                    style={{
                      color: '#dc2626',
                      fontSize: '0.85rem',
                      marginTop: '-0.5rem',
                    }}
                  >
                    {message}
                  </div>
                )}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  padding: '0.9rem 1rem',
                  border: 'none',
                  borderRadius: '10px',
                  background: isSubmitting
                    ? '#93c5fd'
                    : 'linear-gradient(135deg, #2563eb, #4f46e5)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  boxShadow: isSubmitting
                    ? 'none'
                    : '0 10px 20px rgba(37, 99, 235, 0.22)',
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
              {status && (
                <div
                  role="status"
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: status.includes('correctamente')
                      ? '#ecfdf5'
                      : '#fef2f2',
                    color: status.includes('correctamente')
                      ? '#047857'
                      : '#b91c1c',
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                  }}
                >
                  {status}
                </div>
              )}
            </form>

            {downloadLink && (
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="download-link-title"
                style={{
                  position: 'fixed',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.45)',
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '520px',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 24px 70px rgba(15, 23, 42, 0.25)',
                    fontFamily: 'Arial, sans-serif',
                    color: '#0f172a',
                  }}
                >
                  <h2
                    id="download-link-title"
                    style={{ margin: '0 0 0.75rem', letterSpacing: '-0.02em' }}
                  >
                    Archivos guardados
                  </h2>
                  <p style={{ color: '#64748b', lineHeight: 1.5 }}>
                    Copiá este enlace para descargar el archivo ZIP:
                  </p>
                  <input
                    readOnly
                    value={downloadLink}
                    onFocus={(event) => event.currentTarget.select()}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '10px',
                      boxSizing: 'border-box',
                      backgroundColor: '#f8fafc',
                      color: '#334155',
                      fontSize: '0.9rem',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.75rem',
                      marginTop: '1rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setDownloadLink(null)}
                      style={{
                        padding: '0.7rem 1rem',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(downloadLink);
                        setCopied(true);
                      }}
                      style={{
                        padding: '0.7rem 1rem',
                        border: 'none',
                        borderRadius: '10px',
                        backgroundColor: copied ? '#10b981' : '#2563eb',
                        color: '#ffffff',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? 'Copiado' : 'Copiar link'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <style>{`
              input:focus {
                border-color: #2563eb !important;
                outline: none;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
              }
              button:not(:disabled):hover {
                filter: brightness(1.08);
                transform: translateY(-1px);
              }
              button {
                transition: filter 150ms ease, transform 150ms ease;
              }
            `}</style>
          </main>
        )}
        </Formik>
    </>
  );
}
