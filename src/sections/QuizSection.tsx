import React, { useState } from 'react';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions } from '../utils/quizData';
import Button from '../components/Button';
import { Share2, ArrowUp, Users, TrendingUp, Zap } from 'lucide-react';

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
        const response = await fetch('/.netlify/functions/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: newAnswers,
            totalScore,
            maxScore: 30,
            quiz_version: '1.0',
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          // First try to get error message from response
          const errorText = await response.text();
          let errorMessage = 'Failed to submit quiz';
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          
          throw new Error(errorMessage);
        }

        const responseText = await response.text();
        
        if (!responseText) {
          throw new Error('Empty response received from server');
        }

        const results = JSON.parse(responseText);
        
        if (!results.success) {
          throw new Error(results.error || 'Quiz submission failed');
        }

        setQuizResults(results);
        setShowResults(true);
        setError(null);
      } catch (error) {
        console.error('Error submitting quiz:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        // Don't show results if there was an error
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
      <section className="bg-beach-purple py-40 px-4" id="quiz-section">
        <div className="max-w-[1024px] mx-auto">
          <div className="bg-white rounded-2xl p-12">
            <h2 className="font-merriweather text-5xl font-bold mb-6 text-beach-purple">
              Din AI-fitness nivå: {quizResults.level}
            </h2>
            
            <p className="text-xl mb-12">{quizResults.description}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="bg-beach-mint rounded-xl p-8 text-center">
                <ArrowUp className="w-8 h-8 text-beach-purple mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">AI-strategisk mognad</h4>
                <p className="text-4xl font-bold text-beach-purple mb-2">
                  {quizResults.strategicMaturityPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Bedömning av hur väl AI är integrerad i företagets övergripande strategi
                </p>
              </div>
              
              <div className="bg-beach-mint rounded-xl p-8 text-center">
                <Users className="w-8 h-8 text-beach-purple mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Kompetensgap</h4>
                <p className="text-4xl font-bold text-beach-purple mb-2">
                  {quizResults.kompetensgapPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Skillnaden mellan nuvarande och önskad AI-kompetens i organisationen
                </p>
              </div>
              
              <div className="bg-beach-mint rounded-xl p-8 text-center">
                <TrendingUp className="w-8 h-8 text-beach-purple mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">AI-Tillväxtpotential</h4>
                <p className="text-4xl font-bold text-beach-purple mb-2">
                  {quizResults.growthPotentialPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Potential för framtida AI-utveckling och expansion
                </p>
              </div>
              
              <div className="bg-beach-mint rounded-xl p-8 text-center">
                <Zap className="w-8 h-8 text-beach-purple mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">AI-Readiness</h4>
                <p className="text-4xl font-bold text-beach-purple mb-2">
                  {quizResults.aiReadinessPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Organisationens beredskap för AI-implementation
                </p>
              </div>
            </div>

            <div className="bg-beach-purple text-white p-6 rounded-xl mb-12 text-center">
              <p className="text-xl">{quizResults.comparative_statement}</p>
            </div>
            
            <div className="mb-12">
              <h4 className="text-2xl font-semibold mb-6">Rekommendationer för din nivå:</h4>
              <ul className="space-y-4">
                {quizResults.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-beach-purple mr-4">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="purple"
                onClick={() => window.location.href = '#competition-section'}
              >
                Vinn en AI-workout
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-2"
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
    <section className="bg-beach-purple py-40 px-4" id="quiz-section">
      <div className="max-w-[1024px] mx-auto text-center text-white">
        <AnimatedSection animation="fade-down">
          <h2 className="text-[3.125em] font-permanent-marker text-[#dafef1] mb-8 leading-tight">
            Hur är det med AI-formen egentligen? Gör vårt AI-fitnessnivå!
          </h2>
          
          <p className="text-xl mb-12">
            Nyfiken på hur redo din organisation faktiskt är för AI-revolutionen? Vårt lättsamma och träffsäkra test avslöjar både dolda styrkor och utvecklingsområden med vetenskaplig precision (nåja) – och du får direkta rekommendationer anpassade för just er mognadsnivå.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <div className="bg-white rounded-2xl p-12 text-left">
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
            
            <h3 className="text-beach-purple text-2xl font-semibold mb-6">
              {currentQ.question}
            </h3>

            <div className="space-y-4">
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