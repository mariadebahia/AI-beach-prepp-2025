import React, { useState, ChangeEvent } from 'react';
import { quizQuestions, QuizQuestion, QuizResult } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Dumbbell, Brain, Rocket, TrendingUp, Users } from 'lucide-react';

// Updated API key and URL
const MANUS_WEBHOOK_URL = 'https://4zmhqivc0g0q.manus.space/quiz_submit';
const API_KEY = 'ed5aed3cdd2410758637cc8a50e26fbb4402bead81885f55a933331228fb5f1f'; // Added missing 'f' at the end

// Updated defaultResults to include level property
const defaultResults = {
  result_page_title: 'Nyfiken',
  level: 'Nyfiken',
  description: `
    <p class="quiz-body-text mb-8">Du har tagit dina första steg in i AI-världen och visar stor potential!</p>
    <div class="mb-8">
      <h6 class="text-[23px] font-medium mb-4">Rekommendationer:</h6>
      <ul class="quiz-recommendations">
        <li class="flex items-center justify-center gap-3 mb-4">
          <span class="text-center leading-snug">Börja med att identifiera enkla AI-användningsfall</span>
        </li>
        <li class="flex items-center justify-center gap-3 mb-4">
          <span class="text-center leading-snug">Utbilda teamet i grundläggande AI-koncept</span>
        </li>
        <li class="flex items-center justify-center gap-3 mb-4">
          <span class="text-center leading-snug">Experimentera med färdiga AI-verktyg</span>
        </li>
      </ul>
    </div>
  `,
  recommendations: [
    'Börja med att identifiera enkla AI-användningsfall',
    'Utbilda teamet i grundläggande AI-koncept',
    'Experimentera med färdiga AI-verktyg'
  ],
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!',
  strategicMaturityPercent: 75,
  kompetensgapPercent: 60
};

interface AllAnswers {
  [questionId: string | number]: string;
}

