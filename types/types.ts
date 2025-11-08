export interface UserBadge {
  title: string;
  text: string;
  icon: string;
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
  level: "Apprentice" | "Journeyperson" | "Master";
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
