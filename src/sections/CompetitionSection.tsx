import React from 'react';
import FormCompetition from '../components/FormCompetition.tsx';

const CompetitionSection: React.FC = () => {
  return (
    <section className="relative bg-white py-16 px-4">
      <div className="max-w-[1024px] mx-auto">
        <div className="relative bg-beach-mint rounded-2xl p-8 md:p-12">
          {/* Sticky label */}
          <div className="absolute -top-4 right-4 bg-beach-purple text-white px-4 py-2 rounded-full">
            Testa jobbets AI-nivå
          </div>

          {/* Main content */}
          <h1 className="text-[3em] font-outfit font-extrabold text-center mb-8 leading-tight">
           FASTNAT I EN AI-FOMO LOOP PÅ JOBBET?! LUGN, VI HJÄLPER ER ATT
            KOMMA IGÅNG!
          </h1>

          <div className="space-y-4 mb-12">
            <h7 className="text-[16px] font-roboto block">Vi kommer till din arbetsplats och AI-boostar teamet med grunderna, verktyg och tips för att komma i AI-form till sommaren (så att ni är redo för hösten). Vi kallar det AI-beach prepp men en svindyr managementkonsult skulle nog kalla det för "get-AI-ready-or-die". Alla som anmäler sig får vårt AI-fitness program för att börja komma igång på egen hand.</h7>
          </div>

          {/* Feature boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border-2 border-dashed border-beach-purple rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2">Anmäl ditt företag</h3>
              <p>Berätta varför ni vill bli AI-fit - vi vill höra er story.</p>
            </div>
            <div className="border-2 border-dashed border-beach-purple rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2">En vinnare varje vecka</h3>
              <p>Juryn väljer ett företag i veckan fram till vecka 27.</p>
            </div>
            <div className="border-2 border-dashed border-beach-purple rounded-lg p-6 text-center">
              <h3 className="font-semibold mb-2">Vi kommer till er!</h3>
              <p>Och kör en anpassad AI-workshop.</p>
            </div>
          </div>

          <FormCompetition />
        </div>
      </div>
    </section>
  );
};

export default CompetitionSection;