// src/sections/QuizSection.tsx
import React, { useState, ChangeEvent } from 'react'
import { quizQuestions } from '../utils/quizData'
import QuizOption from '../components/QuizOption'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import AnimatedSection from '../components/AnimatedSection'
import { Dumbbell, Brain, Rocket, TrendingUp, Users, Check } from 'lucide-react'

const QUIZ_ENDPOINT = '/api/quiz'

interface ApiQuizResult {
  level: string
  description: string
  recommendations: string[]
  comparative_statement?: string
  strategicMaturityPercent?: number
  kompetensgapPercent?: number
  aiReadinessPercent?: number
  industry_comparative_statement?: string
  result_page_title?: string
}

type AllAnswers = Record<string, string>

const defaultResults: Partial<ApiQuizResult> = {
  level: 'Nyfiken',
  description: 'Du har tagit dina första steg in i AI-världen och visar stor potential!',
  recommendations: [
    'Börja med att identifiera enkla AI-användningsfall',
    'Utbilda teamet i grundläggande AI-koncept',
    'Experimentera med färdiga AI-verktyg',
  ],
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!',
}

const QuizSection: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AllAnswers>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quizResults, setQuizResults] = useState<ApiQuizResult | null>(null)

  const currentQuestion =
    quizQuestions[currentQuestionIndex] || null

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const submitQuiz = async (allAnswers: AllAnswers) => {
    // build numeric answers
    let totalScore = 0
    const numericAnswers: Record<string, number> = {}

    quizQuestions.forEach((q) => {
      const key = q.id.toString()
      const answer = allAnswers[key]
      const opt = (q.options ?? []).find((o) => o.id === answer)
      const pts = opt?.points ?? 0
      numericAnswers[key] = pts
      totalScore += pts
    })

    const maxScore = quizQuestions.reduce((sum, q) => {
      const best = Math.max(...(q.options ?? []).map((o) => o.points ?? 0), 0)
      return sum + best
    }, 0)

    const payload = {
      answers: numericAnswers,
      totalScore,
      maxScore,
      timestamp: new Date().toISOString(),
      quiz_version: '1.0',
    }

    const res = await fetch(QUIZ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit',
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
    }

    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      return (await res.json()) as ApiQuizResult
    } else {
      console.warn('Non-JSON response, falling back to defaults')
      return defaultResults as ApiQuizResult
    }
  }

  const submitWithRetry = async (ans: AllAnswers, retries = 2) => {
    for (let i = 0; i <= retries; i++) {
      try {
        if (i > 0) console.log(`Retry #${i}`)
        return await submitQuiz(ans)
      } catch (e) {
        if (i === retries) throw e
        await delay(1000 * i)
      }
    }
    return defaultResults as ApiQuizResult
  }

  const handleOptionSelect = (optId: string) => {
    if (isSubmitting) return
    const newA = { ...answers, [currentQuestion!.id.toString()]: optId }
    setAnswers(newA)

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
    } else {
      submitAll(newA)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (isSubmitting) return
    setAnswers({ ...answers, [currentQuestion!.id.toString()]: e.target.value })
  }

  const handleNext = () => {
    if (!currentQuestion) return
    const key = currentQuestion.id.toString()
    if (!answers[key]) {
      setError('Vänligen välj ett svar eller fyll i fältet.')
      return
    }
    setError(null)
    if (currentQuestionIndex === quizQuestions.length - 1) {
      submitAll(answers)
    } else {
      setCurrentQuestionIndex((i) => i + 1)
    }
  }

  const submitAll = async (ans: AllAnswers) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitWithRetry(ans)
      setQuizResults(result)
      setShowResults(true)
    } catch (e: any) {
      console.error('Failed to submit quiz', e)
      setError(`Ett fel uppstod: ${e.message}`)
      setQuizResults(defaultResults as ApiQuizResult)
      setShowResults(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getResultIcon = () => {
    if (!quizResults) return null
    switch (quizResults.level.toLowerCase()) {
      case 'pappskalle':
        return <Dumbbell className="w-16 h-16 mx-auto mb-4 text-red-500" />
      case 'nyfiken':
        return <Brain className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
      case 'beach ready':
        return <Rocket className="w-16 h-16 mx-auto mb-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <section className="py-32 px-8 bg-[#d8d355]" id="quiz-section">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection animation="fade-up">
          <h2 className="h2-quiz-outline mb-8">
            Hur är det med AI-formen? Ta vårt AI-fitnesstest!
          </h2>
        </AnimatedSection>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!showResults ? (
          <AnimatedSection animation="fade-up" delay="200">
            <div className="bg-white p-8 rounded shadow">
              <ProgressBar
                currentStep={currentQuestionIndex + 1}
                totalSteps={quizQuestions.length}
              />

              {currentQuestion?.type === 'multiple-choice' ? (
                <div className="space-y-4 mt-6">
                  <h3 className="text-xl font-semibold mb-4">
                    {currentQuestion.question}
                  </h3>
                  {(currentQuestion.options ?? []).map((opt) => (
                    <QuizOption
                      key={opt.id}
                      id={`q${currentQuestion.id}-o${opt.id}`}
                      name={`q${currentQuestion.id}`}
                      text={opt.text}
                      isSelected={
                        answers[currentQuestion.id.toString()] === opt.id
                      }
                      onSelect={() => handleOptionSelect(opt.id)}
                    />
                  ))}
                  <div className="mt-6">
                    <Button
                      onClick={handleNext}
                      disabled={
                        isSubmitting ||
                        !answers[currentQuestion.id.toString()]
                      }
                    >
                      {currentQuestionIndex < quizQuestions.length - 1
                        ? 'Nästa fråga'
                        : 'Skicka svar'}
                    </Button>
                  </div>
                </div>
              ) : currentQuestion?.type === 'dropdown' ? (
                <div className="mt-6">
                  <select
                    value={answers[currentQuestion.id.toString()] || ''}
                    onChange={handleChange}
                    className="w-full p-3 border rounded"
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Välj…
                    </option>
                    {(currentQuestion.options ?? []).map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.text}
                      </option>
                    ))}
                  </select>
                  <div className="mt-6">
                    <Button
                      onClick={handleNext}
                      disabled={
                        isSubmitting ||
                        !answers[currentQuestion.id.toString()]
                      }
                    >
                      {currentQuestionIndex < quizQuestions.length - 1
                        ? 'Nästa fråga'
                        : 'Skicka svar'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <input
                    type="text"
                    value={answers[currentQuestion.id.toString()] || ''}
                    onChange={handleChange}
                    placeholder="Skriv ditt svar…"
                    className="w-full p-3 border rounded"
                    disabled={isSubmitting}
                  />
                  <div className="mt-6">
                    <Button
                      onClick={handleNext}
                      disabled={
                        isSubmitting ||
                        !answers[currentQuestion.id.toString()]
                      }
                    >
                      {currentQuestionIndex < quizQuestions.length - 1
                        ? 'Nästa fråga'
                        : 'Skicka svar'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection animation="fade-up" delay="200">
            <div className="bg-white p-8 rounded shadow text-center">
              {getResultIcon()}

              <h2 className="text-4xl font-bold mb-4">
                Din AI-fitness nivå: {quizResults.level}
              </h2>
              <p className="text-xl mb-6">{quizResults.description}</p>

              <ul className="space-y-3 mb-6">
                {quizResults.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={20} className="text-green-500" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              {quizResults.comparative_statement && (
                <div className="bg-gray-50 p-4 rounded mb-6">
                  {quizResults.comparative_statement}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizResults.strategicMaturityPercent !== undefined && (
                  <div className="p-4 border rounded">
                    <TrendingUp className="mx-auto mb-2" />
                    <h6>AI-strategisk mognad</h6>
                    <p className="text-3xl font-bold">
                      {quizResults.strategicMaturityPercent}%
                    </p>
                  </div>
                )}
                {quizResults.kompetensgapPercent !== undefined && (
                  <div className="p-4 border rounded">
                    <Users className="mx-auto mb-2" />
                    <h6>Kompetensgap</h6>
                    <p className="text-3xl font-bold">
                      {quizResults.kompetensgapPercent}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  )
}

export default QuizSection
