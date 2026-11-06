const backendUrl = process.env.BACKEND_URL;

type UserCredentials = {
  username: string;
  password: string;
};

/**
 * Obtiene la URL del backend de usuarios a partir de la variable de entorno BACKEND_URL.
 * @throws {Error} Si la variable de entorno BACKEND_URL no está configurada.
 * @returns Dirección del backend de usuarios, asegurando que no termine con una barra y agregando "/user" al final.
 */
export function getBackendUrl() {
  if (!backendUrl) {
    throw new Error("BACKEND_URL no está configurada");
  }

  return `${backendUrl.replace(/\/$/, "")}/user`;
}

/**
 * Crea una respuesta JSON.
 * @param body - El cuerpo de la respuesta.
 * @param status - El código de estado de la respuesta.
 * @param headers - Los encabezados de la respuesta.
 * @returns Una nueva respuesta JSON.
 */
export function jsonResponse(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers,
  });
}

/**
 * Reenvía una respuesta del backend al cliente.
 * @param response - La respuesta del backend.
 * @returns Una nueva respuesta para el cliente.
 */
export async function forwardResponse(response: Response) {
  const body = await response.text();
  const contentType = response.headers.get("content-type");

  return new Response(body, {
    status: response.status,
    headers: contentType ? { "Content-Type": contentType } : undefined,
  });
}

/**
 * Valida las credenciales de un usuario.
 * @param credentials - Las credenciales a validar.
 * @returns true si las credenciales son válidas, false en caso contrario.
 */
function validateCredentials(credentials: unknown): credentials is UserCredentials {
  if (!credentials || typeof credentials !== "object") {
    return false;
  }

  const { username, password } = credentials as Record<string, unknown>;

  return (
    typeof username === "string" &&
    username.trim().length > 0 &&
    typeof password === "string" &&
    password.length > 0
  );
}

// Endpoints de la API para manejar solicitudes GET y POST relacionadas con usuarios. Se validan las credenciales y se reenvían las respuestas del backend al cliente.

export async function GET(request: Request) {
  const credentials = {
    username: request.headers.get("username") ?? "",
    password: request.headers.get("password") ?? "",
  };

  if (!validateCredentials(credentials)) {
    return jsonResponse({ error: "Datos de acceso inválidos" }, 400);
  }

  try {
    const response = await fetch(getBackendUrl(), {
      method: "GET",
      headers: {
        ...credentials,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    return forwardResponse(response);
  } catch (error) {
    console.error("No se pudo contactar al backend de usuarios", error);
    return jsonResponse({ error: "El backend no está disponible" }, 502);
  }
}

export async function POST(request: Request) {
  let credentials: unknown;

  try {
    credentials = await request.json();
  } catch {
    return jsonResponse({ error: "El cuerpo debe ser JSON válido" }, 400);
  }

  if (!validateCredentials(credentials)) {
    return jsonResponse({ error: "Datos de cuenta inválidos" }, 400);
  }

  try {
    const response = await fetch(getBackendUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    return forwardResponse(response);
  } catch (error) {
    console.error("No se pudo contactar al backend de usuarios", error);
    return jsonResponse({ error: "El backend no está disponible" }, 502);
  }
}