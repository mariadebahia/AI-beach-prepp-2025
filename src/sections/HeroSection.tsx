import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Hand } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white pt-6 sm:pt-8 md:pt-12 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-8">
      <div className="max-w-[1024px] mx-auto flex flex-col items-center">
        <AnimatedSection animation="fade-down">
          <div className="flex items-center gap-2 mb-4 sm:mb-6 md:mb-8">
            <Hand className="w-5 h-5 sm:w-6 sm:h-6 text-beach-purple" />
            <span className="font-special-elite text-base sm:text-lg md:text-xl">Tres AImigos</span>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200" className="text-center">
          <h1 className="font-special-elite text-3xl sm:text-4xl md:text-[4.5rem] leading-snug sm:leading-tight md:leading-tight mb-4 sm:mb-6 md:mb-8 max-w-[18ch] mx-auto">
            Vinn en AI-workout till jobbet!
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="purple" 
              onClick={() => document.getElementById('competition-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-base sm:text-lg md:text-xl font-permanent-marker bg-black hover:bg-black/90"
            >
              Tävla och vinn en<br className="hidden sm:block" />AI-workout för jobbet
            </Button>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-base sm:text-lg md:text-xl"
            >
              Testa jobbets<br className="hidden sm:block" />AI-fitnessnivå
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;