import React, { useState } from 'react';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions, getQuizResult } from '../utils/quizData';
import Button from '../components/Button';
import { Share2 } from 'lucide-react';

interface QuizResults {
  level: string;
  description: string;
  recommendations: string[];
  strategicMaturityPercent: number;
  kompetensgapPercent: number;
  aiReadinessPercent: number;
}

const QuizSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

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
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit quiz');
        }

        const results = await response.json();
        setQuizResults(results);
        setShowResults(true);
      } catch (error) {
        console.error('Error submitting quiz:', error);
        // Still show results even if submission fails
        setShowResults(true);
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
            <h3 className="text-4xl font-bold mb-8 text-beach-purple">
              {quizResults.level}
            </h3>
            
            <p className="text-xl mb-12">{quizResults.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-beach-mint rounded-xl p-8 text-center">
                <h4 className="text-2xl font-semibold mb-4">Strategisk mognad</h4>
                <p className="text-5xl font-bold text-beach-purple mb-2">
                  {quizResults.strategicMaturityPercent}%
                </p>
              </div>
              
              <div className="bg-beach-mint rounded-xl p-8 text-center">
                <h4 className="text-2xl font-semibold mb-4">Kompetensgap</h4>
                <p className="text-5xl font-bold text-beach-purple mb-2">
                  {quizResults.kompetensgapPercent}%
                </p>
              </div>
            </div>
            
            <div className="mb-12">
              <h4 className="text-2xl font-semibold mb-4">Rekommendationer</h4>
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
            Nyfiken på hur redo din organisation faktiskt är för AI-revolutionen? Vårt lättsamma och träffsäkra test avslöjar både dolda styrkor och utvecklingsområden med vetenskaplig precision – och du får direkta rekommendationer anpassade för just er mognadsnivå.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <div className="bg-white rounded-2xl p-12 text-left">
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