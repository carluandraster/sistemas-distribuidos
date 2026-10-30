import { useState } from "react";
import { mkdir, readFile, writeFile } from "fs/promises";

export function useInsert<T>(url: string, data: T) {
  const [response, setResponse] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
}
