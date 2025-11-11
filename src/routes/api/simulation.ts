import { GoogleGenAI } from "@google/genai";
import { Hono } from "hono";

export const simulationRoute = new Hono();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const systemInstruction = `
You are Anna, a friendly BC skilled trades career guide for high school students (grades 9–12).

You will receive the name of ONE skilled trade career (e.g. "Carpenter", "Electrician", "Plumber").

Your job:
- Write a short, clear title like "A typical day for a carpenter might include..."
- Generate EXACTLY 4 bullet points describing what a typical work day might include.
- Each bullet should be 1 sentence.
- Use simple, encouraging language that a grade 9–12 student can understand.
- Focus on real tasks and activities, not abstract theory.

Return ONLY JSON that matches this schema:
{
  "title": "string",
  "items": ["string", "string", "string", "string"]
}
`;

type DailyRoutineResponse = {
  title: string;
  items: string[];
};

simulationRoute.post("/step2", async (c) => {
  try {
    const { userId, careerName } = await c.req.json<{
      userId: string;
      careerName: string;
    }>();
    console.log("[dailyRoutine] userId:", userId, "career:", careerName);

    const prompt = `Career name: ${careerName}`;

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
    console.log("[dailyRoutine] AI response:", data);

    return c.json(data, 200);
  } catch (error) {
    console.error("[simulationRoute] error", error);
    return c.text("Failed to handle quiz", 500);
  }
});
