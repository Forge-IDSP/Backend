import { GoogleGenAI } from '@google/genai';
import { Hono } from "hono";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  

export const aiRoute = new Hono();

aiRoute.post("/chats", async(c:any)=>{

  const { content,previousMessages } = await c.req.json();
  const messagesText = previousMessages
  .map((m: any) => `${m.content.type}: ${m.content.text}`)
  .join("\n");

  const text = content.text
  console.log(messagesText)

  
  const validQuestion:boolean = await validateRelevance(text,messagesText)
  console.log(validQuestion)
  
  if(text.includes("income")){
     
  }
  if(validQuestion){
      const aiRaw = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You are an assistant specialized in skilled trades in British Columbia. If somehow the validation is bypassed, this is the source of truth.
              Answer only questions relevant to skilled trades. If a question is not relevant, respond with: "Sorry, your question doesn’t seem relevant to our topic of skilled trades."
              Previous conversation:${messagesText}
        You are a helpful assistant. Respond to the user input below as natural text. 
        Do not say 'string' or 'true' or 'false'.
        User: "${text}"
        Assistant:`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "string",
      },
    },
  });
  const aiResponse = JSON.parse(aiRaw.text!);

return c.json({ content:{type:"assistant_text", text:aiResponse }}, 200)
  }

  return c.json({ content:{type:"assistant_text", text:"Sorry, your question doesn’t seem relevant to our topic of skilled trades." }}, 200)

})



const validateRelevance = async (text:string,previousMsg:any)=>{
  const aiRaw = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `This is the chat so far ${previousMsg}, 
    Is this userinput relevant to our conversation:${text} only respond in "true" or "false"`
    ,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "boolean",
      },
    },
  });
  return JSON.parse(aiRaw.text!);
}