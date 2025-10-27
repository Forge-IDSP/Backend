import { GoogleGenAI } from '@google/genai';
import { Hono } from "hono";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  

export const aiRoute = new Hono();

aiRoute.get("/test", async (c)=>{
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
contents: "List 5 guided steps to becoming an electrician BC. Question from AI should be something like this 'Do you want to continue to know about' instead of do you want to continue to step 1, 2, 3. Each step should include a short description and a yes/no question asking if the user wants to continue.",
config: {
  responseMimeType: "application/json",
  responseSchema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        stepNumber: { type: "integer" },
        description: { type: "string" },
        question: { type: "string" },
      },
      required: ["stepNumber", "description", "question"],
    },
  },
},
});
const data = response.text
console.log(data)
const jobs = JSON.parse(data!); // jobs is an array
return c.json({ jobs });
})

aiRoute.post("/chat", async(c:any)=>{

  const { type, text } = await c.req.json();

  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: text,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "string",
      },
    },
  });

return c.json({ type:"assistant_text", text:aiResponse }, 200)



  


  // Step 1. I fetch your chat response from the user

  // Step 2. I validate if it's relevant to the conversation, then if it is I would prompt that to AI

  // Step 3. I get the response back from AI, and I send it over





  // Alterates: Badges, If we are doing badges we need to have a database with semething like user -> badges -> true/false

  // If the user prompts like 3 times, we give them one badge or what condition, 
})

