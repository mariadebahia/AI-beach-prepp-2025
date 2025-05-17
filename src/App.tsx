import React, { useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import CompetitionSection from './sections/CompetitionSection';
import QuizSection from './sections/QuizSection';
import Footer from './components/Footer';
import './styles/text-mask.css';

function App() {
  useEffect(() => {
    document.title = 'Vinn en AI-workout till jobbet!';
  }, []);

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <HeroSection />
      <CompetitionSection />
      <QuizSection />
      <Footer />
    </div>
  );
}

export default App;