import crypto from "crypto";
import path from "path";
import { prisma } from "@/lib/prisma";

/**
 * Tipo cuenta de usuario que contiene el nombre de usuario y la contraseña encriptada.
 */
export type Account = {
  username: string;
  password: string; // Almacena la contraseña encriptada
};

export async function POST(req: Request) {
  try {
    const formData = req.headers;
    const username = formData.get("name");
    const password = formData.get("password");
    if (typeof username !== "string" || typeof password !== "string") {
      return new Response(
        JSON.stringify({ error: "Datos de acceso inválidos" }),
        { status: 400 },
      );
    }
    const passwordCrypted = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    const account = await prisma.account.findUnique({ where: { username } });
    if (account && account.password === passwordCrypted) {
      return new Response(
        JSON.stringify({ message: "Login exitoso", username }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `session=${encodeURIComponent(username)}; Path=/; HttpOnly; SameSite=Lax`,
          },
        },
      );
    } else {
      return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
        status: 401,
      });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error al procesar la solicitud" }),
      { status: 500 },
    );
  }
}
