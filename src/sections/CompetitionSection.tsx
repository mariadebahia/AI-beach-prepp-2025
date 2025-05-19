import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import FormCompetition from '../components/FormCompetition';
import { Trophy, Rocket, Users } from 'lucide-react';

const CompetitionSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 md:py-32 px-4 bg-white" id="competition-section">
      <div className="w-full sm:max-w-[720px] lg:max-w-[1020px] mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="relative bg-beach-mint rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <a 
              href="#quiz-section"
              className="absolute -top-3 right-4 sm:right-6 z-10 bg-[#201258] text-white px-4 sm:px-5 py-2.5 rounded-full font-permanent-marker text-lg sm:text-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer whitespace-nowrap pulse-animation"
            >
              Testa jobbets AI-nivå
            </a>
            
            <div className="mb-6 sm:mb-8 md:mb-12 text-center">
              <h2 className="text-[1.875em] sm:text-[2.5em] md:text-[3.125em] font-outfit font-extrabold leading-tight mb-4 sm:mb-6 mt-5 pt-5">
                AI-FOMO på jobbet?! Vi hjälper er att komma i bättre AI-form till semestern.
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-roboto font-bold">
                Vi kommer till din arbetsplats och AI-boostar teamet med grunderna, verktyg och tips för att 
                komma igång med AI till sommaren. På så sätt är ni bättre redo för hösten. Vi kallar det AI-beach prepp men en svindyr managementkonsult skulle nog kalla det för "get-AI-ready-or-die". Dessutom, alla som anmäler sig får vårt AI-fitness program för att börja komma igång på egen hand.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <Users className="w-6 h-6 text-beach-purple" />
                </div>
                <h3 className="font-special-elite font-bold text-base sm:text-lg md:text-xl mb-2">Anmäl ditt företag</h3>
                <p className="text-base sm:text-lg md:text-xl font-roboto font-bold">Berätta varför ni vill bli AI-fit - vi vill höra er story.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <Trophy className="w-6 h-6 text-beach-purple" />
                </div>
                <h3 className="font-special-elite font-bold text-base sm:text-lg md:text-xl mb-2">En vinnare varje vecka</h3>
                <p className="text-base sm:text-lg md:text-xl font-roboto font-bold">Juryn väljer ett företag i veckan fram till vecka 27.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <Rocket className="w-6 h-6 text-beach-purple" />
                </div>
                <h3 className="font-special-elite font-bold text-base sm:text-lg md:text-xl mb-2">Vi kommer till er!</h3>
                <p className="text-base sm:text-lg md:text-xl font-roboto font-bold">Och kör en anpassad AI-workshop.</p>
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