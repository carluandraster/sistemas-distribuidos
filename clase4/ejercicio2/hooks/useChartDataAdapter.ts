import { useMemo } from "react";
import { Vote, sumatory } from "@/lib/Vote";

export function useChartDataAdapter(rawSurveyData: Vote[]) {
  return useMemo(() => {
    const finalVote = sumatory(rawSurveyData);
    return finalVote.questions.map((question) => ({
      question: question.question,
      chartPayload: {
        labels: question.options, // ["Node.js", "Python", "Go"]
        datasets: [
          {
            label: "Votos",
            data: finalVote.answers[question.question], // [15, 8, 4]
          },
        ],
      },
    }));
  }, [rawSurveyData]);
}