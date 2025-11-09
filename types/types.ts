export interface UserBadge {
  title: string;
  text: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  content: {
    type: string;
    text: string;
  };
}

export interface AiResponse {
  text: string;
  type: string;
  checkPointIndex: number;
}
export interface ChatRequestBody {
  userResponse: string;
  chatHistory: ChatMessage[];
  currentCheckpoint: number;
  checkpoints: string[];
}
