import React from 'react';
import Button from '../components/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-beach-yellow pt-8 pb-20 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <img 
          src="https://gbnzjpuohpidutbwadbu.supabase.co/storage/v1/object/sign/image/3AImigos_logo_hand.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2ZkNTI0NzJhLTk5YzgtNDQ2Yy05ZTM3LTczMTVkYjJjYzQ4MiJ9.eyJ1cmwiOiJpbWFnZS8zQUltaWdvc19sb2dvX2hhbmQucG5nIiwiaWF0IjoxNzQ2NTU4NTE2LCJleHAiOjE3NzgwOTQ1MTZ9.KPMF6SXJR_5Jon9Kps4S59PyWn6hJyRP8o0cDcMmIeI"
          alt="3AImigos Logo - Hand with three fingers"
          className="w-24 h-24 mx-auto mb-12 hover:scale-110 transition-transform duration-300"
        />
        
        <h1 className="font-['Bricolage_Grotesque'] font-black mb-6">
          Fixa AI-formen till<br />beach 2025!
        </h1>
        <h5 className="text-[2rem] leading-relaxed mb-12">
          Tävla och vinn en skräddarsydd AI-workout för ditt jobb innan midsommar!
        </h5>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="purple" 
            className="bg-beach-purple text-white text-[1.25rem]"
            onClick={() => document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Tävla och vinn en<br />AI-workout för jobbet
          </Button>
          <Button 
            variant="outline" 
            className="border-beach-purple text-beach-purple text-[1.25rem]"
            onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Testa jobbets<br />AI-fitnessnivå
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;