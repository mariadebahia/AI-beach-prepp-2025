import React, { useState } from 'react';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions } from '../utils/quizData';
import Button from '../components/Button';
import { Share2, ArrowUp, Users, TrendingUp, Brain } from 'lucide-react';

interface QuizResults {
  level: string;
  description: string;
  recommendations: string[];
  strategicMaturityPercent: number;
  kompetensgapPercent: number;
  growthPotentialPercent: number;
  aiReadinessPercent: number;
  comparative_statement: string;
}

const QuizSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptionSelect = async (questionId: number, points: number) => {
    const newAnswers = { ...answers, [questionId]: points };
    setAnswers(newAnswers);
    
    if (currentQuestion === 9) {
      const totalScore = Object.values(newAnswers).reduce((sum, p) => sum + p, 0);
      
      try {
        const requestBody = {
          answers: newAnswers,
          totalScore,
          maxScore: 30,
          quiz_version: '1.0',
          timestamp: new Date().toISOString()
        };

        console.log('Submitting quiz with data:', requestBody);

        const response = await fetch('/.netlify/functions/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const responseText = await response.text();
        console.log('Server response:', responseText);

        if (!responseText.trim()) {
          throw new Error('Server returned an empty response');
        }

        let parsedResponse;
        try {
          parsedResponse = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Server returned invalid JSON response');
        }

        if (!response.ok) {
          const errorMessage = parsedResponse?.error || 'Failed to submit quiz';
          throw new Error(`Quiz submission failed: ${errorMessage}`);
        }

        if (!parsedResponse.success) {
          throw new Error(parsedResponse.error || 'Quiz submission failed');
        }

        setQuizResults(parsedResponse);
        setShowResults(true);
        setError(null);
      } catch (error) {
        console.error('Error submitting quiz:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setCurrentQuestion(9);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Beach Prepp 2025',
        text: 'Kolla in min AI-fitnessnivå! Testa din också:',
        url: window.location.href
      }).catch(console.error);
    }
  };

  const currentQ = quizQuestions[currentQuestion];

  if (showResults && quizResults) {
    return (
      <section className="bg-beach-mint py-12 sm:py-16 md:py-20 px-4 sm:px-8" id="quiz-section">
        <div className="max-w-[1024px] mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="font-outfit font-thin text-[35px] mb-4">
                Din AI-fitness nivå:
              </h2>
              <h3 className="font-permanent-marker text-5xl sm:text-6xl text-beach-purple mb-6">
                {quizResults.level}
              </h3>
              <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                {quizResults.description}
              </p>
            </div>

            <div className="bg-[#dafef1] px-6 py-4 rounded-lg mb-12 text-center">
              <p className="text-beach-purple text-lg sm:text-xl font-medium">
                {quizResults.comparative_statement}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6">
                <ArrowUp className="w-8 h-8 text-beach-purple mb-4" />
                <h4 className="text-lg font-semibold mb-2">AI-strategisk mognad</h4>
                <p className="text-4xl font-bold text-beach-purple mb-4">
                  {quizResults.strategicMaturityPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Bedömning av hur väl AI är integrerad i företagets övergripande strategi
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Users className="w-8 h-8 text-beach-purple mb-4" />
                <h4 className="text-lg font-semibold mb-2">Kompetensgap</h4>
                <p className="text-4xl font-bold text-beach-purple mb-4">
                  {quizResults.kompetensgapPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Skillnaden mellan nuvarande kompetens och vad som krävs för nästa nivå
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <TrendingUp className="w-8 h-8 text-beach-purple mb-4" />
                <h4 className="text-lg font-semibold mb-2">AI-Tillväxtpotential</h4>
                <p className="text-4xl font-bold text-beach-purple mb-4">
                  {quizResults.growthPotentialPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Hur mycket företaget kan växa via AI-adoption
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Brain className="w-8 h-8 text-beach-purple mb-4" />
                <h4 className="text-lg font-semibold mb-2">AI-Readiness</h4>
                <p className="text-4xl font-bold text-beach-purple mb-4">
                  {quizResults.aiReadinessPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Hur väl rustat företaget är för att implementera AI-lösningar
                </p>
              </div>
            </div>

            <div className="bg-[#3B1360] py-4 px-6 -mx-6 sm:-mx-8 md:-mx-12">
              <h3 className="text-white text-2xl font-semibold text-center">
                Resultatnivåer och rekommendationer
              </h3>
            </div>

            <div className="mt-8 space-y-4">
              {quizResults.recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg text-gray-700">{rec}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button
                variant="purple"
                onClick={() => window.location.href = '#competition-section'}
                className="w-full sm:w-auto"
              >
                Vinn en AI-workout
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <Share2 size={20} />
                Dela till chef/kollega
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-beach-purple py-12 sm:py-16 md:py-20 px-4 sm:px-8" id="quiz-section">
      <div className="max-w-[1024px] mx-auto text-center text-white">
        <AnimatedSection animation="fade-down">
          <h2 className="text-[2.5em] sm:text-[3.75em] md:text-[3.75em] font-permanent-marker mb-6 sm:mb-8 text-[#dafef1] leading-[1.6]">
            Hur är det med AI-formen egentligen? Gör vårt AI-fitnessnivå!
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12">
            Nyfiken på hur redo din organisation faktiskt är för AI-revolutionen? Vårt lättsamma men träffsäkra test avslöjar både dolda styrkor och utvecklingsområden med vetenskaplig precision – och du får direkta rekommendationer anpassade för just er mognadsnivå.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-left">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>{error}</p>
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(0)}
                  className="mt-4"
                >
                  Försök igen
                </Button>
              </div>
            )}
            
            <ProgressBar 
              currentStep={currentQuestion + 1} 
              totalSteps={10} 
            />
            
            <h3 className="text-beach-purple text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              {currentQ.question}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {currentQ.options?.map((option) => (
                <QuizOption
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  isSelected={answers[currentQ.id] === option.points}
                  onSelect={() => handleOptionSelect(currentQ.id, option.points || 0)}
                  name={`question-${currentQ.id}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QuizSection;