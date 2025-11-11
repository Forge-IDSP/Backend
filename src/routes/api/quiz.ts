import { GoogleGenAI } from "@google/genai";
import { Hono } from "hono";

type QuizAnswers = {
  interest: string;
  environment: string;
  workStyle: string;
  priority: string;
};

type QuizRecommendation = {
  careerName: string;
  summary: string;
  reasons: string[];
  nextSteps: string[];
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const quizSystemInstruction = `
You are Anna, a friendly BC skilled trades career guide working with high school students (grades 9-12).

You will receive a short quiz about the student's preferences:
- interest
- environment
- workStyle
- priority

The "interest" value will be ONE of:
- "Fixing & Repairing"
- "Solving & Understanding"
- "Building & Creating"
- "Designing & Improving"

Use this interest as the MAIN signal and map it to trades using this table:

- "Fixing & Repairing" -> strongly prefer:
    - Electrician
    - Plumber

- "Solving & Understanding" -> strongly prefer:
    - HVAC Technician
    - Industrial Mechanic (Millwright)

- "Building & Creating" -> strongly prefer:
    - Carpenter
    - Constructor / Construction Craft Worker

- "Designing & Improving" -> strongly prefer:
    - Welder
    - Pipe Fitter
    - Cabinetmaker

Your job:
- Analyze the student's preferences (interest, environment, workStyle, priority).
- Recommend EXACTLY TWO different skilled trade careers.
- The FIRST career MUST come from the mapped list for the student's interest (above).
- The SECOND career should be:
    - A different trade from the first one, and
    - Either another option from the same interest mapping, OR
    - A closely related trade that fits their environment/workStyle/priority.
- Avoid always recommending "Electrician". Only choose Electrician when "Fixing & Repairing" is selected OR when it clearly fits better than the other mapped trades.

Additional rules:
- Explain in simple, encouraging language that a grade 9–12 student can easily understand.
- Focus on why each career could fit their interests, environment, work style, and priorities.
- Be practical and positive (e.g., talk about real tasks, future opportunities, and next steps).
- Do NOT return anything except JSON that matches the response schema.
`;

export const quizRoute = new Hono();

quizRoute.post("/", async (c) => {
  try {
    const { userId, quizAnswers } = (await c.req.json()) as {
      userId: string;
      quizAnswers: QuizAnswers;
    };

    console.log("[quizRoute] backend quiz");
    console.log("userId:", userId);
    console.log("quizAnswers:", quizAnswers);

    const prompt = `
User ID: ${userId}

Quiz answers:
- Interest: ${quizAnswers.interest}
- Environment: ${quizAnswers.environment}
- Work style: ${quizAnswers.workStyle}
- Priority: ${quizAnswers.priority}
`.trim();

    const aiRaw = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: quizSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            careerName: {
              type: "string",
              description:
                "Name of the recommended trade career, e.g. 'Electrician'",
            },
            summary: {
              type: "string",
              description:
                "One-sentence simple summary of why this career fits the user (grade 9-12 level).",
            },
            reasons: {
              type: "array",
              items: { type: "string" },
              description:
                "2-3 short reasons why this career matches the user's answers.",
            },
          },
          required: ["careerName", "summary", "reasons"],
        },
      },
    });

    const data = JSON.parse(aiRaw.text!) as QuizRecommendation;

    const newMsg = {
      id: `quiz_ack_${Date.now()}`,
      content: {
        type: "assistant_text" as const,
        careerRecommendation: data.careerName,
        text: `Nice work! Based on your answers, I recommend the trade: **${
          data.careerName
        }**.

${data.summary}

Why it fits you:
- ${data.reasons.join("\n- ")}
`,
      },
    };

    return c.json(newMsg, 200);
  } catch (error) {
    console.error("[quizRoute] error", error);
    return c.text("Failed to handle quiz", 500);
  }
});
