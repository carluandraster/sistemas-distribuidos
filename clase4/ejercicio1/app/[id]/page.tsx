"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Formik, Field, ErrorMessage } from 'formik';
import { ThemeProvider, useTheme, Theme } from "@/contexts/ThemeContext";
import BtnTheme from "@/components/btnTheme";

export default function DownloadPage() {
  return (
    <ThemeProvider>
      <DownloadContext />
    </ThemeProvider>
  );
}


function DownloadContext() {
  const { id } = useParams<{ id: string }>();
  const downloadedId = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!id || downloadedId.current === id || formData === null) {
      return;
    }

    const controller = new AbortController();

    async function downloadFile() {
      try {
        const response = await fetch(
          `/api/files?id=${encodeURIComponent(id)}&download=true`,
          {
            signal: controller.signal,
            method: "POST",
            body: formData,
          },
        );
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? "No se pudo descargar el archivo");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = response.headers.get("Content-Disposition");
        const filename = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
        link.download = filename ? decodeURIComponent(filename) : `${id}.bin`;
        link.click();
        URL.revokeObjectURL(url);
        downloadedId.current = id;
      } catch (downloadError) {
        if (downloadError instanceof DOMException && downloadError.name === "AbortError") {
          return;
        }

        setError(
          downloadError instanceof Error
            ? downloadError.message
            : "No se pudo descargar el archivo",
        );
      }
    }

    void downloadFile();

    return () => controller.abort();
  }, [id, formData]);

  const isPreparing = formData !== null && !error;
  const dark = theme === Theme.DARK;
  return (
    <>
      <BtnTheme dark={dark} toggleTheme={toggleTheme} />
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        background:
          dark
            ? "radial-gradient(circle at top left, #0f172a 0, transparent 36%), linear-gradient(135deg, #1e293b 0%, #111827 52%, #1e293b 100%)"
            : "radial-gradient(circle at top left, #dbeafe 0, transparent 36%), linear-gradient(135deg, #eff6ff 0%, #f8fafc 52%, #eef2ff 100%)",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2.5rem",
          border: "1px solid rgba(148, 163, 184, 0.25)",
          borderRadius: "24px",
          backgroundColor: dark ? "rgba(15, 23, 42, 0.92)" : "rgba(255, 255, 255, 0.92)",
          boxShadow: "0 24px 70px rgba(30, 64, 175, 0.16)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #2563eb, #4f46e5)",
            color: "#ffffff",
            fontSize: "1.75rem",
            fontWeight: 700,
            boxShadow: "0 12px 24px rgba(37, 99, 235, 0.28)",
          }}
          aria-hidden="true"
        >
          ↓
        </div>
        <h1
          style={{
            margin: 0,
            color: dark ? "#f1f5f9" : "#0f172a",
            fontSize: "clamp(1.6rem, 5vw, 2rem)",
            textAlign: "center",
            letterSpacing: "-0.03em",
          }}
        >
          Descargar archivos
        </h1>
        <p
          style={{
            margin: "0.75rem 0 2rem",
            color: dark ? "#94a3b8" : "#64748b",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Ingresá la contraseña para desbloquear y descargar el archivo ZIP.
        </p>
        {isPreparing ? (
          <div
            role="status"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "12px",
              backgroundColor: dark ? "#1e293b" : "#eff6ff",
              color: dark ? "#bfdbfe" : "#1d4ed8",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "18px",
                height: "18px",
                border: "3px solid #bfdbfe",
                borderTopColor: "#2563eb",
                borderRadius: "50%",
                animation: "download-spin 0.8s linear infinite",
              }}
              aria-hidden="true"
            />
            Preparando la descarga...
          </div>
        ) : (
          <>
            {error && (
              <div
                role="alert"
                style={{
                  marginBottom: "1.25rem",
                  padding: "0.9rem 1rem",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  backgroundColor: dark ? "#1e293b" : "#fef2f2",
                  color: dark ? "#f87171" : "#b91c1c",
                  fontSize: "0.9rem",
                  lineHeight: 1.45,
                }}
              >
                {error}
              </div>
            )}
            <Formik
      initialValues={{ password: '' }}
      onSubmit={async (values) => {
        try {
          const formData = new FormData();
          formData.append('password', values.password);
          setFormData(formData);
          setError(null);
        } catch (error) {
          console.error('Error al enviar el formulario:', error);
        }
        values.password = '';
      }}
    >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      marginBottom: "0.55rem",
                      color: dark ? "#f1f5f9" : "#334155",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                    }}
                  >
                    Contraseña
                  </label>
                  <Field
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Ingresá tu contraseña"
                    autoComplete="current-password"
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      outline: "none",
                      backgroundColor: dark ? "#1e293b" : "#ffffff",
                      color: dark ? "#f1f5f9" : "#0f172a",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                    }}
                  />
                  <ErrorMessage
                    name="password"
                    render={(message) => (
                      <p
                        style={{
                          margin: "0.5rem 0 0",
                          color: dark ? "#f87171" : "#dc2626",
                          fontSize: "0.85rem",
                        }}
                      >
                        {message}
                      </p>
                    )}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: "100%",
                      marginTop: "1.5rem",
                      padding: "0.9rem 1rem",
                      border: "none",
                      borderRadius: "10px",
                      background: isSubmitting
                        ? "#93c5fd"
                        : "linear-gradient(135deg, #2563eb, #4f46e5)",
                      color: "#ffffff",
                      fontSize: "1rem",
                      fontWeight: 700,
                      cursor: isSubmitting ? "wait" : "pointer",
                      boxShadow: isSubmitting
                        ? "none"
                        : "0 10px 20px rgba(37, 99, 235, 0.22)",
                    }}
                  >
                    {isSubmitting ? "Procesando..." : "Descargar ZIP"}
                  </button>
                </form>
              )}
            </Formik>
          </>
        )}
        <p
          style={{
            margin: "1.75rem 0 0",
            color: dark ? "#94a3b8" : "#94a3b8",
            fontSize: "0.78rem",
            textAlign: "center",
          }}
        >
          La descarga comienza automáticamente después de validar la contraseña.
        </p>
      </section>
      <style>{`
        @keyframes download-spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #2563eb !important;
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
       </>
  );
}