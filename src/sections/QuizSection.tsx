import React, { useState, ChangeEvent } from 'react';
import { quizQuestions, QuizQuestion, QuizResult } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Dumbbell, Brain, Rocket, TrendingUp, Users, LineChart, Zap, Check } from 'lucide-react';

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

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitting) return;

    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);

    if (currentQuestion.type === 'multiple-choice' && currentQuestionIndex < 9) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      submitAllAnswers(newAnswers);
    }
  };

  const submitAllAnswers = async (finalAnswers: AllAnswers) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const results = await submitWithRetry(finalAnswers);
      setQuizResults(results);
      setShowResults(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      const errorMessage = err instanceof Error ? err.message : 'Ett oväntat fel inträffade';
      setError(`Det gick inte att skicka dina svar. ${errorMessage}`);
      setQuizResults(defaultResults);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultIcon = (level?: string) => {
    if (!level) return null;

    const levelKey = level.toLowerCase();

    switch (levelKey) {
      case 'pappskalle':
        return <Dumbbell className="w-16 h-16 text-red-500 mx-auto mb-6" />;
      case 'nyfiken':
        return <Brain className="w-16 h-16 text-yellow-500 mx-auto mb-6" />;
      case 'beach ready':
        return <Rocket className="w-16 h-16 text-green-500 mx-auto mb-6" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-32 px-8 bg-[#d8d355]" id="quiz-section">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection animation="fade-up">
          <h2 className="h2-quiz-outline mb-8 text-left leading-[1.2]">
            Hur är det med AI-formen? Ta vårt AI-fitnesstest!
          </h2>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <h5 className="text-[1.4375rem] leading-relaxed mb-8 text-left">
            Vårt AI-fitnesstest är inte bara kul – det mäter er strategiska AI-mognad och visar på eventuellt kompetensgap samt levererar tre konkret rekommendation.<break></break>

            På bara 2 minuter får ni koll på läget. Och nästa steg.
          </h5>
        </AnimatedSection>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!showResults ? (
          <AnimatedSection animation="fade-up" delay="300">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <ProgressBar
                currentStep={currentQuestionIndex + 1}
                totalSteps={10}
              />

              {currentQuestion && (
                <>
                  <h3 className="text-2xl font-semibold mb-6">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-4">
                    {currentQuestion.options?.map((option) => (
                      <QuizOption
                        key={option.id}
                        id={`question-${currentQuestion.id}-option-${option.id}`}
                        name={`question-${currentQuestion.id}`}
                        text={option.text}
                        isSelected={answers[currentQuestion.id] === option.id}
                        onSelect={() => handleOptionSelect(option.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </AnimatedSection>
        ) : (
          showResults && quizResults && (
            <AnimatedSection animation="fade-up" delay="300">
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl text-center">
                {getResultIcon(quizResults.level)}

                <h2 className="font-['Bricolage_Grotesque'] text-[3.75rem] mb-8 text-center leading-[1.2]">
                  Din AI-fitness nivå: {quizResults.level}
                </h2>

                {quizResults.description && (
                  <p className="quiz-body-text mb-6 text-xl font-bold">
                    {quizResults.description}
                  </p>
                )}

                {quizResults.recommendations && quizResults.recommendations.length > 0 && (
                  <div className="level-recommendations mt-8">
                    <h6 className="text-[23px] font-medium mb-4">Rekommendationer för din nivå:</h6>
                    <ul className="quiz-recommendations">
                      {quizResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center gap-3 mb-4">
                          <Check className="text-green-500 flex-shrink-0" size={24} />
                          <span className="text-left leading-snug">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {quizResults.comparative_statement && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <p className="quiz-percentile">
                      {quizResults.comparative_statement}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {quizResults.strategicMaturityPercent !== undefined && (
                    <div className="quiz-metric-card">
                      <div className="flex justify-center mb-4">
                        <TrendingUp className="w-8 h-8 text-deep-purple" />
                      </div>
                      <h6 className="text-[23px] font-medium mb-4">AI strategisk mognad</h6>
                      <div className="text-[3.75rem] font-bold text-deep-purple mb-4 py-4">
                        {quizResults.strategicMaturityPercent}%
                      </div>
                      <p className="quiz-body-text">Bedömning av hur väl AI är integrerad i företagets övergripande strategi</p>
                    </div>
                  )}

                  {quizResults.kompetensgapPercent !== undefined && (
                    <div className="quiz-metric-card">
                      <div className="flex justify-center mb-4">
                        <Users className="w-8 h-8 text-deep-purple" />
                      </div>
                      <h6 className="text-[23px] font-medium mb-4">Kompetensgap</h6>
                      <div className="text-[3.75rem] font-bold text-deep-purple mb-4 py-4">
                        {quizResults.kompetensgapPercent}%
                      </div>
                      <p className="quiz-body-text">Skillnaden mellan nuvarande och önskad AI-kompetens i organisationen</p>
                    </div>
                  )}

                  {quizResults.growthPotentialPercent !== undefined && (
                    <div className="quiz-metric-card">
                      <div className="flex justify-center mb-4">
                        <LineChart className="w-8 h-8 text-deep-purple" />
                      </div>
                      <h6 className="text-[23px] font-medium mb-4">AI-Tillväxtpotential</h6>
                      <div className="text-[3.75rem] font-bold text-deep-purple mb-4 py-4">
                        {quizResults.growthPotentialPercent}%
                      </div>
                      <p className="quiz-body-text">Potential för framtida AI-utveckling och expansion</p>
                    </div>
                  )}

                  {quizResults.aiReadinessPercent !== undefined && (
                    <div className="quiz-metric-card">
                      <div className="flex justify-center mb-4">
                        <Zap className="w-8 h-8 text-deep-purple" />
                      </div>
                      <h6 className="text-[23px] font-medium mb-4">AI-Readiness</h6>
                      <div className="text-[3.75rem] font-bold text-deep-purple mb-4 py-4">
                        {quizResults.aiReadinessPercent}%
                      </div>
                      <p className="quiz-body-text">Organisationens beredskap för AI-implementation</p>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          )
        )}
      </div>
    </section>
  );
};

export default QuizSection;