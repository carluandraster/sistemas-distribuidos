import { prisma } from "@/lib/prisma";

/**
 * Crear nueva pregunta para un cuestionario
 * @param req - Request con los headers idSurvey y text
 * @returns - Petición con el status de la operación y el objeto de la pregunta creada
 */
export async function POST(req: Request): Promise<Response> {
  const idSurvey = req.headers.get("idSurvey");
  const text = req.headers.get("text");

  if (!idSurvey || !text) {
    return new Response(
      JSON.stringify({
        error: "ID de cuestionario o texto de la pregunta no proporcionado",
      }),
      {
        status: 400,
      },
    );
  }

  return await prisma.question
    .create({
      data: {
        idSurvey: parseInt(idSurvey),
        label: text,
      },
    })
    .then((question: any) => {
      return new Response(JSON.stringify(question), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
    .catch((error: any) => {
      return new Response(
        JSON.stringify({ error: "Error al crear la pregunta" }),
        { status: 500 },
      );
    });
}

/**
 * Actualizar el texto de una pregunta existente
 * @param req - Request con los headers idQuestion y text
 * @returns - Petición con el status de la operación y el objeto de la pregunta actualizada
 */
export async function PUT(req: Request): Promise<Response> {
  const idQuestion = req.headers.get("idQuestion");
  const text = req.headers.get("text");
  if (!idQuestion || !text) {
    return new Response(
      JSON.stringify({ error: "ID de pregunta o texto no proporcionado" }),
      {
        status: 400,
      },
    );
  } else {
    return await prisma.question
      .update({
        where: { idQuestion: parseInt(idQuestion) },
        data: { label: text },
      })
      .then((question: any) => {
        return new Response(JSON.stringify(question), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error: any) => {
        return new Response(
          JSON.stringify({ error: "Error al actualizar la pregunta" }),
          { status: 500 },
        );
      });
  }
}

/**
 * Eliminar una pregunta existente
 * @param req - Request con el header idQuestion
 * @returns - Petición con el status de la operación y el objeto de la pregunta eliminada
 */
export async function DELETE(req: Request): Promise<Response> {
  const idQuestion = req.headers.get("idQuestion");
  if (!idQuestion) {
    return new Response(
      JSON.stringify({ error: "ID de pregunta no proporcionado" }),
      {
        status: 400,
      },
    );
  } else {
    return await prisma.question
      .delete({ where: { idQuestion: parseInt(idQuestion) } })
      .then((question: any) => {
        return new Response(JSON.stringify(question), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error: any) => {
        return new Response(
          JSON.stringify({ error: "Error al eliminar la pregunta" }),
          { status: 500 },
        );
      });
  }
}
