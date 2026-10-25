"use client";

import { useState, useEffect } from "react";

/**
 * Hook para obtener resultados en vivo de una encuesta.
 * @param surveyId ID de la encuesta
 * @param intervalMs Intervalo de tiempo en milisegundos para el polling
 * @returns Objeto con los resultados, el estado de carga y posibles errores
 */
export function useLiveResults<T>(surveyId: string, intervalMs: number = 3000) {
  // Estados para almacenar los resultados, el estado de carga y los errores
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect para manejar la lógica de polling y limpieza
  useEffect(() => {
    let isMounted = true; // Bandera para verificar si el componente sigue montado
    const controller = new AbortController(); // Controlador para abortar la solicitud fetch si el componente se desmonta

    // Función para obtener los resultados de la encuesta
    async function fetchResults() {
      try {
        const response = await fetch(`@/app/api/response`, {
          signal: controller.signal,
          cache: "no-store", // Evita que el navegador devuelva datos viejos en caché
          method: "GET",
          body: JSON.stringify({ surveyId }),
          headers: {
            "Content-Type": "application/json",
          },
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