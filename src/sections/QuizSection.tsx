import React, { useState } from 'react';
import Button from '../components/Button';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import AnimatedSection from '../components/AnimatedSection';
import { quizQuestions, getQuizResult } from '../utils/quizData';
import type { QuizQuestion } from '../types';

interface Answer {
  questionId: string | number;
  answer: string;
  points?: number;
}

const QuizSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [quizStarted, setQuizStarted] = useState(false);

  const handleOptionSelect = (optionId: string, points?: number) => {
    setSelectedOption(optionId);
    const currentQ = quizQuestions[currentQuestion];
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === currentQ.id);
      
      const answer = {
        questionId: currentQ.id,
        answer: optionId,
        points: points
      };
      
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = answer;
      } else {
        newAnswers.push(answer);
      }
      
      return newAnswers;
    });
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextAnswer(e.target.value);
    const currentQ = quizQuestions[currentQuestion];
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === currentQ.id);
      
      const answer = {
        questionId: currentQ.id,
        answer: e.target.value
      };
      
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = answer;
      } else {
        newAnswers.push(answer);
      }
      
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption('');
      setTextAnswer('');
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    const numericAnswers: Record<string, number> = {};
    let totalScore = 0;
    
    answers.forEach(answer => {
      if (answer.points !== undefined) {
        numericAnswers[answer.questionId] = answer.points;
        totalScore += answer.points;
      }
    });

    const industry = answers.find(a => a.questionId === 'industry')?.answer || '';
    const companySize = answers.find(a => a.questionId === 'companySize')?.answer || '';
    const strangeQ = answers.find(a => a.questionId === 'strangeAIQuestion')?.answer || '';

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: numericAnswers,
          totalScore,
          maxScore: 30,
          industry,
          companySize,
          strangeAIQuestion: strangeQ,
          quiz_version: '1.0',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      console.log('Quiz submitted successfully:', result);
      setShowResults(true);

    } catch (error) {
      console.error('Error submitting quiz:', error);
      // Handle error appropriately
    }
  };

  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options?.map(option => (
              <QuizOption
                key={option.id}
                id={option.id}
                text={option.text}
                isSelected={selectedOption === option.id}
                onSelect={() => handleOptionSelect(option.id, option.points)}
                name={`question-${question.id}`}
              />
            ))}
          </div>
        );
      
      case 'dropdown':
        return (
          <select
            value={selectedOption}
            onChange={(e) => handleOptionSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Välj ett alternativ</option>
            {question.options?.map(option => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        );
      
      case 'text':
        return (
          <input
            type="text"
            value={textAnswer}
            onChange={handleTextInput}
            placeholder={question.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      
      default:
        return null;
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const canProceed = selectedOption || textAnswer;

  if (!quizStarted) {
    return (
      <section className="py-20 px-8 bg-white" id="quiz-section">
        <div className="max-w-[860px] mx-auto text-center">
          <h2 className="font-['Bricolage_Grotesque'] text-[4rem] font-black mb-6 leading-[1.4]">
            Testa er AI-fitness!
          </h2>
          <p className="text-2xl mb-12">
            Få koll på er AI-mognad med vårt snabba quiz och få skräddarsydda rekommendationer.
          </p>
          <Button 
            variant="purple"
            onClick={() => setQuizStarted(true)}
          >
            Starta Quiz
          </Button>
        </div>
      </section>
    );
  }

  if (showResults) {
    const totalScore = answers.reduce((sum, answer) => sum + (answer.points || 0), 0);
    const result = getQuizResult(totalScore);
    
    return (
      <section className="py-20 px-8 bg-white">
        <div className="max-w-[860px] mx-auto">
          <h2 className="quiz-result-heading text-center">
            Din AI-fitness nivå: {result.level}
          </h2>
          
          <p className="quiz-body-text mb-12 text-center">
            {result.description}
          </p>
          
          <div className="metrics-container">
            <div className="quiz-metric-card flex-1">
              <h3 className="quiz-metric-heading">Strategisk mognad</h3>
              <p className="quiz-metric-value">{Math.round((totalScore / 30) * 100)}%</p>
            </div>
            
            <div className="quiz-metric-card flex-1">
              <h3 className="quiz-metric-heading">Kompetensgap</h3>
              <p className="quiz-metric-value">{Math.round(100 - ((totalScore / 30) * 100))}%</p>
            </div>
            
            <div className="quiz-metric-card flex-1">
              <h3 className="quiz-metric-heading">AI-readiness</h3>
              <p className="quiz-metric-value">{Math.round((totalScore / 30) * 100)}%</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-10 rounded-lg mb-12">
            <h3 className="text-2xl font-semibold mb-6">Rekommendationer för att förbättra er AI-fitness:</h3>
            <ul className="quiz-recommendations list-disc pl-6">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
          
          <div className="better-than-section text-center">
            <p className="quiz-percentile mb-12">
              Du ligger bättre till än {Math.floor(Math.random()*30)+60}% av alla som tagit testet!
            </p>
            
            <Button 
              variant="purple"
              onClick={() => window.location.href = '#competition-section'}
            >
              Tävla om en AI-workout för jobbet
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-8 bg-white">
      <div className="max-w-[860px] mx-auto">
        <ProgressBar 
          currentStep={currentQuestion + 1} 
          totalSteps={quizQuestions.length} 
        />
        
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-6">{currentQ.question}</h3>
          {renderQuestion(currentQ)}
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          variant="purple"
        >
          {isLastQuestion ? 'Se resultat' : 'Nästa fråga'}
        </Button>
      </div>
    </section>
  );
};

export default QuizSection;
export { QuizSection };