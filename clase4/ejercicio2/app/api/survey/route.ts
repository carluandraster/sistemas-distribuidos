import { mkdir, readFile } from "fs/promises";
import { Question } from "@/lib/Question";
import { useInsert } from "@/hooks/persistence/useInsert";
import { prisma } from "@/lib/prisma";

// Lee y filtra los cuestionarios según cuenta o id
async function GET(req: Request): Promise<Response> {
  const account = req.headers.get("account");
  const id = req.headers.get("id");
  if (account) {
    return await prisma.survey
      .findMany({ where: { account } })
      .then((surveys: any) => {
        return new Response(JSON.stringify(surveys), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      });
  } else if (id) {
    return await prisma.survey
      .findUnique({ where: { id } })
      .then((survey: any) => {
        if (survey) {
          return new Response(JSON.stringify(survey), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          return new Response(
            JSON.stringify({ error: "Cuestionario no encontrado" }),
            { status: 404 },
          );
        }
      });
  }
  return new Response(JSON.stringify({ error: "Parámetros inválidos" }), {
    status: 400,
  });
}

// Manda un cuestionario a la cuenta correspondiente
async function POST(req: Request): Promise<Response> {
  return await prisma.survey
    .create({
      data: {
        author: req.headers.get("account") || "",
        title: req.headers.get("title") || "",
      },
    })
    .then((survey: any) => {
      return new Response(JSON.stringify(survey), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
    .catch((error: any) => {
      return new Response(
        JSON.stringify({ error: "Error al crear el cuestionario" }),
        { status: 500 },
      );
    });
}

async function DELETE(req: Request): Promise<Response> {
  const id = req.headers.get("id");
  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID de cuestionario no proporcionado" }),
      {
        status: 400,
      },
    );
  } else {
    return await prisma.survey
      .delete({ where: { id: parseInt(id) } })
      .then((survey: any) => {
        return new Response(JSON.stringify(survey), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error: any) => {
        return new Response(JSON.stringify({ error: error.meta.cause }), {
          status: 500,
        });
      });
  }
}

async function PUT(req: Request): Promise<Response> {
  const id = req.headers.get("id");
  const title = req.headers.get("title");
  if (!id || !title) {
    return new Response(
      JSON.stringify({ error: "ID de cuestionario o título no proporcionado" }),
      {
        status: 400,
      },
    );
  } else {
    return await prisma.survey
      .update({
        where: { id: parseInt(id) },
        data: { title },
      })
      .then((survey: any) => {
        return new Response(JSON.stringify(survey), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error: any) => {
        return new Response(JSON.stringify({ error: error.meta.cause }), {
          status: 500,
        });
      });
  }
}
