import { useEffect, useState } from "react";

/**
 * Hook para realizar fetch a una URL y obtener los datos
 * @param url La URL a la que se realizará el fetch
 * @returns Un objeto con los datos, el estado de carga y el error
 */
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    setCargando(true);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("fetch falló");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [url]);
  return { data, cargando, error };
}
