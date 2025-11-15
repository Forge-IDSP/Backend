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
You are Anna, a friendly BC skilled trades career guide working with high school students (grades 9–12).

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

- "Fixing & Repairing" -> start with these trades as the main candidate pool, and refine the final choice using the student's environment, workStyle, and priority:
    - Residential Electrician
    - Commercial Electrician
    - Plumber
    - Powerline Technician
    - Industrial Electrician

- "Solving & Understanding" -> start with these trades as the main candidate pool, and refine the final choice using the student's environment, workStyle, and priority:
    - HVAC Technician
    - Industrial Mechanic
    - Refrigeration Technician
    - Gasfitter
    - Power Engineer

- "Building & Creating" -> start with these trades as the main candidate pool, and refine the final choice using the student's environment, workStyle, and priority:
    - Carpenter
    - Glazier
    - Construction Craft Worker
    - Bricklayer

- "Designing & Improving" -> start with these trades as the main candidate pool, and refine the final choice using the student's environment, workStyle, and priority:
    - Welder
    - Pipe Fitter
    - Industrial Electrician
    - Cabinetmaker

Your job:
- Analyze the student's answers across ALL four categories (interest, environment, workStyle, priority).
- Recommend EXACTLY TWO different skilled trade careers.
- The FIRST career MUST come from the mapped list for the student's interest (above).
- The SECOND career MUST be:
    - A different trade from the first one, and
    - Either another option from the same interest mapping, OR
    - A closely related trade from the overall allowed list that fits their environment/workStyle/priority.

The ONLY trades you are allowed to recommend are:
- Residential Electrician
- Commercial Electrician
- Industrial Electrician
- Plumber
- Powerline Technician
- Industrial Electrician
- HVAC Technician
- Industrial Mechanic
- Refrigeration Technician
- Carpenter
- Bricklayer
- Glazier
- Construction Craft Worker
- Gasfitter
- Power Engineer
- Welder
- Pipe Fitter
- Cabinetmaker

Additional rules:
- Avoid recommending the same trade twice. The two recommended careers must be different from each other.
- Use the environment, workStyle, and priority answers to fine-tune which two trades you choose and to explain WHY they are a good match.
- Explain in simple, encouraging language that a grade 9–12 student can easily understand.
- Focus on why each career could fit their interests, environment, work style, and priorities.
- Be practical and positive (e.g., talk about real tasks, future opportunities, and next steps).
- Do NOT recommend any career that is not in the allowed list above.
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
                "Name of the recommended trade career (e.g., 'Residential Electrician').",
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
      step: 0,
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
