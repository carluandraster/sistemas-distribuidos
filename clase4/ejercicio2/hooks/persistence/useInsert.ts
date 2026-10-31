import { useState } from "react";
import { mkdir, readFile, writeFile } from "fs/promises";

/**
 * Hook to insert data into a JSON file at the specified URL.
 * It manages the state of the response, error, and loading status.
 * @param url - The URL of the JSON file where data will be inserted.
 * @param data - The data to be inserted into the JSON file.
 * @returns An object containing the insertData function and the state variables.
 */
export function useInsert<T>(url: string) {
  const [response, setResponse] = useState<Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const STORAGE_DIR = url.split("/").slice(0, -1).join("/");
  async function insertData(newTuple: T): Promise<void> {
    setLoading(true);
    await mkdir(STORAGE_DIR, { recursive: true });
    const existingData = await readFile(url, "utf8")
      .then((data) => JSON.parse(data))
      .catch(() => []);
    existingData.push(newTuple);
    await writeFile(url, JSON.stringify(existingData, null, 2), "utf8")
      .then(() => {
        setResponse(
          new Response(
            JSON.stringify({ message: "Data inserted successfully" }),
            { status: 200 },
          ),
        );
      })
      .catch((err) => {
        setError(`Error inserting data: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return { insertData, response, error, loading };
}
