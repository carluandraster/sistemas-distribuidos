"use client";

import { useState, useEffect } from "react";

/**
 * Hook para obtener resultados en vivo de una encuesta.
 * @param surveyId ID de la encuesta
 * @param intervalMs Intervalo de tiempo en milisegundos para el polling
 * @returns Objeto con los resultados, el estado de carga y posibles errores
 */
export function useLiveResults<T>(surveyId: string, intervalMs: number = 3000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchResults() {
      try {
        const response = await fetch(`/api/surveys/${surveyId}/results`, {
          signal: controller.signal,
          cache: "no-store", // Evita que el navegador devuelva datos viejos en caché
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const json: T = await response.json();
        if (isMounted) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError" && isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    // 1. Primera carga inmediata al montar
    fetchResults();

    // 2. Polling periódico (enfoque Pull)
    const timerId = setInterval(fetchResults, intervalMs);

    // 3. Cleanup: se ejecuta cuando el usuario cierra o cambia de pantalla
    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(timerId);
    };
  }, [surveyId, intervalMs]);

  return { data, loading, error };
}