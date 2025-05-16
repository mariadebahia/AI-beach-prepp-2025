import React from 'react';
import Button from '../components/Button';

const Integritetspolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[860px] mx-auto px-4 py-16">
        <Button
          as="a"
          href="/"
          variant="outline-purple"
          className="mb-8 inline-flex"
        >
          ← Tillbaka
        </Button>

        <h1 className="text-4xl font-bold mb-8">Integritetspolicy</h1>

        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Insamling av information</h2>
          <p className="mb-4">
            Vi samlar in information från dig när du fyller i formulär på vår webbplats. 
            Den information som samlas in kan inkludera:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Företagsnamn</li>
            <li>Kontaktpersonens namn</li>
            <li>E-postadress</li>
            <li>Telefonnummer</li>
            <li>Svar på quiz och undersökningar</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Användning av information</h2>
          <p className="mb-4">
            Informationen vi samlar in används för att:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Kontakta dig angående tävlingar och erbjudanden</li>
            <li>Förbättra vår webbplats och tjänster</li>
            <li>Skicka relevant information och uppdateringar</li>
            <li>Analysera användning och förbättra användarupplevelsen</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Skydd av information</h2>
          <p className="mb-4">
            Vi implementerar olika säkerhetsåtgärder för att skydda din personliga information. 
            All data lagras säkert och behandlas i enlighet med GDPR.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies</h2>
          <p className="mb-4">
            Vi använder cookies för att förbättra din upplevelse på vår webbplats. 
            Du kan välja att stänga av cookies i din webbläsare, men detta kan påverka 
            webbplatsens funktionalitet.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Delning av information</h2>
          <p className="mb-4">
            Vi säljer, handlar eller överför inte på annat sätt din personligt identifierbara 
            information till utomstående parter. Detta inkluderar inte betrodd tredje part som 
            hjälper oss att driva vår webbplats eller vårt företag, så länge dessa parter går 
            med på att hålla denna information konfidentiell.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Dina rättigheter</h2>
          <p className="mb-4">
            Du har rätt att:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Få tillgång till din personliga information</li>
            <li>Korrigera felaktig information</li>
            <li>Begära radering av din information</li>
            <li>Invända mot behandling av din information</li>
            <li>Begära begränsning av hur vi använder din information</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Kontakta oss</h2>
          <p className="mb-4">
            Om du har frågor om denna integritetspolicy kan du kontakta oss på:
          </p>
          <p className="mb-4">
            E-post: <a href="mailto:lostresAImigos@gmail.com" className="text-blue-600 hover:underline">
              lostresAImigos@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Integritetspolicy;