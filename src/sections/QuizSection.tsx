import React, { useState } from 'react';
import Button from '../components/Button';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions } from '../utils/quizData';

const QuizSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (questionId: string | number, points: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: points
    }));
  };

  const currentQ = quizQuestions[currentQuestion];

  return (
    <section className="bg-beach-purple py-30 my-15 px-4" id="quiz-section">
      <div className="max-w-[1024px] mx-auto text-center text-white">
        <AnimatedSection animation="fade-down">
          <h2 className="text-[3.125em] font-permanent-marker text-[#dafef1] mb-8 leading-tight">
            Hur är det med AI-formen
            egentligen? Gör vårt AI-
            fitnessnivå!
          </h2>
          
          <p className="text-xl mb-12">
            Kör vårt 2-minuters quiz och kolla vilket AI-nivå ni är på idag:
            Pappskalle, Nyfiken Nybörjare eller Beach Ready?
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay="200">
          <div className="bg-white rounded-2xl p-12 text-left">
            {!showResults ? (
              <>
                <ProgressBar 
                  currentStep={currentQuestion + 1} 
                  totalSteps={quizQuestions.length} 
                />
                
                <h3 className="text-beach-purple text-2xl font-semibold mb-6">
                  Fråga {currentQuestion + 1}: {currentQ.question}
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

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    className="text-beach-purple border-beach-purple"
                    disabled={currentQuestion === 0}
                  >
                    Föregående
                  </Button>
                  
                  <Button
                    variant="purple"
                    onClick={() => {
                      if (currentQuestion < quizQuestions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                      } else {
                        setShowResults(true);
                      }
                    }}
                    disabled={!answers[currentQ.id]}
                  >
                    {currentQuestion === quizQuestions.length - 1 ? 'Se resultat' : 'Nästa fråga'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-beach-purple">
                <h3 className="text-3xl font-bold mb-6">Ditt resultat är klart!</h3>
                {/* Results content here */}
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QuizSection;