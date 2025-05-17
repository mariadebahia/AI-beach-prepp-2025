import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import FormCompetition from '../components/FormCompetition';

const CompetitionSection: React.FC = () => {
  return (
    <section className="py-44 px-8 bg-white" id="competition-section">
      <div className="max-w-[1024px] mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="relative bg-beach-mint rounded-3xl p-12">
            <a 
              href="#quiz-section"
              className="absolute -top-3 right-6 z-10 bg-[#201258] text-white px-6 py-2.5 rounded-full font-permanent-marker text-[1.125rem] transform hover:scale-105 transition-transform duration-300 cursor-pointer whitespace-nowrap"
            >
              Testa jobbets AI-nivå
            </a>
            
            <div className="mb-12 text-center">
              <h2 className="text-[3.4375em] font-outfit font-extrabold leading-tight mb-8">
                AI-FOMO PÅ JOBBET?!<br />
                LUGN, VI HJÄLPER ER ATT<br />
                KOMMA IGÅNG!
              </h2>
              
              <p className="text-[18px]">
                Vi kommer till din arbetsplats och AI-boostar teamet med grunderna, verktyg och tips för att 
                komma i AI-form till sommaren (så att ni är redo för hösten). Vi kallar det AI-beach prepp men en svindyr managementkonsult skulle nog kalla det för "get-AI-ready-or-die". Alla som anmäler sig får vårt AI-fitness program för att börja komma igång på egen hand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
                <h3 className="font-merriweather font-extrabold text-[1.125em] mb-4">Anmäl ditt företag</h3>
                <p>Berätta varför ni vill bli AI-fit - vi vill höra er story.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
                <h3 className="font-merriweather font-extrabold text-[1.125em] mb-4">En vinnare varje vecka</h3>
                <p>Juryn väljer ett företag i veckan fram till vecka 27.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
                <h3 className="font-merriweather font-extrabold text-[1.125em] mb-4">Vi kommer till er!</h3>
                <p>Och kör en anpassad AI-workshop.</p>
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