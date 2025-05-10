export type QuestionType = 'multiple-choice' | 'dropdown' | 'text';

export interface QuizOption {
  id: string;
  text: string;
  points?: number;
}

export interface QuizQuestion {
  id: string | number;
  question: string;
  type: QuestionType;
  options?: QuizOption[];
  placeholder?: string;
}

export interface QuizResult {
  level: string;
  description: string;
  recommendations: string[];
}

export type FormData = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  motivation: string;
  gdprConsent: boolean;
};