import React, { useState } from 'react';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions } from '../utils/quizData';
import Button from '../components/Button';
import { Share2, ArrowUp, Users, TrendingUp, Brain, Mail } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = async (questionId: number, points: number) => {
    const newAnswers = { ...answers, [questionId]: points };
    setAnswers(newAnswers);
    
    if (currentQuestion === 9) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      try {
        const requestBody = {
          answers: newAnswers,
          totalScore: Object.values(newAnswers).reduce((sum, p) => sum + p, 0),
          maxScore: 30,
          quiz_version: '1.0',
          timestamp: new Date().toISOString()
        };

        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        const parsedResponse = JSON.parse(responseText);

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
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const getEmailShareUrl = () => {
    if (!quizResults) return '';

    const subject = encodeURIComponent('!! Jag gjorde just ett AI-fittnestest för jobbet. Du kan inte gissa vad det blev...');
    
    const body = encodeURIComponent(
      `Hej,\n\n` +
      `${window.location.hostname} är ${quizResults.comparative_statement} bättre än alla andra som har tagit AI-fitnesstestet och fick AI-nivån ${quizResults.level}.\n` +
      `Den AI-strategiska mognaden är ${quizResults.strategicMaturityPercent}% och kompetensgapet ${quizResults.kompetensgapPercent}%.\n\n` +
      `Här är rekommendationerna att fokusera på:\n` +
      `• ${quizResults.recommendations[0]}\n` +
      `• ${quizResults.recommendations[1]}\n` +
      `• ${quizResults.recommendations[2]}\n` +
      `• ${quizResults.recommendations[3]}\n\n` +
      `Gör testet du också och få reda på tillväxtpotential med AI och hur rustade man är att implementera AI-lösningar. Dessutom kan man vinna en AI-workshop! Bara en sån sak!\n\n` +
      `Gå till: https://aibeachprep.se/`
    );

    return `mailto:?subject=${subject}&body=${body}`;
  };

  if (showResults && quizResults) {
    return (
      <section className="bg-[#482376] py-[35px] sm:py-[45px] md:py-[60px] mt-[25px] mb-[25px] px-4" id="quiz-section">
        <div className="w-full sm:max-w-[720px] lg:max-w-[1020px] mx-auto">
          <h2 className="text-[#dafef1] text-[50px] font-permanent-marker text-center mb-8">
            Hur är det med AI-formen på jobbet egentligen? Gör vårt AI-fitnessnivå!
          </h2>
          {/* Rest of the results section JSX */}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-beach-purple py-[35px] sm:py-[45px] md:py-[60px] mt-[25px] mb-[25px] px-4" id="quiz-section">
      <div className="w-full sm:max-w-[720px] lg:max-w-[1020px] mx-auto text-center text-white">
        <AnimatedSection animation="fade-down">
          <h2 className="text-[50px] font-permanent-marker mb-6 sm:mb-8 text-[#dafef1] leading-[1.6]">
            Hur är det med AI-formen på jobbet egentligen? Gör vårt AI-fitnessnivå!
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 font-roboto font-bold">
            Nyfiken på hur redo din organisation faktiskt är för AI-revolutionen? Vårt lättsamma AI-adoption test ger dig en indiaktion på er AI-nivå m.m. Du får dessutom några träffsäkra rekommendationer anpassade för just er mognadsnivå. Bäst av allt - det tar bara 2 min!
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 text-left">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <p>{error}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    setCurrentQuestion(0);
                  }}
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
              {quizQuestions[currentQuestion].question}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {quizQuestions[currentQuestion].options?.map((option) => (
                <QuizOption
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  isSelected={answers[quizQuestions[currentQuestion].id] === option.points}
                  onSelect={() => handleOptionSelect(quizQuestions[currentQuestion].id, option.points || 0)}
                  name={`question-${quizQuestions[currentQuestion].id}`}
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