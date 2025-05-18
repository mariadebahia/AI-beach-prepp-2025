import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Hand } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-8">
      <div className="max-w-[1024px] mx-auto flex flex-col items-center">
        <AnimatedSection animation="fade-down">
          <div className="flex items-center gap-2 mb-6 sm:mb-8 md:mb-12">
            <Hand className="w-6 h-6 sm:w-8 sm:h-8 text-beach-purple" />
            <span className="font-special-elite text-lg sm:text-xl md:text-2xl">Tres AImigos</span>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200" className="text-center">
          <h1 className="font-special-elite text-[2rem] sm:text-[2.75rem] md:text-[3.75rem] leading-[1.2] mb-6 sm:mb-8 md:mb-12 max-w-[18ch] mx-auto">
            Vinn en AI-workout till jobbet!
          </h1>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;