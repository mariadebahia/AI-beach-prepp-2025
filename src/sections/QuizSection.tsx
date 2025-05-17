import React, { useState } from 'react';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions } from '../utils/quizData';
import Button from '../components/Button';
import { Share2, ArrowUp, Users } from 'lucide-react';

interface QuizResults {
  level: string;
  description: string;
  recommendations: string[];
  strategicMaturityPercent: number;
  kompetensgapPercent: number;
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

        const results = await response.json();
        
        if (!results.success) {
          throw new Error(results.error || 'Quiz submission failed');
        }

        setQuizResults(results);
        setShowResults(true);
        setError(null);
      } catch (error) {
        console.error('Error submitting quiz:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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
      <section className="bg-white py-20 px-4" id="quiz-section">
        <div className="max-w-[1024px] mx-auto">
          <div className="text-center">
            <h2 className="font-playfair text-6xl mb-4">
              Din AI-fitness nivå:<br />
              <span className="text-beach-purple">{quizResults.level}</span>
            </h2>
            
            <p className="text-xl mb-12 text-gray-700 max-w-3xl mx-auto">
              {quizResults.description}
            </p>

            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Rekommendationer för din nivå:</h3>
              <ul className="space-y-4 text-left max-w-2xl mx-auto">
                {quizResults.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start text-lg text-gray-700">
                    <span className="text-beach-purple mr-4">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-beach-purple text-white py-6 px-8 rounded-xl mb-16 text-2xl font-semibold">
              {quizResults.comparative_statement}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <ArrowUp className="w-8 h-8 text-beach-purple mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">AI strategisk mognad</h4>
                <p className="text-5xl font-bold text-beach-purple mb-4">
                  {quizResults.strategicMaturityPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Bedömning av hur väl AI är integrerad i företagets övergripande strategi
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <Users className="w-8 h-8 text-beach-purple mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Kompetensgap</h4>
                <p className="text-5xl font-bold text-beach-purple mb-4">
                  {quizResults.kompetensgapPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Skillnaden mellan nuvarande och önskad AI-kompetens i organisationen
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="purple"
                onClick={() => window.location.href = '#competition-section'}
                className="text-lg"
              >
                Vinn en AI-workout
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex items-center gap-2 text-lg"
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
    <section className="bg-beach-purple py-20 px-4" id="quiz-section">
      <div className="max-w-[1024px] mx-auto text-center text-white">
        <AnimatedSection animation="fade-down">
          <h2 className="text-4xl font-permanent-marker mb-8">
            Hur är det med AI-formen egentligen? Gör vårt AI-fitnessnivå!
          </h2>
          
          <p className="text-xl mb-12">
            Nyfiken på hur redo din organisation faktiskt är för AI-revolutionen? 
            Vårt lättsamma och träffsäkra test avslöjar både dolda styrkor och 
            utvecklingsområden – och du får direkta rekommendationer anpassade för just er mognadsnivå.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <div className="bg-white rounded-2xl p-8 text-left">
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