import React, { useState } from 'react';
import { quizQuestions } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Dumbbell, Brain, Rocket, TrendingUp, Users } from 'lucide-react';

const MANUS_WEBHOOK_URL = 'https://4zmhqivc0g0q.manus.space/quiz_submit';

const defaultResults = {
  result_page_title: 'Nyfiken',
  result_html_content: `
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
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!',
  strategicMaturityPercent: 75,
  kompetensgapPercent: 60
};

const QuizSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(quizQuestions.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<{
    result_page_title: string;
    result_html_content: string;
    comparative_statement: string;
    strategicMaturityPercent: number;
    kompetensgapPercent: number;
  } | null>(null);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const submitQuiz = async (answers: string[]) => {
    const answersObject: Record<string, number> = {};
    const totalScore = answers.reduce((sum, answerId, index) => {
      const option = quizQuestions[index].options.find(opt => opt.id === answerId);
      const score = option?.points || 0;
      if (quizQuestions[index].type !== 'categorization') {
         answersObject[`question${index + 1}`] = score;
      }
      return sum + score;
    }, 0);

    const payload = {
      answers: answersObject,
      totalScore,
      maxScore: quizQuestions.length * 3,
      timestamp: new Date().toISOString(),
      quiz_version: '1.0',
    };

    try {
      const response = await fetch(MANUS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-API-KEY': 'ed5aed3cdd2410758637cc8a50e26fbb4402bead81885f55a933331228fb5f1'
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

  const submitWithRetry = async (answers: string[], maxRetries = 2) => {
    let retries = 0;

    while (retries <= maxRetries) {
      try {
        if (retries > 0) {
          console.log(`Försöker igen... (${retries}/${maxRetries})`);
        }
        return await submitQuiz(answers);
      } catch (error) {
        retries++;

        if (retries > maxRetries) {
          throw error;
        }

        await delay(1000 * retries);
      }
    }
    console.log('Max retries reached, returning default results');
    return defaultResults;
  };

  const handleAnswer = async (optionId: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionId;
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const results = await submitWithRetry(newAnswers);
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

  const getResultIcon = () => {
    if (!quizResults) return null;

    switch (quizResults.result_page_title.toLowerCase()) {
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
              currentStep={currentQuestion + 1}
              totalSteps={quizQuestions.length}
            />

            <h3 className="text-xl font-semibold mb-6">
              {quizQuestions[currentQuestion].question}
            </h3>

            <div className="space-y-4">
              {quizQuestions[currentQuestion].options.map((option) => (
                <QuizOption
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  isSelected={answers[currentQuestion] === option.id}
                  onSelect={() => !isSubmitting && handleAnswer(option.id)}
                />
              ))}
            </div>
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
              Din AI-fitness nivå: {quizResults.result_page_title}
            </h2>

            <div className="quiz-body-html-content mb-8" dangerouslySetInnerHTML={{ __html: quizResults.result_html_content }} />

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="quiz-percentile">
                {quizResults.comparative_statement}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

              <div className="quiz-metric-card">
                <div className="flex justify-center mb-4">
                  <Users className="w-8 h-8 text-deep-purple" />
                </div>
                <h6 className="text-[23px] font-medium mb-4">Kompetensgap</h6>
                <div className="text-[3.75rem] font-bold text-deep-purple mb-4 py-4">
                  {quizResults.kompetensgapPercent}%
                </div>
                <p className="quiz-body-text">Skillnaden mellan nuvarande kompetens och vad som krävs för nästa nivå</p>
              </div>
            </div>

            <Button
              onClick={() => document.getElementById('competition-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="purple"
              className="bg-beach-purple text-white"
            >
              Tävla om en AI-workshop
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizSection;