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

// Update your AiResponse type
export interface AiResponse {
  text: string;
  type: "assistant_text";
  shouldProgress: boolean; // 🔥 Replace checkPointIndex with this
}
export interface ChatRequestBody {
  userResponse: string;
  chatHistory: ChatMessage[];
  step: number; // 🔥 Remove currentCheckpoint and checkpoints
}
export type Job = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

export type SkillLevel = {
  skill: string;
  priority: "Essential" | "Important" | "Good to Have";
};

export type CareerPath = {
  level: "Apprentice" | "Journey Person" | "Master";
  description: string;
  minIncome: number;
  income: number;
  year: string;
  trainingRequired: string;
  trainingYear: string;
};

export type JobDetail = Job & {
  dailyRoutines: string[];
  skillsRequired: SkillLevel[];
  careerPath: CareerPath[];
};

export type User = {
  id: string;
  badges: string[];
};

export type DailyRoutineResponse = {
  title: string;
  items: string[];
};

export type QuizAnswers = {
  interest: string;
  environment: string;
  workStyle: string;
  priority: string;
};

export type QuizRecommendation = {
  careerName: string;
  summary: string;
  reasons: string[];
  nextSteps: string[];
};

export type Employer = {
  id: number;
  title: string;
  description: string;
  logo?: string | undefined;
};

export type Step3Level = {
  title: string;
  items: string[];
};
