import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import { Hand } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#ff6b6b] pt-8 pb-20 px-8">
      <div className="max-w-[860px] mx-auto text-center">
        <AnimatedSection animation="fade-down">
          <div className="flex items-center justify-center gap-2 mb-12">
            <Hand className="w-8 h-8" />
            <span className="font-bricolage text-2xl">Tres AImigos</span>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200">
          <h1 className="font-['Bricolage_Grotesque'] font-extrabold mb-6 text-center">
            Vinn en AI-workout till jobbet!
          </h1>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="300">
          <Button 
            variant="purple" 
            className="bg-beach-purple text-white text-[1.5rem]"
            onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Testa jobbets AI-nivå
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;