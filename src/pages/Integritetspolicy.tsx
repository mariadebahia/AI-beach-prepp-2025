import React from 'react';

const Integritetspolicy: React.FC = () => {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Integritetspolicy för AI Beach Prep</h1>
      <p className="mb-4"><strong>Senast uppdaterad:</strong> 16 maj 2025</p>

      <p className="mb-6">
        Denna integritetspolicy beskriver hur Tres AImigos ("vi", "oss" eller "vår")
        samlar in, använder, lagrar och skyddar dina personuppgifter när du besöker
        vår webbplats <a href="https://aibeachprep.se" className="text-beach-purple hover:text-opacity-80 underline">https://aibeachprep.se</a> eller
        deltar i vår tävling.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Vilka personuppgifter vi samlar in</h2>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>Namn och kontaktuppgifter (e-post, telefon)</li>
        <li>Företagsnamn och roll</li>
        <li>Motivering för tävlingsdeltagande</li>
        <li>Svar på AI-mognadstestet</li>
        <li>Teknisk information (IP-adress, webbläsardata)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Hur vi använder dina uppgifter</h2>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>Administrera tävlingen och utse vinnare</li>
        <li>Skicka relevant information om AI-träning</li>
        <li>Analysera och förbättra våra tjänster</li>
        <li>Uppfylla rättsliga skyldigheter</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Lagring och säkerhet</h2>
      <p className="mb-6">
        Vi lagrar dina uppgifter säkert inom EU/EES och behåller dem endast så länge som
        det är nödvändigt för de syften som anges i denna policy eller enligt lag.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Dina rättigheter</h2>
      <p className="mb-6">
        Du har rätt att:
      </p>
      <ul className="list-disc list-inside mb-6 space-y-2">
        <li>Få tillgång till dina personuppgifter</li>
        <li>Begära rättelse av felaktiga uppgifter</li>
        <li>Begära radering av uppgifter</li>
        <li>Invända mot viss behandling</li>
        <li>Begära dataportabilitet</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Kontakta oss</h2>
      <p className="mb-6">
        För frågor om dataskydd eller för att utöva dina rättigheter, kontakta oss på:{' '}
        <a href="mailto:lostresAImigos@gmail.com" className="text-beach-purple hover:text-opacity-80 underline">
          lostresAImigos@gmail.com
        </a>
      </p>

      <p className="text-sm text-gray-600 mt-12">
        Denna integritetspolicy kan komma att uppdateras. Vi meddelar om väsentliga
        förändringar via vår webbplats.
      </p>
    </main>
  );
};

export default Integritetspolicy;