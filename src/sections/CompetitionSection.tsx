import React, { useState } from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import FormCompetition from '../components/FormCompetition';
import { Trophy } from 'lucide-react';

const CompetitionSection: React.FC = () => {
  return (
    <section className="py-20 px-8 bg-white" id="competition-section">
      <div className="max-w-[1024px] mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Trophy className="text-beach-purple" size={32} />
            <h2 className="font-special-elite text-[2.5em] text-beach-purple">
              Vinn en AI-workout!
            </h2>
          </div>
          
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Tävla om en personlig AI-träningssession för dig och ditt team. Vi hjälper er att 
            hitta de bästa sätten att implementera AI i just er verksamhet.
          </p>
        </AnimatedSection>
        
        <AnimatedSection animation="fade-up" delay="200">
          <div className="bg-beach-mint p-8 rounded-xl">
            <FormCompetition />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CompetitionSection;