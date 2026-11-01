import { prisma } from "@/lib/prisma";

/**
 * Agrega una nueva opción a una pregunta existente
 * @param req - Request con los headers idQuestion, idOption y text
 * @returns - Petición con el status de la operación y el objeto de la opción creada
 */
export async function POST(req: Request): Promise<Response> {
  const idQuestion = req.headers.get("idQuestion");
  const idOption = req.headers.get("idOption");
  const text = req.headers.get("text");
  if (!idQuestion || !text || !idOption) {
    return new Response(
      JSON.stringify({
        error: "ID de pregunta, ID de opción o texto no proporcionado",
      }),
      {
        status: 400,
      },
    );
  } else {
    return await prisma.option
      .create({
        data: {
          idOption: parseInt(idOption),
          idQuestion: parseInt(idQuestion),
          label: text,
        },
      })
      .then((option: any) => {
        return new Response(JSON.stringify(option), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error: any) => {
        return new Response(
          JSON.stringify({ error: "Error al crear la opción" }),
          { status: 500 },
        );
      });
  }
}

/**
 * Actualiza el texto de una opción existente
 * @param req - Request con los headers idQuestion, idOption y text
 * @returns - Petición con el status de la operación y el objeto de la opción actualizada
 */
export async function PUT(req: Request): Promise<Response> {
  const idQuestion = req.headers.get("idQuestion");
  const idOption = req.headers.get("idOption");
  const text = req.headers.get("text");
  if (!idQuestion || !text || !idOption) {
    return new Response(
      JSON.stringify({
        error: "ID de pregunta, ID de opción o texto no proporcionado",
      }),
      {
        status: 400,
      },
    );
  } else {
    return await prisma.option
      .update({
        where: {
          idQuestion_idOption: {
            idOption: parseInt(idOption),
            idQuestion: parseInt(idQuestion),
          },
        },
        data: { label: text },
      })
      .then((option: any) => {
        return new Response(JSON.stringify(option), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error: any) => {
        return new Response(
          JSON.stringify({ error: "Error al actualizar la opción" }),
          { status: 500 },
        );
      });
  }
}

/**
 * Elimina una opción existente de una pregunta
 * @param req - Request con los headers idQuestion y idOption
 * @returns - Petición con el status de la operación y el objeto de la opción eliminada
 */
export async function DELETE(req: Request): Promise<Response> {
  const idQuestion = req.headers.get("idQuestion");
  const idOption = req.headers.get("idOption");
  if (!idQuestion || !idOption) {
    return new Response(
      JSON.stringify({
        error: "ID de pregunta o ID de opción no proporcionado",
      }),
      {
        status: 400,
      },
    );
  } else {
    return await prisma.option
      .delete({
        where: {
          idQuestion_idOption: {
            idOption: parseInt(idOption),
            idQuestion: parseInt(idQuestion),
          },
        },
      })
      .then((option: any) => {
        return new Response(JSON.stringify(option), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
      .catch((error: any) => {
        return new Response(
          JSON.stringify({ error: "Error al eliminar la opción" }),
          { status: 500 },
        );
      });
  }
}
