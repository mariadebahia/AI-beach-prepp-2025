import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeroSection from './sections/HeroSection';
import CompetitionSection from './sections/CompetitionSection';
import QuizSection from './sections/QuizSection';
import Footer from './components/Footer';
import Integritetspolicy from './pages/Integritetspolicy';
import './styles/text-mask.css';

function App() {
  useEffect(() => {
    document.title = 'Vinn en AI-workout till jobbet!';
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-[#ffffff]">
            <HeroSection />
            <CompetitionSection />
            <QuizSection />
            <Footer />
          </div>
        } />
        <Route path="/integritetspolicy" element={<Integritetspolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;