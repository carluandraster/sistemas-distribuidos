import { useState } from "react";
import { mkdir, readFile, writeFile } from "fs/promises";

export function useUpdate<T>(url: string) {
  const [response, setResponse] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const STORAGE_DIR = url.split("/").slice(0, -1).join("/");
  async function update(
    url: string,
    condition: (tuple: T) => boolean,
    setTo: (tuple: T) => void,
  ) {
    setLoading(true);
    await mkdir(STORAGE_DIR, { recursive: true });
    const existingData = await readFile(url, "utf8")
      .then((data) => JSON.parse(data))
      .catch(() => []);
    existingData.array.forEach((t) => {
      if (condition(t)) {
        setTo(t);
      }
    });
  }
}
