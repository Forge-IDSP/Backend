import { GoogleGenAI } from "@google/genai";
import type { ChatMessage, AiResponse } from "../../types/types";
import "dotenv/config";
const contextForValidation = `You are analyzing a conversation between Anna (career counselor) and a user.

TASK 1: Is this a progression question?
A progression question is when Anna asks if the user is ready to move to the next stage of their journey.
Look for intent, not exact wording. Examples include:
- "Are you ready to move on to the apprenticeship stage?"
- "Should we continue to the next stage?"
- "Do you feel ready to advance?"
- Any question asking if user wants to proceed/continue/move forward to a next phase

TASK 2: If it IS a progression question, is the user ready?
User is ready if they:
- Give affirmative responses (yes, yeah, sure, ready, let's go, absolutely, etc.)
- Show enthusiasm or agreement
- Are directly answering the question (not asking their own questions)

User is NOT ready if they:
- Say no, not yet, wait, etc.
- Express confusion or ask questions
- Give vague or non-committal responses
- Change the subject`;
const sourceOfTruth = `You are Anna, a BC skilled trades career counselor guiding users through certification stages.

CORE BEHAVIOR:
- Guide users through their chosen trade (electrician, plumber, carpenter, etc.)
- Reference BC organizations: ITA BC, Technical Safety BC, WorkSafeBC, BCIT
- If off-topic: "Let's focus on your skilled trades journey in BC!"
- Keep responses concise (2-3 sentences) unless explaining complex topics
- Use encouraging language

STAGE PROGRESSION:
1. When user chooses a trade: "Would you like to explore becoming a [trade] in BC?"
2. After 2-3 meaningful exchanges, ask ONE of:
   - "Are you ready to move on to [next stage]?"
   - "Should we continue to [next stage]?"
   - "Do you feel ready to advance to [next stage]?"
3. NEVER ask about progression twice in a row

CONTENT GUIDELINES:
- Mention real requirements (Red Seal, FSR-E license, apprenticeship hours)
- Provide accurate info on wages, job prospects, career paths
- This is a gamified career simulation with progressive stages`;

export class AiService {
  private _gemini: GoogleGenAI;

  constructor(apiKey: string) {
    this._gemini = new GoogleGenAI({ apiKey });
  }

  public async aiReponse(
    userResponse: string,
    chatHistory: ChatMessage[],
    currentCheckpoint: number,
    checkpoints: string[]
  ): Promise<AiResponse> {
    const conversationHistory = chatHistory
      .map((m: any) => `${m.content.type}: ${m.content.text}`)
      .join("\n");

    const mostRecentQuestion = chatHistory[chatHistory.length - 2]!;

    const { isReady, isProgressionQuestion } = await this.checkNextPoint(
      userResponse,
      mostRecentQuestion.content.text
    );

    console.log("Debug - User Response:", userResponse);
    console.log("Debug - Detection Result:", {
      isReady,
      isProgressionQuestion,
    });
    console.log("Debug - Current Checkpoint:", currentCheckpoint);
    console.log(
      "Debug - New Checkpoint will be:",
      isReady && isProgressionQuestion
        ? currentCheckpoint + 1
        : currentCheckpoint
    );
    return await this.handleProgression(
      userResponse,
      conversationHistory,
      checkpoints,
      currentCheckpoint,
      {
        isReady,
        isProgressionQuestion,
      }
    );
  }
  public async initializeCareerPath(trade: string) {
    const aiRaw = await this._gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      For someone interested in becoming a ${trade} in BC:
      
      1. List the major career progression stages (Entry Level, Apprentice, Journeyman, Red Seal, Master if applicable)
      2. Create a welcoming onboarding message that:
         - Welcomes them to their ${trade} journey
         - Briefly explains what the Entry Level stage involves
      
      Keep the onboarding message to 2-3 sentences.
    `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            checkpoints: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The career progression stages",
            },
            onboardingMessage: {
              type: "string",
              description: "Anna's welcoming message for this trade journey",
            },
          },
          required: ["checkpoints", "onboardingMessage"],
        },
      },
    });
    const result = JSON.parse(aiRaw.text!);
    return result;
  }
  private async checkNextPoint(
    userResponse: string,
    currentQuestion: string
  ): Promise<{ isReady: boolean; isProgressionQuestion: boolean }> {
    try {
      const aiRaw = await this._gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
      Question asked: ${currentQuestion}
      User response: ${userResponse}
      
      Analyze this exchange in a BC skilled trades career counseling context.
    `,
        config: {
          responseMimeType: "application/json",
          systemInstruction: contextForValidation,
          responseSchema: {
            type: "object",
            properties: {
              isProgressionQuestion: {
                type: "boolean",
                description:
                  "Whether Anna is asking if user wants to move to next stage",
              },
              isReady: {
                type: "boolean",
                description:
                  "Whether user indicates readiness (only valid if isProgressionQuestion is true)",
              },
            },
            required: ["isProgressionQuestion", "isReady"],
          },
        },
      });

      const result = JSON.parse(aiRaw.text!);

      if (!result.isProgressionQuestion) {
        result.isReady = false;
      }

      console.log("Progression check:", result);
      return result;
    } catch (error) {
      console.error("Check Next Point Error:", error);
      return {
        isReady: false,
        isProgressionQuestion: false,
      };
    }
  }
  private async handleProgression(
    userText: string,
    chatHistory: string,
    checkpoints: string[],
    currentCheckpoint: number,
    context: { isReady: boolean; isProgressionQuestion: boolean }
  ): Promise<AiResponse> {
    let contextPrompt: string;
    const currentStage = checkpoints[currentCheckpoint];
    const nextStage = checkpoints[currentCheckpoint + 1];

    let newCheckpoint = currentCheckpoint;

    if (context.isReady && context.isProgressionQuestion) {
      newCheckpoint = currentCheckpoint + 1;

      contextPrompt = `The user has agreed to progress from "${currentStage}" to "${nextStage}". 
        Welcome them to the "${nextStage}" stage.
        Explain what happens in the "${nextStage}" stage.
        DO NOT ask about moving to another stage - we just entered this one.`;
    } else if (context.isProgressionQuestion && !context.isReady) {
      contextPrompt = `The user isn't ready to move forward yet. 
        Currently on this checkpoint ${currentStage}
        Offer encouragement and ask what additional information they need about the current stage.
        DO NOT ask about progression again.`;
    } else {
      contextPrompt = `Continue the conversation naturally, helping the user explore 
        Currently on this checkpoint ${currentStage}
        skilled trades careers based on their interests and questions.
        DO NOT ask about progression - we need more meaningful exchanges first.
        Just focus on providing helpful information about their current stage.`;
    }

    if (newCheckpoint >= checkpoints.length) {
      contextPrompt = `The user has completed all stages! 
      Congratulate them on completing their journey through all checkpoints.
      Summarize their achievement and offer any final guidance.`;
      newCheckpoint = currentCheckpoint;
    }

    const aiRaw = await this._gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        context for this response: ${contextPrompt}
        Previous conversation: ${chatHistory}
        User: ${userText}
      `,
      config: {
        responseMimeType: "application/json",
        systemInstruction: sourceOfTruth,
        responseSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Anna's message to the user",
            },
          },
          required: ["text"],
        },
      },
    });
    const data = JSON.parse(aiRaw.text!);

    return {
      text: data.text,
      type: "assistant_text",
      checkPointIndex: newCheckpoint,
    };
  }
}

export const aiService = new AiService(process.env.GEMINI_API_KEY!);
