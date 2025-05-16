import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './sections/HeroSection';
import IntroSection from './sections/IntroSection';
import QuizSection from './sections/QuizSection';
import Footer from './components/Footer';
import Integritetspolicy from './pages/Integritetspolicy';
import './styles/text-mask.css';

function App() {
  useEffect(() => {
    document.title = 'Fixa AI-formen till beach 2025!';
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/integritetspolicy" element={<Integritetspolicy />} />
        <Route path="/" element={
          <div className="min-h-screen bg-[#ffffff]">
            <HeroSection />
            <IntroSection />
            <QuizSection id="quiz-section" />
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;