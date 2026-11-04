const backendUrl = process.env.BACKEND_URL;

type UserCredentials = {
  username: string;
  password: string;
};

function getBackendUrl() {
  if (!backendUrl) {
    throw new Error("BACKEND_URL no está configurada");
  }

  return `${backendUrl.replace(/\/$/, "")}/user`;
}

function jsonResponse(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers,
  });
}

async function forwardResponse(response: Response) {
  const body = await response.text();
  const contentType = response.headers.get("content-type");

  return new Response(body, {
    status: response.status,
    headers: contentType ? { "Content-Type": contentType } : undefined,
  });
}

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