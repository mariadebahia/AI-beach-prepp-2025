import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#ff6b6b] pt-8 pb-20 px-8">
      <div className="max-w-[860px] mx-auto text-center">
        <AnimatedSection animation="fade-down">
          <img 
            src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/3AImigos_logo_hand.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZkNTI0NzJhLTk5YzgtNDQ2Yy05ZTM3LTczMTVkYjJjYzQ4MiJ9.eyJ1cmwiOiJpbWFnZS8zQUltaWdvc19sb2dvX2hhbmQucG5nIiwiaWF0IjoxNzQ2NTU4NTE2LCJleHAiOjE3NzgwOTQ1MTZ9.KPMF6SXJR_5Jon9Kps4S59PyWn6hJyRP8o0cDcMmIeI"
            alt="3AImigos Logo - Hand with three fingers"
            className="w-16 md:w-24 h-16 md:h-24 mx-auto mb-8 md:mb-12 hover:scale-110 transition-transform duration-300"
          />
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200">
          <break></break>
          <h1 className="font-['Bricolage_Grotesque'] text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold mb-4 md:mb-6 text-center">
            Fixa AI-formen till beach 2025!
          </h1>
          <h5 className="text-xl md:text-2xl lg:text-[2rem] leading-relaxed mb-8 md:mb-12 text-center">
            Tävla om en skräddarsydd AI-workout för ditt team – kör igång innan Almedalen!
          </h5>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="300">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="purple" 
              className="bg-beach-purple text-white text-lg md:text-[1.5rem]"
              onClick={() => document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tävla och vinn en<br />AI-workout för jobbet
            </Button>
            <Button 
              variant="outline" 
              className="border-beach-purple text-beach-purple text-lg md:text-[1.5rem]"
              onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Testa jobbets<br />AI-fitnessnivå
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;