import { prisma } from "@/lib/prisma";

/**
 * Almacena los votos de una opción de una pregunta
 * @param req - Request con los headers idQuestion, idOption y votes
 * @returns - Petición con el status de la operación y el objeto de la opción actualizada
 */
export async function PUT(req: Request): Promise<Response> {
  const idQuestion = req.headers.get("idQuestion");
  const idOption = req.headers.get("idOption");
  const vote = Number(req.headers.get("votes"));

  if (!idQuestion || !idOption || !Number.isInteger(vote) || vote <= 0) {
    return new Response(
      JSON.stringify({
        error:
          "ID de pregunta, ID de opción o una cantidad válida de votos no proporcionada",
      }),
      {
        status: 400,
      },
    );
  }

  const option = await prisma.option.update({
    where: {
      idQuestion_idOption: {
        idOption: Number(idOption),
        idQuestion: Number(idQuestion),
      },
    },
    data: {
      votes: {
        increment: vote,
      },
    },
  });

  return Response.json(option);
}
