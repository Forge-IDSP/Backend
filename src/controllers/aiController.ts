// controllers/AiController.ts
import { aiService, AiService } from "../controllers/aiServices";
import type { Context } from "hono";
import type {
  ChatRequestBody,
  QuizAnswers,
  Step3Level,
} from "../../types/types";
import { createMyPathway } from "../controllers/myPathwayService";
import type { Step } from "../db/schema"

export class AiController {
  private _aiService: AiService;

  constructor(aiService: AiService) {
    this._aiService = aiService;
  }

  public async getChatResponse(c: Context) {
    try {
      const {
        userResponse,
        chatHistory,
        step, // Add step to the request body type
      } = await c.req.json<ChatRequestBody>();

      const response = await this._aiService.aiResponse(
        userResponse,
        chatHistory,
        step
      );
      console.log(response);
      return c.json(
        {
          success: true,
          data: response,
          error: null,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json(
        {
          success: false,
          error: "Failed to generate AI response",
          data: null,
        },
        500
      );
    }
  }
  public async getCareerData(c: Context) {
    const { careerName }: { careerName: string } = await c.req.json();

    // const response = this._aiService.getCareerData(careerName);
  }
  public async initializeCareer(c: Context) {
    try {
      const body = await c.req.json();
      const { trade } = body;

      if (!trade || typeof trade !== "string") {
        return c.json(
          {
            success: false,
            error: "Trade is required",
            data: null,
          },
          400
        );
      }

      const checkpoints = await this._aiService.initializeCareerPath(trade);

      return c.json(
        {
          success: true,
          data: {
            trade,
            checkpoints,
          },
          error: null,
        },
        200
      );
    } catch (error) {
      console.error("Error in initializeCareer:", error);
      return c.json(
        {
          success: false,
          error: "Failed to initialize career path",
          data: null,
        },
        500
      );
    }
  }
  public async matchCareer(c: Context) {
    const {
      userId,
      quizAnswers,
    }: { userId: string; quizAnswers: QuizAnswers } = await c.req.json();
    console.log(quizAnswers);

    const data = await this._aiService.getCareerData(quizAnswers);

    const newMsg = {
      id: `quiz_ack_${Date.now()}`,
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
  }
  public async getApprenticeLevels(c: Context) {
    try {
      const careerName = c.req.param("careerName");

      if (!careerName) {
        return c.json(
          {
            error: "Career name is required",
            levels: [],
          },
          400
        );
      }

      const decodedCareerName = decodeURIComponent(careerName);

      console.log(`Generating apprentice levels for: ${decodedCareerName}`);

      const levels = await this._aiService.getApprenticeLevels(
        decodedCareerName
      );

      return c.json({
        levels,
      });
    } catch (error) {
      console.error("Error generating apprentice levels:", error);
    }
  }
public async createMyPathway(c: Context) {
  try {
    const { userId, quizAnswers } = await c.req.json();

    if (!userId) {
      return c.json(
        { success: false, error: "userId is required", data: null },
        400
      );
    }

    if (!quizAnswers) {
      return c.json(
        { success: false, error: "quizAnswers are required", data: null },
        400
      );
    }

    console.log("createMyPathway payload:", { userId, quizAnswers });

    const quiz = await this._aiService.getCareerData(quizAnswers);
    if (!quiz?.careerName) {
      throw new Error("AI did not return a valid careerName");
    }

    const trade = quiz.careerName;

    const careerIntro = await this._aiService.initializeCareerPath(trade);
    if (!careerIntro?.checkpoints || !Array.isArray(careerIntro.checkpoints)) {
      throw new Error("careerIntro.checkpoints is invalid");
    }

    const apprenticeLevels = await this._aiService.getApprenticeLevels(trade);
    if (!Array.isArray(apprenticeLevels)) {
      throw new Error("apprenticeLevels is invalid");
    }

    const steps: Step[] = [
      {
        title: `Welcome to the ${trade} Pathway`,
        subtitle: careerIntro.onboardingMessage,
        meta: "Intro",
      },
      ...careerIntro.checkpoints.map((cp: string, index: number) => ({
        title: cp,
        subtitle: apprenticeLevels[index]?.items?.join(" • "),
        meta: `Stage ${index + 1}`,
      })),
    ];

    const aiSummary = quiz.summary;
    const aiData = {
      trade,
      quizRecommendation: quiz,
      careerIntro,
      apprenticeLevels,
    };

    const title = `${trade} Pathway`;
    const badgeNames = ["jobs", trade.toLowerCase()];

    const saved = await createMyPathway({
      userId,
      title,
      steps,
      aiSummary,
      aiData,
      badgeNames,
    });

    return c.json({ success: true, data: saved, error: null }, 200);
  } catch (error) {
    console.error("Error creating pathway:", error);

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create pathway",
        data: null,
      },
      500
    );
  }
}
  public async createMyPathwayFromCareer(c: Context) {
  try {
    const { userId, careerName } = await c.req.json<{
      userId: string;
      careerName: string;
    }>();

    if (!userId || !careerName) {
      return c.json(
        {
          success: false,
          error: "userId and careerName are required",
          data: null,
        },
        400
      );
    }

    const trade = careerName;

    // 1. Intro
    const careerIntro = await this._aiService.initializeCareerPath(trade);

    // 2. Levels
    const apprenticeLevels =
      await this._aiService.getApprenticeLevels(trade);

    // 3. Steps (simple version)
    const steps: Step[] = [
      {
        title: `Welcome to the ${trade} Pathway`,
        subtitle: careerIntro.onboardingMessage,
        meta: "Intro",
      },
      ...careerIntro.checkpoints.map((cp: string, index: number) => ({
        title: cp,
        subtitle: apprenticeLevels[index]
          ? apprenticeLevels[index].items.join(" • ")
          : undefined,
        meta: `Stage ${index + 1}`,
      })),
    ];

    // 4. Summary + aiData
    const aiSummary = careerIntro.onboardingMessage;
    const aiData = {
      trade,
      careerIntro,
      apprenticeLevels,
    };

    // 5. Title + badges
    const title = `${trade} Pathway`;
    const badgeNames = ["jobs", trade.toLowerCase()];

    // 6. Save using existing myPathwayService (respects uniq (userId, title))
    const saved = await createMyPathway({
      userId,
      title,
      steps,
      aiSummary,
      aiData,
      badgeNames,
    });

    return c.json({ success: true, data: saved, error: null }, 200);
} catch (error) {
  console.error("Error creating pathway from career:", error);

  return c.json(
    {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create pathway from career",
      data: null,
    },
    500
  );
}
}


}

export const aiController = new AiController(aiService);
