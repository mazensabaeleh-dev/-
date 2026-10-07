export type HollandDimensionCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface HollandDimensionInfo {
  code: HollandDimensionCode;
  arabicName: string;
  englishName: string;
  tagline: string;
  color: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  itemNumbers: number[];
  description: string;
  characteristics: string[];
  workEnvironment: string;
  recommendedMajors: string[];
  careerPaths: string[];
  tipsForGrowth: string[];
}

export interface QuestionItem {
  id: number;
  profession: string;
  dimensionCode: HollandDimensionCode;
}

export type AnswerValue = 'like' | 'dislike'; // 'أميل' | 'لا أميل'

export interface StudentInfo {
  name: string;
  grade: string;
  school: string;
  counselorName: string;
  date: string;
}

export interface DimensionScore {
  code: HollandDimensionCode;
  info: HollandDimensionDimensionInfo;
  score: number; // 0 to 14
  maxScore: number; // 14
  percentage: number;
  rank: number;
  likedItems: { id: number; profession: string }[];
}

export type HollandDimensionDimensionInfo = HollandDimensionInfo;

export interface HollandAssessmentResult {
  studentInfo: StudentInfo;
  scores: DimensionScore[]; // sorted from highest to lowest
  dominantDimension: DimensionScore;
  secondaryDimension?: DimensionScore;
  tertiaryDimension?: DimensionScore;
  hollandCode: string; // e.g. "RIA"
  totalLiked: number;
  differentiationLevel: 'high' | 'medium' | 'low';
  consistencyScore: 'high' | 'medium' | 'low';
  summaryText: string;
  completedAt: string;
}
