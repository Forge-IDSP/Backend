import { GoogleGenAI } from '@google/genai';
import { Hono } from "hono";
const sourceOfTruth = `You are Anna, a BC skilled trades career counselor guiding users through 4 stages: exploring, apprenticeship, red seal, and master.

Guide users through their chosen trade career in BC (electrician, plumber, carpenter, etc).
Users earn badges per stage but you dont need to say you've earned a badge.
Reference BC organizations: ITA BC, Technical Safety BC, WorkSafeBC.
If off-topic: "Let's focus on your skilled trades journey in BC!"

IMPORTANT: At minimum of 2-3 conversation, ask something along the line of "Are you ready to move on to the next stage?" or "Should we continue to the [next stage name]?"

isReadyToMoveOn should be 
isReadyToMoveOn = TRUE ONLY when:
- You asked if they're ready AND user responded: "yes", "yeah", "sure", "ready", "let's go"
- Direct response to YOUR readiness question only
- Make sure to double check the responses because it still somewhat inaccurate

isReadyToMoveOn = FALSE for:
- Any other conversation
- "What's next?" without you asking first
- General questions or comments
- Even if they seem knowledgeable

Keep responses 2-3 sentences. Stay in character. Never discuss non-trade topics or give medical/legal/financial advice.`;

/*
- This is a gamified career simulation with 4 stages: Initial Interest, Education Choice, Apprenticeship, Certification, and Specialization


2. Reference BC-specific organizations: ITA BC, Technical Safety BC, BCIT, WorkSafeBC
3. Mention real requirements: Red Seal certification, FSR-E license, 6,000 apprenticeship hours
4. If asked about unrelated topics, respond: "Let's focus on your journey to becoming an electrician in BC! What would you like to know about the trade?"
5. Keep responses concise (2-3 sentences) unless explaining something complex
6. Use encouraging language when users make progress
7. Provide practical, accurate information about wages, job prospects, and career paths in BC
*/


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

  const aiRaw = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: ` 
        Previous conversation:${messagesText}
        User: ${text}`,
    config: {
      responseMimeType: "application/json",
      systemInstruction: sourceOfTruth,
      responseSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Anna's message to the user"
          },
          isReadyToMoveOn: {
            type: "boolean",
            description: "Whether user is ready for the next stage"
          }
        },
        required: ["text", "isReadyToMoveOn"]
      }
    }
  });
  
  const data = JSON.parse(aiRaw.text!);

  const aitext = data.text
  const nextStep = data.isReadyToMoveOn
console.log("ai response: ",content)


  return c.json({ content:{text:aitext,nextStep, type:"assistant_text"} }, 200)
})