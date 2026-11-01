import { prisma } from "@/lib/prisma";

// Lee y filtra los cuestionarios según cuenta o id
async function GET(req: Request): Promise<Response> {
  const account = req.headers.get("account");
  const id = req.headers.get("id");
  if (account) {
    return await prisma.survey
      .findMany({ where: { author: account } })
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
      .findUnique({
        where: { idSurvey: parseInt(id) },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      })
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
        title: req.headers.get("title") || "",
        author: req.headers.get("account") || "",
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
      .delete({ where: { idSurvey: parseInt(id) } })
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
        where: { idSurvey: parseInt(id) },
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
