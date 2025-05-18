import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import FormCompetition from '../components/FormCompetition';
import { Trophy, Rocket, Users } from 'lucide-react';

const CompetitionSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 md:py-44 px-4 sm:px-8 bg-white" id="competition-section">
      <div className="max-w-[1024px] mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="relative bg-beach-mint rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
            <a 
              href="#quiz-section"
              className="absolute -top-3 right-4 sm:right-6 z-10 bg-[#201258] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-permanent-marker text-base sm:text-[1.125rem] transform hover:scale-105 transition-transform duration-300 cursor-pointer whitespace-nowrap"
            >
              Testa jobbets AI-nivå
            </a>
            
            <div className="mb-8 sm:mb-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-[3.4375em] font-outfit font-extrabold leading-tight mb-6 sm:mb-8">
                AI-FOMO PÅ JOBBET?! VI HJÄLPER ER ATT KOMMA I AI-FORM INNAN SOMMAREN!
              </h2>
              
              <p className="text-base sm:text-[1.125em] max-w-3xl mx-auto">
                Vi kommer till din arbetsplats och AI-boostar teamet med grunderna, verktyg och tips för att 
                komma i AI-form till sommaren (så att ni är redo för hösten). Vi kallar det AI-beach prepp men en svindyr managementkonsult skulle nog kalla det för "get-AI-ready-or-die". Alla som anmäler sig får vårt AI-fitness program för att börja komma igång på egen hand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-beach-purple" />
                </div>
                <h3 className="font-special-elite font-bold text-base sm:text-[1.125em] mb-2 sm:mb-4">Anmäl ditt företag</h3>
                <p className="text-sm sm:text-base">Berätta varför ni vill bli AI-fit - vi vill höra er story.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-beach-purple" />
                </div>
                <h3 className="font-special-elite font-bold text-base sm:text-[1.125em] mb-2 sm:mb-4">En vinnare varje vecka</h3>
                <p className="text-sm sm:text-base">Juryn väljer ett företag i veckan fram till vecka 27.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-beach-purple" />
                </div>
                <h3 className="font-special-elite font-bold text-base sm:text-[1.125em] mb-2 sm:mb-4">Vi kommer till er!</h3>
                <p className="text-sm sm:text-base">Och kör en anpassad AI-workshop.</p>
              </div>
            </div>

            <FormCompetition />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CompetitionSection;