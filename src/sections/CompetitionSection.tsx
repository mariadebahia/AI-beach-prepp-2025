import React from 'react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import FormCompetition from '../components/FormCompetition';

const CompetitionSection: React.FC = () => {
  return (
    <section className="py-20 px-8 bg-white" id="competition-section">
      <div className="max-w-[1024px] mx-auto">
        <AnimatedSection animation="fade-down">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#dcfce7] rounded-full px-4 py-2 text-beach-purple mb-6">
              Testa jobbets AI-nivå
            </div>
            <h2 className="text-[2.5rem] font-bold text-center mb-8">
              AI-FOMO PÅ JOBBET?! LUGN, VI<br />
              HJÄLPER ER ATT KOMMA IGÅNG!
            </h2>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
              Vi kommer till din arbetsplats och AI-boostar teamet med grunderna,
              verktyg och tips för att komma i AI-form till sommaren (så att ni är redo
              för hösten). Vi kallar det AI-beach prepp men en svindyr management
              konsult skulle nog kalla det för "get-AI-ready-or-die".
              <br /><br />
              Alla som anmäler sig får vårt AI-fitness program för att börja komma
              igång på egen hand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h3 className="font-bold mb-2">Anmäl ditt företag</h3>
              <p className="text-gray-600">Berätta varför ni vill bli AI-fit - vi vill höra er story.</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h3 className="font-bold mb-2">En vinnare varje vecka</h3>
              <p className="text-gray-600">Juryn väljer ett företag i veckan fram till vecka 27.</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h3 className="font-bold mb-2">Vi kommer till er!</h3>
              <p className="text-gray-600">Och kör en anpassad AI-workshop.</p>
            </div>
          </div>
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