const QuizSection: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AllAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  const currentQuestion = quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length
    ? quizQuestions[currentQuestionIndex]
    : null;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const submitQuiz = async (allAnswers: AllAnswers) => {
    let totalScore = 0;
    const scoredAnswers: Record<string | number, string> = {};

    quizQuestions.forEach(question => {
      const answerId = allAnswers[question.id];
      if (question.type === 'multiple-choice' && answerId) {
        const selectedOption = question.options?.find(opt => opt.id === answerId);
        if (selectedOption && selectedOption.points !== undefined) {
          totalScore += selectedOption.points;
          scoredAnswers[question.id] = answerId;
        }
      }
    });

    const payloadAnswers: Record<string | number, string> = { ...scoredAnswers };

    quizQuestions.forEach(question => {
      if (question.type !== 'multiple-choice') {
        const answer = allAnswers[question.id];
        if (answer) {
          payloadAnswers[question.id] = answer;
        }
      }
    });

    const payload = {
      answers: payloadAnswers,
      totalScore,
      maxPossibleScore: quizQuestions
        .filter(q => q.type === 'multiple-choice')
        .reduce((sum, q) => sum + Math.max(...(q.options?.map(opt => opt.points || 0) || [0])), 0),
      timestamp: new Date().toISOString(),
      quiz_version: '1.1',
    };

    try {
      const response = await fetch(MANUS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-KEY': API_KEY
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      console.log('Response was not JSON, using default results', await response.text());
      return defaultResults;

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
          console.log(`Försöker igen... (${retries}/${maxRetries})`);
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

    const newAnswers = { ...answers, [currentQuestion!.id]: optionId };
    setAnswers(newAnswers);

    if (currentQuestion!.type === 'multiple-choice' && currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === quizQuestions.length - 1) {
      submitAllAnswers(newAnswers);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isSubmitting) return;

    const newAnswers = { ...answers, [currentQuestion!.id]: event.target.value };
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) {
      setError("Vänligen välj ett svar eller fyll i fältet.");
      return;
    }
    setError(null);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitAllAnswers(answers);
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

  // Fixed getResultIcon function with optional chaining
  const getResultIcon = () => {
    if (!quizResults?.level) return null;

    switch (quizResults.level.toLowerCase()) {
      case 'pappskalle':
        return <Dumbbell className="w-16 h-16 text-red-500 mx-auto mb-6" />;
      case 'nyfiken':
        return <Brain className="w-16 h-16 text-yellow-500 mx-auto mb-6" />;
      case 'beach ready':
        return <Rocket className="w-16 h-16 text-green-500 mx-auto mb-6" />;
      default:
        return <Brain className="w-16 h-16 text-yellow-500 mx-auto mb-6" />;
    }
  };

  return (
    <section className="py-32 px-8 bg-[#CDB4DB]" id="quiz-section">
      <div className="max-w-3xl mx-auto">
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
          Har ni AI-FOMO på jobbet?
        </h2>
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
          Lungt, vi får er att komma igång!
        </h2>

        <h5 className="text-[1.4375rem] leading-relaxed mb-8 text-center">
          Kör vårt 2-minuters quiz och kolla vilket AI-nivå ni är på idag: Pappskalle, Nyfiken Nybörjare eller Beach Ready?
        </h5>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!showResults ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <ProgressBar
              currentStep={currentQuestionIndex + 1}
              totalSteps={quizQuestions.length}
            />

            {currentQuestion && (
              <>
                <h3 className="text-xl font-semibold mb-6">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.type === 'multiple-choice' && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 && (
                  <div className="space-y-4">
                    {currentQuestion.options.map((option) => (
                      <QuizOption
                        key={option.id}
                        id={option.id}
                        text={option.text}
                        isSelected={answers[currentQuestion.id] === option.id}
                        onSelect={() => handleOptionSelect(option.id)}
                      />
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'dropdown' && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 && (
                  <div className="mb-4">
                    <select
                      value={answers[currentQuestion.id] || ''}
                      onChange={handleInputChange}
                      className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>Välj...</option>
                      {currentQuestion.options.map(option => (
                        <option key={option.id} value={option.id}>{option.text}</option>
                      ))}
                    </select>
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={answers[currentQuestion.id] || ''}
                      onChange={handleInputChange}
                      placeholder={currentQuestion.placeholder || ''}
                      className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {currentQuestion.type !== 'multiple-choice' && (
                  <div className="mt-6">
                    <Button
                      onClick={handleNextQuestion}
                      variant="purple"
                      className="w-full bg-beach-purple text-white py-3 rounded-md disabled:opacity-50"
                      disabled={isSubmitting || !answers[currentQuestion.id]}
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? 'Nästa fråga' : 'Skicka svar'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : quizResults && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center">
            {getResultIcon()}

            <h2
              style={{
                fontFamily: 'Gloock, serif',
                fontWeight: 400
              }}
              className="text-[3.75rem] mb-8 text-center leading-[1.2]"
            >
              Din AI-fitness nivå: {quizResults.level}
            </h2>

            <div className="quiz-body-html-content mb-8" dangerouslySetInnerHTML={{ __html: quizResults.description + (quizResults.recommendations && quizResults.recommendations.length > 0 ? '<h6 class="text-[23px] font-medium mb-4 mt-6">Rekommendationer:</h6><ul class="quiz-recommendations">' + quizResults.recommendations.map(rec => `<li class="flex items-center justify-center gap-3 mb-4"><span class="text-center leading-snug">${rec}</span></li>`).join('') + '</ul>' : '') }} />

            <Button
              onClick={() => document.getElementById('competition-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="purple"
              className="bg-beach-purple text-white"
            >
              Tävla om en AI-workshop
            </Button>
          </div>
        )}

        {isSubmitting && (
          <div className="text-center text-lg font-semibold mt-6">
            Skickar svar...
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizSection;