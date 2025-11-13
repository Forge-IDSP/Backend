import { GoogleGenAI } from "@google/genai";
import { Hono } from "hono";
import { dbController } from "../../controllers/dbController";

export const simulationRoute = new Hono();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are Anna, a friendly and encouraging BC skilled trades career guide for high school students (grades 9–12).

You will receive the name of ONE skilled trade career (e.g., "Carpenter", "Electrician", "Plumber").

Your job:
- Explain why starting with a trades "Foundation" program (a hands-on pre-apprenticeship program) is a smart first step for a high school student in British Columbia.
- Focus on: (1) what the Foundation program is, (2) how long it usually takes, (3) what students learn and practice, and (4) how it helps them move into an apprenticeship.

Write a short and clear title like:  
"Start with the Electrical Foundation Program" or  
"Your First Step: Plumbing Foundation."

Then generate EXACTLY 4 bullet points that:
  - Use simple, friendly, and motivating language that grade 9–12 students can easily understand.
  - Each bullet should be **one short sentence** (or two very short sentences).
  - Include practical info: program length, hands-on skills, tools they’ll use, and how Foundation prepares them for apprenticeship training.
  - Keep the tone supportive, upbeat, and easy to read.
  - Do NOT include wages, guarantees, or anything unrelated to training.

Return ONLY this JSON:
{
  "title": "string",
  "items": ["string", "string", "string", "string"]
}
`;

const levelSystemInstruction = `
You are Anna, a friendly BC skilled trades career guide for high school students.

Your task is to explain the apprenticeship pathway for ONE skilled trade career in British Columbia (e.g., Electrician, Plumber, Welder, Carpenter).

For the given career, generate Level 1–4 apprentice descriptions that ALWAYS cover these three points:
1. About how many on-the-job work hours each level typically requires (e.g., “completes around 1,300–1,500 hours of real job experience”).
2. About how many weeks of technical training are involved for that level (e.g., “usually takes 6–10 weeks of in-school learning”).
3. What apprentices usually do and learn at that stage — written simply, clearly, and in a way grades 9–12 can easily understand.

Use clear, encouraging, student-friendly language. Keep it lively and easy to read.

Return ONLY this JSON:

{
  "levels": [
    { "title": "Level 1 Apprentice", "items": ["string", "string", "string"] },
    { "title": "Level 2 Apprentice", "items": ["string", "string", "string"] },
    { "title": "Level 3 Apprentice", "items": ["string", "string", "string"] },
    { "title": "Level 4 Apprentice", "items": ["string", "string", "string"] }
  ]
}

Rules:
- 4 levels total.
- Each level must have EXACTLY 3 bullet points.
- Each bullet is 1–2 medium-length sentences.
- Use realistic BC-based estimates for work hours (around 1,260–1,500+ hours per level) and school weeks (typically 6–10 weeks).
- Describe the work and learning in a simple, positive, and engaging tone suitable for high school students.
- Do NOT mention wages, guarantees, promotions, or anything unrelated to apprenticeship training.
- Keep everything friendly, clear, and easy to follow.
`;

type DailyRoutineResponse = {
  title: string;
  items: string[];
};

simulationRoute.get("/employers/:careerName", (c) =>
  dbController.getAllEmployersByCareerName(c)
);

simulationRoute.post("/step2", async (c) => {
  try {
    const { userId, careerName } = await c.req.json<{
      userId: string;
      careerName: string;
    }>();
    console.log("[foundationInfo] userId:", userId, "career:", careerName);

    const prompt = `Career name: ${careerName}
The student is a high school student in British Columbia who is curious about this trade and wants to know why doing a Foundation (pre-apprenticeship) program first could help them.`;

    const aiRaw = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            items: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["title", "items"],
        },
      },
    });

    const data = JSON.parse(aiRaw.text!) as DailyRoutineResponse;
    console.log("[foundationInfo] AI response:", data);

    return c.json(data, 200);
  } catch (error) {
    console.error("[simulationRoute] error", error);
    return c.text("Failed to handle foundation info", 500);
  }
});

simulationRoute.post("/step3", async (c) => {
  try {
    const { careerName } = await c.req.json<{ careerName: string }>();
    console.log("backend step3 ====");
    console.log("[step3] generating levels for:", careerName);

    const prompt = `Career: ${careerName}`;

    const aiRaw = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: levelSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            levels: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  items: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["title", "items"],
              },
            },
          },
          required: ["levels"],
        },
      },
    });

    const data = JSON.parse(aiRaw.text!);
    console.log("[step3] AI response:", data);

    return c.json(data, 200);
  } catch (err) {
    console.error("[step3 error]", err);
    return c.text("Failed to generate apprentice levels", 500);
  }
});
