import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Hand } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-white pt-8 pb-20 px-8">
      <div className="max-w-[860px] mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="flex items-center gap-2 mb-12">
            <Hand className="w-8 h-8" />
            <span className="font-special-elite text-2xl">Tres AImigos</span>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200">
          <h1 className="font-special-elite text-[5rem] md:text-[6.25rem] leading-[1.2] mb-16">
            Vinn en AI-workout till jobbet!
          </h1>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;