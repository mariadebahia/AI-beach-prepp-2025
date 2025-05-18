import React from 'react';
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
          <h1 className="font-special-elite text-[2.5em] sm:text-[3em] md:text-[3.75em] leading-snug sm:leading-tight md:leading-tight mb-4 sm:mb-6 md:mb-8 max-w-[24ch] mx-auto">
            Vinn en AI-workout till jobbet!
          </h1>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;