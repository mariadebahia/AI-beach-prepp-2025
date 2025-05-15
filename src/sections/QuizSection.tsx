import React, { useState, ChangeEvent } from 'react';
import { quizQuestions, QuizQuestion, QuizResult } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Dumbbell, Brain, Rocket, TrendingUp, Users, LineChart, Zap, Check } from 'lucide-react';

const enc = encodeURIComponent;

const QUIZ_ENDPOINT = '/api/quiz';

const calculateKompetensgapPercent = (answers: Record<string | number, string>): number => {
  const kompetensQuestions = [1, 3, 5, 7, 9];
  let totalPoints = 0;
  let maxPoints = kompetensQuestions.length * 3;

  kompetensQuestions.forEach(questionId => {
    const answer = answers[questionId];
    if (answer) {
      const question = quizQuestions.find(q => q.id === questionId);
      const option = question?.options?.find(opt => opt.id === answer);
      if (option?.points !== undefined) {
        totalPoints += option.points;
      }
    }
  });

  return Math.round((totalPoints / maxPoints) * 100);
};

const calculateStrategicMaturityPercent = (answers: Record<string | number, string>): number => {
  const strategicQuestions = [2, 4, 6, 8, 10];
  let totalPoints = 0;
  let maxPoints = strategicQuestions.length * 3;

  strategicQuestions.forEach(questionId => {
    const answer = answers[questionId];
    if (answer) {
      const question = quizQuestions.find(q => q.id === questionId);
      const option = question?.options?.find(opt => opt.id === answer);
      if (option?.points !== undefined) {
        totalPoints += option.points;
      }
    }
  });

  return Math.round((totalPoints / maxPoints) * 100);
};

const calcGrowthPotential = (ans: Record<number, number>): number => {
  const points = (ans[6] ?? 0) + (ans[8] ?? 0) + (ans[2] ?? 0);
  return Math.round((points / 9) * 100);
};

const calcAIReadiness = (ans: Record<number, number>): number => {
  const total = (ans[1] ?? 0) + (ans[9] ?? 0) + (ans[10] ?? 0) + 0.5 * (ans[5] ?? 0);
  return Math.round((total / 10.5) * 100);
};

const defaultResults = {
  result_page_title: 'Nyfiken',
  level: 'Nyfiken',
  description: 'Du har tagit dina första steg in i AI-världen och visar stor potential!',
  recommendations: [
    'Börja med att identifiera enkla AI-användningsfall',
    'Utbilda teamet i grundläggande AI-koncept',
    'Experimentera med färdiga AI-verktyg',
  ],
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!',
  strategicMaturityPercent: 75,
  kompetensgapPercent: 60,
  growthPotentialPercent: 70,
  aiReadinessPercent: 65
};

interface AllAnswers {
  [questionId: string | number]: string;
}

interface ExtendedQuizResult extends QuizResult {
    comparative_statement?: string;
    industry_comparative_statement?: string;
    strategicMaturityPercent?: number;
    kompetensgapPercent?: number;
    growthPotentialPercent?: number;
    aiReadinessPercent?: number;
    result_page_title?: string;
}

const QuizSection: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AllAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<ExtendedQuizResult | null>(null);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const submitQuiz = async (allAnswers: AllAnswers) => {
    let totalPoints = 0;
    const numericAnswers: Record<number, number> = {};
    
    for (let i = 1; i <= 10; i++) {
      const question = quizQuestions.find(q => q.id === i);
      const answerValue = allAnswers[i];
      
      if (question && answerValue) {
        const selectedOption = question.options?.find(opt => opt.id === answerValue);
        if (selectedOption && selectedOption.points !== undefined) {
          totalPoints += selectedOption.points;
          numericAnswers[i] = selectedOption.points;
        } else {
          numericAnswers[i] = 0;
        }
      } else {
        numericAnswers[i] = 0;
      }
    }

    const maxScore = quizQuestions
      .filter(q => q.type === 'multiple-choice')
      .reduce((sum, q) => sum + Math.max(...(q.options?.map(opt => opt.points || 0) || [0])), 0);

    const growthPotentialPercent = calcGrowthPotential(numericAnswers);
    const aiReadinessPercent = calcAIReadiness(numericAnswers);

    const payload = {
      answers: numericAnswers,
      totalScore: totalPoints,
      maxScore,
      timestamp: new Date().toISOString(),
      quiz_version: '1.2',
      growthPotentialPercent,
      aiReadinessPercent
    };

    try {
      const response = await fetch(QUIZ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiResults = await response.json();

      if (!apiResults.success) {
        throw new Error(apiResults.error || 'Failed to submit quiz');
      }

      const localKompetensgapPercent = calculateKompetensgapPercent(allAnswers);
      const localStrategicMaturityPercent = calculateStrategicMaturityPercent(allAnswers);

      const enhancedResults = {
        ...apiResults,
        kompetensgapPercent: localKompetensgapPercent,
        strategicMaturityPercent: localStrategicMaturityPercent,
        growthPotentialPercent,
        aiReadinessPercent
      };

      return enhancedResults;

    } catch (err) {
      console.error('Quiz submission error:', err);
      throw err;
    }
  };

  const submitWithRetry = async (allAnswers: AllAnswers, maxRetries = 2) => {
    let retries = 0;

    while (retries <= maxRetries) {
      try {
        if (retries > 0) {
          console.log(`Retry attempt ${retries}/${maxRetries}`);
        }
        return await submitQuiz(allAnswers);
      } catch (error) {
        retries++;

        if (retries > maxRetries) {
          throw error;
        }

        await delay(1000 * retries);
      }
    }
    return defaultResults;
  };

  return (
    <section className="py-32 px-8 bg-[#d8d355]" id="quiz-section">
      <div className="max-w-3xl mx-auto">
        {showResults && quizResults && (
          <AnimatedSection animation="fade-up" delay="300">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl text-center">
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Button
                  as="a"
                  href="#intro-section"
                  variant="purple"
                  className="w-full sm:w-auto px-6 py-3"
                >
                  Vinn en AI-workout för jobbet
                </Button>

                <a
                  href={`mailto:?subject=${enc("// OMG, du kan aldrig gissa vad jobbet fick i ett AI-fitnesstest! - AIbeachprep.se //")}&body=${enc(
                    `OMG! Jag har precis gjort ett AI-fitnesstest för jobbet och resultaten är faktiskt rätt intressanta! \
Vi ligger tydligen på ${quizResults?.level ?? "[AI-level]"}-nivån och slår tydligen ${quizResults?.comparative_statement?.match(/\d+/)?.[0] ?? "??"}% av alla andra som tagit testet 💪

Det som verkligen fick mig att höja på ögonbrynen var att vi fick ${quizResults?.strategicMaturityPercent ?? "[AI strategic maturity]"} % \
i strategisk AI-mognad och har en potential på ${quizResults?.growthPotentialPercent ?? "[AI Growth]"} % för framtida AI-utveckling.

Gör testet du också! Man får även en analys av gapet mellan nuvarande och önskad AI-kompetens plus hur redo jobbet är för AI-implementering. \
Ah, och glöm inte att man kan vinna en gratis AI-workshop! Kolla in AIbeachprep.se!

Allt gott!`
                  )}`}
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-beach-purple text-beach-purple rounded-lg font-medium hover:bg-beach-purple/10 transition"
                >
                  Dela till chefen / kollegan
                </a>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default QuizSection;