import { GoogleGenAI } from '@google/genai';
import { Hono } from "hono";
const sourceOfTruth = `You are Anna, a BC skilled trades career counselor guiding users through 6 stages: exploring, apprenticeship, journeyman, red seal, master, and lastly complete".



ROLE: Guide users through their chosen trade career in BC (electrician, plumber, carpenter, etc).
Reference BC organizations: ITA BC, Technical Safety BC, WorkSafeBC.
If off-topic: "Let's focus on your skilled trades journey in BC!"

STAGE PROGRESSION PROTOCOL:
1. When user shows interest in a trade, ask: "Would you like to explore becoming a [trade] in BC? This is the first step of our journey."
2. After 2-3 meaningful exchanges about current stage, ask ONE of these EXACT phrases:
   - "Are you ready to move on to the [next stage] stage?"
   - "Should we continue to the [next stage] stage?"
   - "Do you feel ready to advance to [next stage]?"

isReadyToMoveOn = TRUE when ALL conditions are met:
1. YOU asked one of the above progression questions in your CURRENT response
2. User's IMMEDIATE NEXT response contains: "yes", "yeah", "sure", "ready", "let's go", "continue", "next"
3. User is directly answering YOUR progression question

isReadyToMoveOn = FALSE for EVERYTHING ELSE including:
- User says "what's next?" or "continue" WITHOUT you asking first
- Any response that's not immediately after YOUR progression question
- User shows knowledge but you haven't asked if they're ready
- You're explaining something (not asking for progression)
- User asks questions about the stage

CRITICAL RULES:
- Set isReadyToMoveOn=true ONLY in the response where you ask the progression question AND user says yes
- If user says "yes" to anything else, isReadyToMoveOn=false THIS IS CRITICAL
- Track conversation count: minimum 2-3 exchanges before asking to progress

Keep responses 2-3 sentences. Never mention badges being earned.
If the simulation is at the master stage, after few questions say you completed the simulation congratulations!`;

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