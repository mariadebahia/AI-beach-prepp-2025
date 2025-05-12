import React, { useState, ChangeEvent } from 'react';
import { quizQuestions, QuizQuestion, QuizResult } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Dumbbell, Brain, Rocket, TrendingUp, Users } from 'lucide-react';

const QUIZ_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw1f5yDQn3MQ3V365yhEf5CSexzlzn9XEybUs16iLwkXSg4_xi6yOgKd5FvUtggvt4/exec';

const calculateKompetensgapPercent = (answers: Record<string | number, string>): number => {
  const kompetensQuestions = [1, 3, 5, 7, 9]; // Questions related to competency
  let totalPoints = 0;
  let maxPoints = kompetensQuestions.length * 3; // Max 3 points per question

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
  const strategicQuestions = [2, 4, 6, 8, 10]; // Questions related to strategic maturity
  let totalPoints = 0;
  let maxPoints = strategicQuestions.length * 3; // Max 3 points per question

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
  kompetensgapPercent: 60
};

interface AllAnswers {
  [questionId: string | number]: string;
}

interface ExtendedQuizResult extends QuizResult {
    comparative_statement?: string;
    industry_comparative_statement?: string;
    strategicMaturityPercent?: number;
    kompetensgapPercent?: number;
    result_page_title?: string;
}

const QuizSection: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AllAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<ExtendedQuizResult | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const currentQuestion = quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length
    ? quizQuestions[currentQuestionIndex]
    : null;

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const submitQuiz = async (allAnswers: AllAnswers) => {
    let totalPoints = 0;
    const payloadAnswers: Record<string | number, string | number> = {};

    quizQuestions.forEach(question => {
      const answerValue = allAnswers[question.id];

      if (answerValue !== undefined && answerValue !== null) {
        if (question.type === 'multiple-choice') {
          const selectedOption = question.options?.find(opt => opt.id === answerValue);
          if (selectedOption && selectedOption.points !== undefined) {
            totalPoints += selectedOption.points;
            payloadAnswers[question.id] = selectedOption.points;
          } else {
            payloadAnswers[question.id] = 0;
          }
        } else {
          payloadAnswers[question.id] = answerValue;
        }
      } else {
        payloadAnswers[question.id] = '';
      }
    });

    const localKompetensgapPercent = calculateKompetensgapPercent(allAnswers);
    const localStrategicMaturityPercent = calculateStrategicMaturityPercent(allAnswers);

    const payload = {
      answers: payloadAnswers,
      totalScore: totalPoints,
      maxScore: quizQuestions
        .filter(q => q.type === 'multiple-choice')
        .reduce((sum, q) => sum + Math.max(...(q.options?.map(opt => opt.points || 0) || [0])), 0),
      timestamp: new Date().toISOString(),
      quiz_version: '1.2',
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
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let apiResults;
      
      if (contentType && contentType.includes('application/json')) {
        apiResults = await response.json();
      } else {
        console.log('Response was not JSON, using default results');
        apiResults = defaultResults;
      }

      // Combine API results with local calculations
      const enhancedResults = {
        ...apiResults,
        kompetensgapPercent: localKompetensgapPercent,
        strategicMaturityPercent: localStrategicMaturityPercent
      };

      // Save results to localStorage for debugging
      localStorage.setItem('lastQuizResult', JSON.stringify({
        timestamp: new Date().toISOString(),
        answers: allAnswers,
        calculatedResults: {
          kompetensgapPercent: localKompetensgapPercent,
          strategicMaturityPercent: localStrategicMaturityPercent
        },
        backendResults: apiResults
      }));

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
    console.log('Max retries reached, returning default results');
    return defaultResults;
  };

  const handleOptionSelect = (optionId: string) => {
     if (isSubmitting) return;

     const newAnswers = { ...answers, [currentQuestion!.id]: optionId };
     setAnswers(newAnswers);

     if (currentQuestion!.id === 'industry') {
         setSelectedIndustry(optionId);
     }

     if (currentQuestion!.type === 'multiple-choice' && currentQuestionIndex < quizQuestions.length - 1) {
       setCurrentQuestionIndex(prevIndex => prevIndex + 1);
     } else if (currentQuestion!.type === 'multiple-choice' && currentQuestionIndex === quizQuestions.length - 1) {
        submitAllAnswers(newAnswers);
     }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     if (isSubmitting) return;

     const newAnswers = { ...answers, [currentQuestion!.id]: event.target.value };
     setAnswers(newAnswers);

     if (currentQuestion!.id === 'industry') {
         setSelectedIndustry(event.target.value);
     }
  };

  const handleNextQuestion = () => {
      if (!currentQuestion || !answers[currentQuestion.id]) {
          setError("Vänligen välj ett svar eller fyll i fältet.");
          return;
      }
      setError(null);

      if (currentQuestionIndex === quizQuestions.length - 1) {
          submitAllAnswers(answers);
      } else {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
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

  const getResultIcon = () => {
    if (!quizResults) return null;

    const levelKey = (quizResults.level || quizResults.result_page_title)?.toLowerCase();

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
          <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
            Hur är det med AI-formen? Ta vårt AI-fitnesstest!
          </h2>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <h5 className="text-[1.4375rem] leading-relaxed mb-8 text-center">
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
                totalSteps={quizQuestions.length}
              />

              {currentQuestion && (
                <>
                  <h3 className="text-xl font-semibold mb-6">
                    {currentQuestion.question}
                  </h3>

                  {currentQuestion.type === 'multiple-choice' && Array.isArray(currentQuestion.options) && (
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

                  {currentQuestion.type === 'dropdown' && Array.isArray(currentQuestion.options) && (
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

                  {(currentQuestion.type !== 'multiple-choice' || currentQuestionIndex === quizQuestions.length - 1) && (
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
          </AnimatedSection>
        ) : quizResults && (
          <AnimatedSection animation="fade-up" delay="300">
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl text-center">
              {getResultIcon()}

              <h2
                style={{
                  fontFamily: 'Gloock, serif',
                  fontWeight: 400
                }}
                className="text-[3.75rem] mb-8 text-center leading-[1.2]"
              >
                Din AI-fitness nivå: {quizResults.level || quizResults.result_page_title}
              </h2>

              {quizResults.description && (
                  <p className="quiz-body-text mb-6">{quizResults.description}</p>
              )}
              {quizResults.recommendations && quizResults.recommendations.length > 0 && (
                   <div className="level-recommendations mt-8">
                       <h6 className="text-[23px] font-medium mb-4">Rekommendationer för din nivå:</h6>
                       <ul className="quiz-recommendations">
                           {quizResults.recommendations.map((rec, index) => (
                               <li key={index} className="flex items-center justify-center gap-3 mb-4">
                                   <span className="text-center leading-snug">{rec}</span>
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

               {quizResults.industry_comparative_statement && quizResults.industry_comparative_statement.trim() !== '' && (
                   <div className="bg-gray-50 rounded-lg p-6 mb-8">
                       <p className="quiz-percentile">
                           {quizResults.industry_comparative_statement}
                       </p>
                   </div>
               )}

               {((quizResults.strategicMaturityPercent !== undefined && quizResults.strategicMaturityPercent !== 0) ||
                 (quizResults.kompetensgapPercent !== undefined && quizResults.kompetensgapPercent !== 0)) && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                     {quizResults.strategicMaturityPercent !== undefined && quizResults.strategicMaturityPercent !== 0 && (
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

                     {quizResults.kompetensgapPercent !== undefined && quizResults.kompetensgapPercent !== 0 && (
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
                   </div>
               )}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default QuizSection;