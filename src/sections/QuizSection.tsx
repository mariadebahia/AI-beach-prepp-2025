// src/sections/QuizSection.tsx
import React, { useState } from 'react';
import { quizQuestions } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Dumbbell, Brain, Rocket, TrendingUp, Users, Check } from 'lucide-react';

const QUIZ_ENDPOINT = '/api/quiz';

interface AllAnswers {
  [questionId: string]: string;
}

interface ExtendedQuizResult {
  level?: string;
  result_page_title?: string;
  description?: string;
  recommendations?: string[];
  comparative_statement?: string;
  industry_comparative_statement?: string;
  strategicMaturityPercent?: number;
  kompetensgapPercent?: number;
}

const defaultResults: ExtendedQuizResult = {
  level: 'Nyfiken',
  result_page_title: 'Nyfiken',
  description: 'Du har tagit dina första steg in i AI-världen och visar stor potential!',
  recommendations: [
    'Börja med att identifiera enkla AI-användningsfall',
    'Utbilda teamet i grundläggande AI-koncept',
    'Experimentera med färdiga AI-verktyg',
  ],
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!',
  strategicMaturityPercent: 75,
  kompetensgapPercent: 60,
};

const calculateKompetensgapPercent = (answers: AllAnswers): number => {
  const ids = [1, 3, 5, 7, 9];
  let total = 0;
  const max = ids.length * 3;
  ids.forEach((id) => {
    const key = id.toString();
    const ans = answers[key];
    const q = quizQuestions.find((q) => q.id === id);
    const opt = q?.options?.find((o) => o.id === ans);
    if (opt?.points) total += opt.points;
  });
  return Math.round((total / max) * 100);
};

const calculateStrategicMaturityPercent = (answers: AllAnswers): number => {
  const ids = [2, 4, 6, 8, 10];
  let total = 0;
  const max = ids.length * 3;
  ids.forEach((id) => {
    const key = id.toString();
    const ans = answers[key];
    const q = quizQuestions.find((q) => q.id === id);
    const opt = q?.options?.find((o) => o.id === ans);
    if (opt?.points) total += opt.points;
  });
  return Math.round((total / max) * 100);
};

const QuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AllAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ExtendedQuizResult | null>(null);

  const current = quizQuestions[currentIndex];
  const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const submitAll = async (all: AllAnswers) => {
    setIsSubmitting(true);
    setError(null);

    // Build numeric answers and total
    let total = 0;
    const numericAnswers: Record<string, number> = {};
    quizQuestions.forEach((q) => {
      const key = q.id.toString();
      const sel = all[key] || '';
      const opt = q.options?.find((o) => o.id === sel);
      const pts = opt?.points ?? 0;
      numericAnswers[key] = pts;
      total += pts;
    });
    const maxScore = quizQuestions.reduce(
      (sum, q) => sum + Math.max(...(q.options?.map((o) => o.points ?? 0) || [0])),
      0
    );

    const payload = {
      answers: numericAnswers,
      totalScore: total,
      maxScore,
      timestamp: new Date().toISOString(),
      quiz_version: '1.2',
    };

    const trySubmit = async (retries = 2): Promise<ExtendedQuizResult> => {
      for (let i = 0; i <= retries; i++) {
        try {
          const resp = await fetch(QUIZ_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!resp.ok) throw new Error(await resp.text());
          const ct = resp.headers.get('content-type') ?? '';
          const data = ct.includes('application/json')
            ? await resp.json()
            : defaultResults;
          return {
            ...data,
            kompetensgapPercent: calculateKompetensgapPercent(all),
            strategicMaturityPercent: calculateStrategicMaturityPercent(all),
          };
        } catch (e) {
          if (i === retries) throw e;
          await delay(1000 * (i + 1));
        }
      }
      return defaultResults;
    };

    try {
      const r = await trySubmit();
      setResults(r);
      setShowResults(true);
    } catch (e: any) {
      setError(`Det gick inte att skicka dina svar. ${e.message || e}`);
      setResults(defaultResults);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const next = () => {
    setError(null);
    if (!answers[current.id.toString()]) {
      setError('Vänligen välj ett svar.');
      return;
    }
    if (currentIndex === quizQuestions.length - 1) {
      submitAll(answers);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const Icon = () => {
    const lvl = (results?.level || results?.result_page_title || '').toLowerCase();
    if (lvl === 'pappskalle') return <Dumbbell className="w-16 h-16 mx-auto mb-6 text-red-500" />;
    if (lvl === 'nyfiken') return <Brain className="w-16 h-16 mx-auto mb-6 text-yellow-500" />;
    if (lvl === 'beach ready') return <Rocket className="w-16 h-16 mx-auto mb-6 text-green-500" />;
    return null;
  };

  return (
    <section id="quiz-section" className="py-32 px-8 bg-[#d8d355]">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection animation="fade-up">
          <h2 className="h2-quiz-outline mb-8">
            Hur är det med AI-formen? Ta vårt AI-fitnesstest!
          </h2>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <h5 className="text-lg mb-8">
            Vårt AI-fitnesstest är inte bara kul – det mäter er strategiska AI-mognad
            <br />
            och visar på eventuellt kompetensgap samt levererar tre konkreta rekommendationer.
          </h5>
        </AnimatedSection>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

        {!showResults && (
          <AnimatedSection animation="fade-up" delay="300">
            <div className="bg-white p-8 rounded shadow">
              <ProgressBar
                currentStep={currentIndex + 1}
                totalSteps={quizQuestions.length}
              />
              <h3 className="text-xl font-semibold mt-6 mb-4">{current.question}</h3>
              {current.options?.map((opt) => (
                <QuizOption
                  key={opt.id}
                  id={`q${current.id}-o${opt.id}`}
                  name={`q${current.id}`}
                  text={opt.text}
                  isSelected={answers[current.id.toString()] === opt.id}
                  onSelect={() => {
                    if (!isSubmitting) {
                      setAnswers((a) => ({
                        ...a,
                        [current.id.toString()]: opt.id,
                      }));
                    }
                  }}
                />
              ))}
              <div className="mt-6">
                <Button onClick={next} disabled={isSubmitting} className="w-full">
                  {currentIndex < quizQuestions.length - 1
                    ? 'Nästa fråga'
                    : 'Skicka svar'}
                </Button>
              </div>
            </div>
          </AnimatedSection>
        )}

        {showResults && results && (
          <AnimatedSection animation="fade-up" delay="300">
            <div className="bg-white p-8 rounded shadow text-center">
              <Icon />
              <h2 className="text-5xl font-bold mb-4">
                Din AI-fitness nivå: {results.level || results.result_page_title}
              </h2>
              {results.description && <p className="mb-6 font-bold">{results.description}</p>}
              {results.recommendations && (
                <ul className="list-disc list-inside mb-6">
                  {results.recommendations.map((r, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="text-green-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              )}
              {results.comparative_statement && (
                <div className="bg-gray-50 p-4 rounded mb-4">
                  {results.comparative_statement}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {typeof results.strategicMaturityPercent === 'number' && (
                  <div className="p-4 border rounded">
                    <TrendingUp className="w-6 h-6 mb-2 text-deep-purple" />
                    <h6 className="font-medium">AI strategisk mognad</h6>
                    <div className="text-3xl font-bold">
                      {results.strategicMaturityPercent}%
                    </div>
                  </div>
                )}
                {typeof results.kompetensgapPercent === 'number' && (
                  <div className="p-4 border rounded">
                    <Users className="w-6 h-6 mb-2 text-deep-purple" />
                    <h6 className="font-medium">Kompetensgap</h6>
                    <div className="text-3xl font-bold">
                      {results.kompetensgapPercent}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default QuizSection;