import React, { useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import IntroSection from './sections/IntroSection';
import QuizSection from './sections/QuizSection';
import Footer from './components/Footer';
import './styles/text-mask.css';

function App() {
  useEffect(() => {
    document.title = 'Fixa AI-formen till beach 2025!';
  }, []);

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <HeroSection />
      <IntroSection />
      <QuizSection id="quiz-section" />
      <Footer />
    </div>
  );
}

export default App;