import { GoogleGenAI } from "@google/genai";
import type {
  ChatMessage,
  AiResponse,
  DailyRoutineResponse,
  QuizAnswers,
  Step3Level,
  QuizRecommendation,
} from "../../types/types";

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
const initializeCareerSystemInstruction = `
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
const quizSystemInstruction = `
  You are Anna, a friendly BC skilled trades career guide for high school students.

  Based on the student's quiz answers (interest, environment, workStyle, priority), recommend EXACTLY TWO different skilled trades.

  Interest mappings:
  - "Fixing & Repairing" → Electrician, Plumber
  - "Solving & Understanding" → HVAC Technician, Industrial Mechanic (Millwright)
  - "Building & Creating" → Carpenter, Construction Craft Worker
  - "Designing & Improving" → Welder, Pipe Fitter, Cabinetmaker

  Rules:
  - FIRST career MUST be from the student's interest mapping above
  - SECOND career must be different (from same mapping OR related trade that fits their other preferences)
  - Don't default to Electrician unless it clearly fits best
  - Use simple, encouraging language for grades 9-12
  - Explain why each career fits their preferences
  - Focus on real tasks, opportunities, and next steps
  - Return ONLY JSON matching the response schema
  `;
export class AiService {
  private _gemini: GoogleGenAI;

  constructor(apiKey: string) {
    this._gemini = new GoogleGenAI({ apiKey });
  }

  public async aiResponse(
    userResponse: string,
    chatHistory: ChatMessage[],
    step: number
  ): Promise<AiResponse> {
    const conversationHistory = chatHistory
      .map((m: any) => `${m.content.type}: ${m.content.text}`)
      .join("\n");

    const mostRecentQuestion = chatHistory[chatHistory.length - 2]!;

    const { isReady, isProgressionQuestion } = await this.checkNextPoint(
      userResponse,
      mostRecentQuestion.content.text,
      step
    );

    console.log("Debug - Step:", step);
    console.log("Debug - User Response:", userResponse);
    console.log("Debug - Detection Result:", {
      isReady,
      isProgressionQuestion,
    });

    return await this.handleProgression(
      userResponse,
      conversationHistory,
      step,
      {
        isReady,
        isProgressionQuestion,
      }
    );
  }
  //Done
  public async getCareerData(data: QuizAnswers) {
    const { interest, environment, priority, workStyle } = data;

    const prompt = `
        Quiz answers:
        - Interest: ${interest}
        - Environment: ${environment}
        - Work style: ${workStyle}
        - Priority: ${priority}`.trim();

    const aiRaw = await this._gemini.models.generateContent({
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
              items: {
                type: "string",
              },
              description:
                "Array of 3-4 specific reasons why this career matches the student's quiz answers (interests, environment, work style, priority). Each reason should be a complete sentence written at grade 9-12 level.",
            },
          },
          required: ["careerName", "summary", "reasons"],
        },
      },
    });
    return JSON.parse(aiRaw.text!) as QuizRecommendation;
  }

  public async initializeCareerPath(trade: string) {
    const aiRaw = await this._gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        For someone interested in becoming a ${trade} in BC:
        
        1. List the major career progression stages (Entry Level, Apprentice, Journeyman/Red Seal, Master if applicable)
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

  public async getApprenticeLevels(careerName: string): Promise<Step3Level[]> {
    const prompt = `
      Generate apprentice training levels for ${careerName} in British Columbia.
      Create 4 progressive levels showing what an apprentice learns at each stage.
      Focus on practical skills and real tasks they would do in BC.`.trim();

    const aiRaw = await this._gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a BC skilled trades training expert familiar with ITA BC (Industry Training Authority) standards.

  CONTEXT:
  - Create realistic apprentice level progressions for ${careerName} following BC's apprenticeship model
  - Each level represents approximately 1,500-1,800 hours of work experience
  - Include skills that align with ITA BC's standardized training requirements
  - Reference BC-specific safety requirements (WorkSafeBC standards)
  - Mention relevant BC certifications or licenses when applicable

  GUIDELINES:
  - Level 1: Foundation skills, safety training, basic tool use
  - Level 2: Intermediate skills, working under supervision, understanding BC codes
  - Level 3: Advanced techniques, some independent work, preparing for IP exam
  - Level 4: Complex tasks, mentoring others, preparing for journeyperson/Red Seal (C of Q) exam

  Write in simple, clear language for grade 9-12 students.
  Each level should have 3 specific, practical skills they would actually learn in BC.
  Each sentence shouldn't be longer than 10 words.
  Be specific to ${careerName} trade practices in British Columbia.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            levels: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Level title, e.g. 'Level 1 – Apprentice'",
                  },
                  items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description:
                      "3-4 specific skills or tasks for this level, relevant to BC",
                  },
                },
                required: ["title", "items"],
              },
              description:
                "Array of 4 apprentice levels following ITA BC structure",
            },
          },
          required: ["levels"],
        },
      },
    });

    const result = JSON.parse(aiRaw.text!) as { levels: Step3Level[] };
    return result.levels;
  }
  private async checkNextPoint(
    userResponse: string,
    currentQuestion: string,
    step: number
  ): Promise<{ isReady: boolean; isProgressionQuestion: boolean }> {
    try {
      const stepContext = this.getStepContext(step);

      const aiRaw = await this._gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          Current Step: ${step}
          Step Context: ${stepContext}
          Question asked: ${currentQuestion}
          User response: ${userResponse}
          
          Analyze this exchange in a BC skilled trades career counseling context.
        `,
        config: {
          responseMimeType: "application/json",
          systemInstruction: this.getValidationContext(step),
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

  private getStepContext(step: number): string {
    switch (step) {
      case 2:
        return "User has completed exploring the Foundation program and is discussing their understanding before moving to apprenticeship levels.";
      case 3:
        return "User has completed all 4 apprenticeship levels and is discussing their readiness to move to the next career exploration stage.";
      default:
        return "General career counseling discussion.";
    }
  }

  private async handleProgression(
    userText: string,
    chatHistory: string,
    step: number,
    context: { isReady: boolean; isProgressionQuestion: boolean }
  ): Promise<AiResponse> {
    let contextPrompt: string;
    let shouldProgress = false;

    if (context.isReady && context.isProgressionQuestion) {
      shouldProgress = true;
      contextPrompt = `The user is ready to progress from Step ${step}. 
      Acknowledge their readiness and provide a transition message.
      Be encouraging and positive about moving forward.
      End with a statement like "Let's move forward!" or "Time to advance!" 
      DO NOT ask "What are you curious about?" or any other questions.
      Keep the message to 2 sentences maximum, under 40 words`;
    } else if (context.isProgressionQuestion && !context.isReady) {
      contextPrompt = `The user isn't ready to move forward yet from Step ${step}.
      Offer encouragement and ask what additional information they need.
      DO NOT ask about progression again.
      Keep the message to 2 sentences maximum, under 40 words`;
    } else {
      contextPrompt = `Continue the conversation naturally for Step ${step}. 
      Help the user explore skilled trades careers based on their interests and questions.
      After MAXIMUM 3 meaningful exchanges, you may ask if they're ready to move forward.
      Focus on providing helpful information about their current stage.
      Keep the message to 2 sentences maximum, under 40 words`;
    }

    const aiRaw = await this._gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      Step: ${step}
      Context for this response: ${contextPrompt}
      Previous conversation: ${chatHistory}
      User: ${userText}
    `,
      config: {
        responseMimeType: "application/json",
        systemInstruction: this.getSystemInstruction(step),
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
      shouldProgress, // 🔥 Simple boolean instead of checkpoint index
    };
  }

  private getValidationContext(step: number): string {
    const baseContext = `You are Anna, a BC skilled trades career counselor.`;

    switch (step) {
      case 2:
        return `${baseContext} You're in Step 2 where users explore Foundation programs.
        
        Look for progression indicators like:
        - "I'm ready for apprenticeships"
        - "I think I'm ready to move on"  
        - "actually I think I'm ready"   
        - "ready to move on"              
        - "Let's learn about the next step"
        - "What comes after foundation?"
        - "yes"
        
        Only mark isProgressionQuestion as true when YOU ask if they want to move forward.
        Only mark isReady as true when they clearly indicate readiness to learn about apprenticeships.`;

      case 3:
        return `${baseContext} You're in Step 3 where users complete apprenticeship levels.
        
        Look for progression indicators like:
        - "I'm ready for the next step"
        - "Let's move on"
        - "What's next?"
        - "I understand, let's continue"
        - "yes"

        Only mark isProgressionQuestion as true when YOU ask if they want to move forward.
        Only mark isReady as true when they clearly indicate readiness to progress.`;

      default:
        return baseContext;
    }
  }

  private getSystemInstruction(step: number): string {
    const baseInstruction = `You are Anna, a friendly BC skilled trades career counselor.`;

    switch (step) {
      case 2:
        return `${baseInstruction} You're helping users understand Foundation programs.
        
        Topics you can discuss:
        - Program structure and timeline
        - Prerequisites and admission requirements
        - Hands-on training vs classroom learning
        - How foundation prepares for apprenticeship
        - Career opportunities after completion
        
        Be encouraging and informative. Only ask about progression when appropriate.
        Keep the message to 2 sentences.
        Total word count shouldn't exceed 25`;

      case 3:
        return `${baseInstruction} You're discussing completed apprenticeship levels.
        
        Topics you can discuss:
        - What they learned through the levels
        - Journeyperson / Red Seal certification process
        - Career advancement opportunities
        - Skills development journey
        - Next steps in their career path
        
        Be encouraging about their completion and answer their questions thoroughly.
        Keep the message to 2 sentences.
        Total word count shouldn't exceed 25`;

      default:
        return baseInstruction;
    }
  }
}

export const aiService = new AiService(process.env.GEMINI_API_KEY!);
