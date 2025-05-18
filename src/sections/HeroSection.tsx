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

        <AnimatedSection animation="fade-up" delay="300" className="w-full max-w-2xl">
          <div className="relative bg-beach-mint rounded-2xl p-6 sm:p-8 md:p-12 text-center">
            <h2 className="font-merriweather text-xl sm:text-2xl md:text-[2.5rem] font-black leading-tight mb-4 sm:mb-6 tracking-tight">
              AI-FOMO PÅ JOBBET?! VI HJÄLPER ER ATT KOMMA I AI-FORM INNAN SOMMAREN!
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-700">
              Vi kommer till din arbetsplats och AI-boostar teamet med grunderna, verktyg och tips för att komma i AI-form till sommaren.
            </p>

            <a 
              href="#quiz-section"
              className="inline-block bg-[#201258] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-special-elite text-base sm:text-lg transform hover:scale-105 transition-transform duration-300"
            >
              Testa jobbets AI-nivå
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;