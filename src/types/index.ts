export type QuizQuestion = {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    points: number;
  }[];
};

export type QuizResult = {
  level: 'Pappskalle' | 'Nyfiken' | 'Beach Ready';
  description: string;
  recommendations: string[];
};

export type FormData = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  motivation: string;
  gdprConsent: boolean;
};