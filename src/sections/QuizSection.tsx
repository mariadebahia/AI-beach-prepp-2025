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
    
    if (currentQuestion === quizQuestions.length - 1) {
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

        const response = await fetch('/.netlify/functions/quiz', {
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
        setCurrentQuestion(quizQuestions.length - 1);
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
      <section className="bg-beach-purple py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8" id="quiz-section">
        <div className="w-full max-w-[1020px] mx-auto">
         <h2 className="text-[50px] sm:text-[60px] md:text-[70px] font-permanent-marker text-white text-center py-12">
      </h2>
        
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12">
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
              <div className="bg-white rounded-lg p-6">
                <ArrowUp className="w-8 h-8 text-beach-purple mb-4" />
                <h4 className="text-lg font-semibold mb-2">AI-strategisk mognad</h4>
                <p className="text-4xl font-bold text-beach-purple mb-4">
                  {quizResults.strategicMaturityPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Bedömning av hur väl AI är integrerad i företagets övergripande strategi
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <Users className="w-8 h-8 text-beach-purple mb-4" />
                <h4 className="text-lg font-semibold mb-2">Kompetensgap</h4>
                <p className="text-4xl font-bold text-beach-purple mb-4">
                  {quizResults.kompetensgapPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Skillnaden mellan nuvarande kompetens och vad som krävs för nästa nivå
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <TrendingUp className="w-8 h-8 text-beach-purple mb-4" />
                <h4 className="text-lg font-semibold mb-2">AI-Tillväxtpotential</h4>
                <p className="text-4xl font-bold text-beach-purple mb-4">
                  {quizResults.growthPotentialPercent}%
                </p>
                <p className="text-sm text-gray-600">
                  Hur mycket företaget kan växa via AI-adoption
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
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

            <h2 className="text-2xl font-bold mb-4">Rekommendationer:</h2>

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
              
              <a
                href={getEmailShareUrl()}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-beach-purple text-beach-purple hover:bg-beach-purple hover:text-white transition-colors duration-300 rounded-lg font-medium w-full sm:w-auto"
              >
                <Mail size={20} />
                Dela med chefen/kollega
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Add bounds checking for quizQuestions array
  if (!quizQuestions || currentQuestion >= quizQuestions.length) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error: Quiz questions not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-beach-purple">
      <h2 className="text-[50px] font-permanent-marker text-white text-center py-12">
      </h2>
      
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8" id="quiz-section">
        <div className="w-full max-w-[1020px] mx-auto text-center text-white">
          <AnimatedSection animation="fade-down">
            <h2 className="text-white text-[50px] font-permanent-marker mb-6 sm:mb-8 leading-[1.1]">
              Hur är det med AI-formen på jobbet egentligen? Gör vårt AI-fitnessnivå!
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 font-roboto font-bold text-white">
              Nyfiken på hur redo din organisation faktiskt är för AI-revolutionen? Vårt lättsamma AI-adoption test ger dig en indiaktion på er AI-nivå m.m. Du får dessutom några träffsäkra rekommendationer anpassade för just er mognadsnivå. Bäst av allt - det tar bara 2 min!
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay="200">
            <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 text-left">
              <h3 className="text-xl lg:text-2xl font-semibold text-center mb-4 text-beach-purple">
                Fråga {currentQuestion + 1} av {quizQuestions.length}
              </h3>
              
              <ProgressBar 
                currentStep={currentQuestion + 1} 
                totalSteps={quizQuestions.length} 
              />
              
              <div className="mt-8">
                <h3 className="text-beach-purple text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6">
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
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default QuizSection;