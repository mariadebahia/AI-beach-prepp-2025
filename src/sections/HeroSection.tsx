import React from 'react';
import AnimatedSection from '../components/AnimatedSection';

const HeroSection: React.FC = () => {
  const logoUrl = "https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/3AImigos_logo_hand.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZkNTI0NzJhLTk5YzgtNDQ2Yy05ZTM3LTczMTVkYjJjYzQ4MiJ9.eyJ1cmwiOiJpbWFnZS8zQUltaWdvc19sb2dvX2hhbmQucG5nIiwiaWF0IjoxNzQ2NTU4NTE2LCJleHAiOjE3NzgwOTQ1MTZ9.KPMF6SXJR_5Jon9Kps4S59PyWn6hJyRP8o0cDcMmIeI";

  return (
    <section className="relative bg-white pt-6 sm:pt-8 md:pt-12 pb-8 sm:pb-12 md:pb-16 px-4">
      <div className="w-full sm:max-w-[720px] lg:max-w-[1020px] mx-auto flex flex-col items-center">
        <AnimatedSection animation="fade-down">
          <div className="flex items-center gap-2 mb-4 sm:mb-6 md:mb-8">
            <img 
              src={logoUrl}
              alt="3AImigos Logo - Hand with three fingers"
              className="h-[150px] w-auto"
            />
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200" className="text-center">
          <h1 className="font-special-elite text-[3.5em] sm:text-[4em] md:text-[5em] leading-snug sm:leading-tight md:leading-tight mb-4 sm:mb-6 md:mb-8 max-w-[24ch] mx-auto">
            Vinn en AI-workout till jobbet!
          </h1>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HeroSection;