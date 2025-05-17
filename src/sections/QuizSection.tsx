import React, { useState } from 'react';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions, getQuizResult } from '../utils/quizData';

const QuizSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = async (questionId: number, points: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: points }));
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const totalScore = Object.values(answers).reduce((sum, points) => sum + points, 0) + points;
      const result = getQuizResult(totalScore);
      
      try {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: { ...answers, [questionId]: points },
            totalScore,
            maxScore: quizQuestions.length * 3,
            timestamp: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit quiz');
        }
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
      
      setShowResults(true);
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const totalScore = Object.values(answers).reduce((sum, points) => sum + points, 0);
  const result = getQuizResult(totalScore);

  return (
    <section className="bg-beach-purple py-40 px-4" id="quiz-section">
      <div className="max-w-[1024px] mx-auto text-center text-white">
        <AnimatedSection animation="fade-down">
          <h2 className="text-[3.125em] font-permanent-marker text-[#dafef1] mb-8 leading-tight">
            Hur är det med AI-formen egentligen? Gör vårt AI-fitnessnivå!
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
              </>
            ) : (
              <div className="text-beach-purple">
                <h3 className="text-4xl font-bold mb-6">{result.level}</h3>
                <p className="text-xl mb-6">{result.description}</p>
                <div className="space-y-4">
                  <h4 className="text-2xl font-semibold">Rekommendationer:</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-lg">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default QuizSection;