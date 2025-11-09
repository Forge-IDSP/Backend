// controllers/AiController.ts
import { aiService, AiService } from "../controllers/aiServices";
import type { Context } from "hono";
import type { ChatRequestBody } from "../../types/types";

export class AiController {
  private _aiService: AiService;

  constructor(aiService: AiService) {
    this._aiService = aiService;
  }

  public async getChatResponse(c: Context) {
    try {
      const { userResponse, chatHistory, currentCheckpoint, checkpoints } =
        await c.req.json<ChatRequestBody>();

      const response = await this._aiService.aiReponse(
        userResponse,
        chatHistory,
        currentCheckpoint,
        checkpoints
      );

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
}

export const aiController = new AiController(aiService);
