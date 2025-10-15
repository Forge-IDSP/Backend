import { GoogleGenAI } from '@google/genai';
import { Hono } from "hono";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  

export const aiRoute = new Hono();

aiRoute.get("/test", async (c)=>{
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: "List 4 trending BC skilled trdaes job.",
  config: {
    responseMimeType: "application/json",
    responseSchema: {
       type: "array",
        items: {
         type: "object",
        properties: {
        jobTitle: { type: "string" },
        description: { type: "string" },
        },
        required: ["jobTitle", "description"],
         },
    },
  },
});
const data = response.text
console.log(data)
const jobs = JSON.parse(data!); // jobs is an array
return c.json({ jobs });
})