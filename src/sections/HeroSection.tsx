import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Hand } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white pt-16 sm:pt-28 pb-5 px-4 sm:px-8">
      <div className="max-w-[1024px] mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="flex items-center gap-2 mb-8 sm:mb-12">
            <Hand className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="font-special-elite text-xl sm:text-2xl">Tres AImigos</span>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200">
          <h1 className="font-special-elite text-2xl sm:text-[2.5rem] md:text-[3.4375em] leading-tight sm:leading-[1.2] mb-8 sm:mb-16">
            Vinn en AI-workout till jobbet!
          </h1>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;