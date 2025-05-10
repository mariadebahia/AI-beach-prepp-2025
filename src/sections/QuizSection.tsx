import React, { useState, ChangeEvent } from 'react'; // Importera ChangeEvent för input-hantering
// Korrigerad import: Tog bort QuizOption härifrån
// KONTROLLERA ATT DESSA FILER FINNS MED EXAKT DESSA NAMN OCH SÖKVÄGAR I DIN BOLT-MILJÖ:
// - src/utils/quizData.ts
// - src/components/QuizOption.tsx
// - src/components/ProgressBar.tsx
// - src/components/Button.tsx
import { quizQuestions, QuizQuestion, QuizResult } from '../utils/quizData'; // Importera typerna
import QuizOption from '../components/QuizOption'; // Korrekt import av komponenten
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Dumbbell, Brain, Rocket, TrendingUp, Users } from 'lucide-react';

// Kontrollera att denna URL är den senaste och korrekta från Manus.im
const MANUS_WEBHOOK_URL = 'https://29yhyi3c9q7y.manus.space/quiz_submit'; // Använder den nya URL:en

// Standardresultat om API-anropet misslyssnas eller inte returnerar JSON
// Detta objekt används när API-anropet misslysslas (t.ex. 401-fel)
const defaultResults = {
  result_page_title: 'Nyfiken',
  level: 'Nyfiken', // Lade till 'level' här för att matcha getResultIcon
  description: 'Du har tagit dina första steg in i AI-världen och visar stor potential!', // Använd description istället för result_html_content för att matcha QuizResult typen
  recommendations: [ // Använd recommendations istället för result_html_content för att matcha QuizResult typen
    'Börja med att identifiera enkla AI-användningsfall',
    'Utbilda teamet i grundläggande AI-koncept',
    'Experimentera med färdiga AI-verktyg',
  ],
  // Lägg till fält som saknades i defaultResults för att matcha tidigare resultatdesign
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!', // Allmän jämförelse
  strategicMaturityPercent: 75, // Standardvärde om backend inte skickar
  kompetensgapPercent: 60 // Standardvärde om backend inte skickar
};

// Definiera en typ för att lagra alla svar, inklusive de nya typerna
interface AllAnswers {
  [questionId: string | number]: string; // Svar lagras med frågans ID som nyckel
}

// Uppdatera QuizResult typen för att inkludera fält som defaultResults har
// Om din backend SKA returnera comparative_statement, strategicMaturityPercent, kompetensgapPercent,
// måste dessa läggas till i QuizResult interface i src/utils/quizData.ts också.
interface ExtendedQuizResult extends QuizResult {
    comparative_statement?: string; // Allmän jämförelse
    // NY: Lägg till fält för branschspecifik jämförelse om Manus.im skickar det
    industry_comparative_statement?: string; // T.ex. "Du ligger bättre till än 80% av alla i din bransch!"
    strategicMaturityPercent?: number;
    kompetensgapPercent?: number;
    result_page_title?: string; // Lägg till om backend skickar detta istället för level
}

// NY: Borttagen: Datastruktur för branschspecifika rekommendationer
// Rekommendationer kommer nu från quizResults.recommendations (förväntas vara nivå-baserade från backend)


const QuizSection: React.FC = () => {
  // State för att hantera quiz-flödet
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Använd index
  const [answers, setAnswers] = useState<AllAnswers>({}); // Använd AllAnswers typ
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Använd ExtendedQuizResult för att hantera både API-svar och defaultResults
  const [quizResults, setQuizResults] = useState<ExtendedQuizResult | null>(null);

  // NY: State för att lagra den valda branschen (behövs fortfarande för branschspecifik jämförelse)
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);


  // Hämta aktuell fråga baserat på index
  // Lägg till en defensiv koll om quizQuestions är tom eller index är utanför gränserna
  const currentQuestion = quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length
    ? quizQuestions[currentQuestionIndex]
    : null;


  // Hjälpfunktion för fördröjning (används i återförsökslogiken)
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Funktion för att skicka quiz-svar till backend
  const submitQuiz = async (allAnswers: AllAnswers) => {
    let totalScore = 0;
    // NY: Detta objekt kommer att innehålla frågans ID som nyckel och SVARSVÄRDET (poäng för MC, ID/text för andra) som värde
    const payloadAnswers: Record<string | number, string | number> = {};

    quizQuestions.forEach(question => {
      const answerValue = allAnswers[question.id]; // Hämta det sparade svaret (optionId eller text)

      if (answerValue !== undefined && answerValue !== null) { // Se till att ett svar finns (kontrollera även null/undefined)
        if (question.type === 'multiple-choice') {
          const selectedOption = question.options?.find(opt => opt.id === answerValue);
          if (selectedOption && selectedOption.points !== undefined) {
            totalScore += selectedOption.points; // Lägg till poäng till totalScore
            payloadAnswers[question.id] = selectedOption.points; // NY: Skicka POÄNGEN i payloadAnswers
          } else {
             // Om en MC-fråga besvarats men optionen saknar poäng eller inte hittades, skicka 0 poäng
             payloadAnswers[question.id] = 0;
          }
        } else {
          // För dropdown och text-frågor, skicka själva värdet (optionId eller text-input)
          payloadAnswers[question.id] = answerValue; // NY: Skicka VÄRDET i payloadAnswers
        }
      } else {
          // Om frågan inte besvarades, skicka en tom sträng eller null, beroende på vad backend förväntar sig
          // Skickar en tom sträng om inget svar gavs
          payloadAnswers[question.id] = '';
      }
    });

    // Bygg payload för API-anropet
    const payload = {
      answers: payloadAnswers, // NY: Detta objekt innehåller nu poäng för MC och värden för andra
      totalScore, // totalScore beräknad från MC-frågor
      maxScore: quizQuestions
                         .filter(q => q.type === 'multiple-choice') // Endast poäng från multiple-choice
                         .reduce((sum, q) => sum + Math.max(...(q.options?.map(opt => opt.points || 0) || [0])), 0), // Beräkna max poäng dynamiskt
      timestamp: new Date().toISOString(),
      quiz_version: '1.2', // Uppdatera version om du gör ändringar i payload-strukturen
      // TODO: Lägg till mer metadata i payloaden om det behövs
    };

    console.log("Sending payload:", payload); // Logga payloaden innan inskickning

    try {
      // Utför fetch-anropet till Manus.im webhook
      const response = await fetch(MANUS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Kontrollera API-nyckeln här!
          // Använder den NYA och KORREKTA API-nyckeln från Manus.im
          'X-API-KEY': 'ed5aed3cdd2410758637cc8a50e26f4bb4402bead81885f55a933331228fb5f1' // <-- KORRIGERAD NYCKEL!
        },
        body: JSON.stringify(payload),
        mode: 'cors', // Explicit CORS-läge
        credentials: 'omit' // Skicka inte cookies
      });

      // Hantera HTTP-fel (t.g. 401, 400, 404, 500)
      if (!response.ok) {
         const errorText = await response.text(); // Försök läsa felmeddelande från servern
         throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || response.statusText}`);
      }

      // Kontrollera om svaret är JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const apiResults = await response.json();
        // Mappa API-svaret till ExtendedQuizResult strukturen om det behövs
        // Annars returnera apiResults direkt om det matchar strukturen
        return apiResults;
      }

      // Om svaret inte är JSON, logga och använd standardresultat
      console.log('Response was not JSON, using default results', await response.text()); // Logga rådata om inte JSON
      return defaultResults;

    } catch (err) {
      // Fånga andra fel (nätverk, timeout etc.)
      console.error('Quiz submission error:', err);
      throw err; // Kasta felet vidare för hantering i handleAnswer/submitWithRetry
    }
  };

  // Funktion för att försöka skicka quizet med återförsök
  const submitWithRetry = async (allAnswers: AllAnswers, maxRetries = 2) => {
    let retries = 0;

    while (retries <= maxRetries) {
      try {
        if (retries > 0) {
          console.log(`Försöker igen... (${retries}/${maxRetries})`);
        }
        // Försök skicka quizet
        return await submitQuiz(allAnswers);
      } catch (error) {
        retries++;

        // Om max antal försök uppnåtts, kasta felet
        if (retries > maxRetries) {
          throw error;
        }

        // Vänta lite innan nästa försök (enkel väntetid, kan göras mer avancerad)
        await delay(1000 * retries); // Vänta 1s, 2s, 3s...
      }
    }
    // Om alla försök misslyckas, returnera standardresultat (alternativt kasta ett sista fel)
    console.log('Max retries reached, returning default results');
    return defaultResults;
  };


  // Funktion som körs när användaren väljer ett svar (multiple-choice/dropdown)
  const handleOptionSelect = (optionId: string) => {
     if (isSubmitting) return; // Förhindra val under inskickning

     const newAnswers = { ...answers, [currentQuestion!.id]: optionId }; // Använd non-null assertion här efter check
     setAnswers(newAnswers);

     // NY: Om det är branschfrågan, spara svaret
     if (currentQuestion!.id === 'industry') { // Använd non-null assertion
         setSelectedIndustry(optionId);
     }

     // Gå till nästa fråga automatiskt ENDAST för multiple-choice frågor
     if (currentQuestion!.type === 'multiple-choice' && currentQuestionIndex < quizQuestions.length - 1) { // Använd non-null assertion
       setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Gå till nästa fråga
     } else if (currentQuestion!.type === 'multiple-choice' && currentQuestionIndex === quizQuestions.length - 1) {
        // Om det var sista frågan OCH multiple-choice, skicka in
        submitAllAnswers(newAnswers);
     }
     // För dropdowns och text-frågor, krävs klick på "Nästa" knapp
  };

  // Funktion som körs när användaren skriver i ett textfält eller väljer i dropdown
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     if (isSubmitting) return; // Förhindra ändringar under inskickning

     const newAnswers = { ...answers, [currentQuestion!.id]: event.target.value }; // Använd non-null assertion
     setAnswers(newAnswers);

     // NY: Om det är branschfrågan (dropdown eller text), spara svaret
     if (currentQuestion!.id === 'industry') { // Använd non-null assertion
         setSelectedIndustry(event.target.value);
     }

     // Notera: Vi går INTE vidare automatiskt efter textinput eller dropdown-val.
     // Användaren måste klicka på "Nästa" eller "Skicka svar" knapp.
  };


  // Funktion för att gå till nästa fråga (används för text/dropdown frågor där man inte går vidare automatiskt)
  const handleNextQuestion = () => {
      // Validera att ett svar är valt för den aktuella frågan innan vi går vidare
      if (!currentQuestion || !answers[currentQuestion.id]) { // Lägg till check för currentQuestion
          setError("Vänligen välj ett svar eller fyll i fältet.");
          return;
      }
      setError(null); // Rensa fel om svar finns

      // Om det är sista frågan, skicka in quizet
      if (currentQuestionIndex === quizQuestions.length - 1) {
          submitAllAnswers(answers);
      } else {
          // Gå till nästa fråga
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }
  };


  // Funktion för att skicka in ALLA svar när quizet är klart
  const submitAllAnswers = async (finalAnswers: AllAnswers) => {
     setIsSubmitting(true); // Visa laddningsindikator
     setError(null); // Rensa tidigare felmeddelanden

     try {
       const results = await submitWithRetry(finalAnswers);
       // Mappa defaultResults till ExtendedQuizResult strukturen om det behövs, annars använd direkt
       // Om API-svaret matchar ExtendedQuizResult direkt, kan du använda det som det är.
       // Om inte, gör en mappning här.
       setQuizResults(results); // Använder resultsobjektet från submitWithRetry (som returnerar API-svaret eller defaultResults)
       setShowResults(true); // Visa resultatsidan
     } catch (err) {
       console.error("Failed to submit quiz:", err);
       const errorMessage = err instanceof Error ? err.message : 'Ett oväntat fel inträffade';
       setError(`Det gick inte att skicka dina svar. ${errorMessage}`);
       setQuizResults(defaultResults); // Visa standardresultat även vid fel
       setShowResults(true); // Gå till resultatsidan även vid fel för att visa standardresultat/felmeddelande
     } finally {
       setIsSubmitting(false); // Dölj laddningsindikator
     }
  };


  // Hjälpfunktion för att välja ikon baserat på resultatnivå
  const getResultIcon = () => {
    if (!quizResults) return null;

    // Använd quizResults.level eller quizResults.result_page_title beroende på vad backend/defaultResults ger
    // Använd optional chaining (?) för att undvika fel om level/result_page_title saknas
    const levelKey = (quizResults.level || quizResults.result_page_title)?.toLowerCase();

    switch (levelKey) {
      case 'pappskalle':
        return <Dumbbell className="w-16 h-16 text-red-500 mx-auto mb-6" />;
      case 'nyfiken':
        return <Brain className="w-16 h-16 text-yellow-500 mx-auto mb-6" />;
      case 'beach ready':
        return <Rocket className="w-16 h-16 text-green-500 mx-auto mb-6" />;
      // TODO: Lägg till case för nya nivåer här (t.g. ai-uppvärmning, ai-i-träning, ai-elitatleten)
      // case 'ai-uppvärmning':
      //   return <SomeIconForWarmup className="w-16 h-16 text-orange-500 mx-auto mb-6" />;
      // case 'ai-i-träning':
      //   return <SomeIconForTraining className="w-16 h-16 text-blue-500 mx-auto mb-6" />;
      // case 'ai-elitatleten':
      //   return <SomeIconForElite className="w-16 h-16 text-green-700 mx-auto mb-6" />;
      default:
        return null; // Eller en standardikon
    }
  };


  // Renderar quiz-sektionen
  return (
    <section className="py-32 px-8 bg-[#CDB4DB]" id="quiz-section"> {/* Använder den nya bakgrundsfärgsklassen */}
      <div className="max-w-3xl mx-auto">
        {/* Rubriker för quiz-sektionen - Använder den nya CSS-klassen h2-quiz-outline */}
        {/* Kontrollera att dessa H2:or använder h2-quiz-outline klassen */}
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
          Har ni AI-FOMO på jobbet?
        </h2>
         {/* Kontrollera att dessa H2:or använder h2-quiz-outline klassen */}
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
          Lungt, vi får er att komma igång!
        </h2>

        {/* Mindre text under H2 */}
        <h5 className="text-[1.4375rem] leading-relaxed mb-8 text-center">
          Kör vårt 2-minuters quiz och kolla vilket AI-nivå ni är på idag: Pappskalle, Nyfiken Nybörjare eller Beach Ready? {/* TODO: Uppdatera texten här när de nya nivåerna är på plats */}
        </h5>

        {/* Visar felmeddelande om det finns */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Villkorlig rendering: Visa quiz-frågor eller resultat */}
        {!showResults ? (
          // Visa quiz-frågor
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            {/* Progress Bar */}
            <ProgressBar
              currentStep={currentQuestionIndex + 1}
              totalSteps={quizQuestions.length}
            />

            {/* Aktuell fråga - Renderas endast om currentQuestion är definierad */}
            {currentQuestion && (
              <> {/* Använd Fragment för att gruppera */}
                <h3 className="text-xl font-semibold mb-6">
                  {currentQuestion.question}
                </h3>

                {/* --- RENDERAR OLIKA INPUT-TYPER BASERAT PÅ FRÅGANS 'type' --- */}

                {/* Om frågan är 'multiple-choice' */}
                {currentQuestion.type === 'multiple-choice' && Array.isArray(currentQuestion.options) && ( // Mer robust check
                  <div className="space-y-4">
                    {currentQuestion.options.map((option) => (
                      <QuizOption
                        key={option.id}
                        id={option.id}
                        text={option.text}
                        isSelected={answers[currentQuestion.id] === option.id}
                        onSelect={() => handleOptionSelect(option.id)} // Använd handleOptionSelect
                      />
                    ))}
                  </div>
                )}

                {/* Om frågan är 'dropdown' */}
                {currentQuestion.type === 'dropdown' && Array.isArray(currentQuestion.options) && ( // Mer robust check
                     <div className="mb-4">
                         <select
                             value={answers[currentQuestion.id] || ''} // Sätt valt värde
                             onChange={handleInputChange} // Använd handleInputChange för att spara värde
                             className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             disabled={isSubmitting}
                         >
                             <option value="" disabled>Välj...</option> {/* Standard "Välj" alternativ */}
                             {currentQuestion.options.map(option => (
                                 <option key={option.id} value={option.id}>{option.text}</option>
                             ))}
                         </select>
                     </div>
                 )}

                 {/* Om frågan är 'text' */}
                 {currentQuestion.type === 'text' && (
                     <div className="mb-4">
                         <input
                             type="text"
                             value={answers[currentQuestion.id] || ''} // Sätt valt värde
                             onChange={handleInputChange} // Använd handleInputChange för att spara värde
                             placeholder={currentQuestion.placeholder || ''} // Använd placeholder om den finns
                             className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                             disabled={isSubmitting}
                         />
                     </div>
                 )}

                {/* --- SLUT PÅ RENDERAR OLIKA INPUT-TYPER --- */}


                {/* Knapp för att gå till nästa fråga eller skicka svar */}
                {/* Denna knapp visas för dropdown och text-frågor (där man inte går vidare automatiskt) */}
                {/* Även för sista multiple-choice frågan om den inte går vidare automatiskt */}
                {/* Visa knappen om det INTE är en multiple-choice fråga ELLER om det är sista frågan */}
                {(currentQuestion.type !== 'multiple-choice' || currentQuestionIndex === quizQuestions.length - 1) && (
                     <div className="mt-6">
                         <Button
                             onClick={handleNextQuestion} // Använd handleNextQuestion
                             variant="purple" // Anpassa variant/stil vid behov
                             className="w-full bg-beach-purple text-white py-3 rounded-md disabled:opacity-50" // Exempel Tailwind-klasser
                             disabled={isSubmitting || !answers[currentQuestion.id]} // Inaktivera om inskickning pågår eller inget svar är valt
                         >
                             {currentQuestionIndex < quizQuestions.length - 1 ? 'Nästa fråga' : 'Skicka svar'}
                         </Button>
                     </div>
                 )}
              </>
            )}


          </div>
        ) : quizResults && (
          // Visa resultat
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center">
            {/* Resultat-ikon */}
            {getResultIcon()}

            {/* Resultatrubrik - Använder inline-stil för Gloock Regular 400 */}
            {/* Kontrollera att denna H2 har Gloock Regular 400 stil */}
            <h2
              style={{
                fontFamily: 'Gloock, serif', // Kontrollera exakt namn
                fontWeight: 400 // Regular
              }}
              className="text-[3.75rem] mb-8 text-center leading-[1.2]" // Behåll övriga Tailwind-klasser
            >
              Din AI-fitness nivå: {quizResults.level || quizResults.result_page_title} {/* Använd level eller result_page_title */}
            </h2>

            {/* Dynamiskt HTML-innehåll från backend (beskrivning och rekommendationer) */}
            {/* Visar beskrivning och rekommendationer från quizResults (förväntas vara nivå-baserade) */}
            {/* Använd dangerouslySetInnerHTML endast om HTML-innehållet är säkert och kommer från en betrodd källa */}
            {quizResults.description && (
                <p className="quiz-body-text mb-6">{quizResults.description}</p>
            )}
            {quizResults.recommendations && quizResults.recommendations.length > 0 && (
                 <div className="level-recommendations mt-8">
                     <h6 className="text-[23px] font-medium mb-4">Rekommendationer för din nivå:</h6>
                     <ul className="quiz-recommendations">
                         {quizResults.recommendations.map((rec, index) => (
                             <li key={index} className="flex items-center justify-center gap-3 mb-4">
                                 <span className="text-center leading-snug">{rec}</span>
                             </li>
                         ))}
                     </ul>
                 </div>
             )}


            {/* Jämförelsestatistik - Visas endast om comparative_statement finns i resultatet */}
            {/* Avkommenterad för att visas när defaultResults används */}
            {quizResults.comparative_statement && (
                <div className="bg-gray-50 rounded-lg p-6 mb-4"> {/* Mindre marginal i botten */}
                  <p className="quiz-percentile">
                    {quizResults.comparative_statement} {/* Allmän jämförelse från backend */}
                  </p>
                </div>
            )}

             {/* NY: Branschspecifik jämförelsestatistik - Visas endast om industry_comparative_statement finns och inte är tom */}
             {/* Kontrollerar att fältet finns OCH inte bara är whitespace */}
             {quizResults.industry_comparative_statement && quizResults.industry_comparative_statement.trim() !== '' && (
                 <div className="bg-gray-50 rounded-lg p-6 mb-8">
                     <p className="quiz-percentile">
                         {quizResults.industry_comparative_statement} {/* Branschspecifik jämförelse från backend */}
                     </p>
                 </div>
             )}


            {/* Metrik-kort (Strategisk Mognad, Kompetensgap) - Visas endast om dessa finns i resultatet */}
             {/* Dessa visas allmänt baserat på data från backend */}
             {/* Visas endast om strategicMaturityPercent ELLER kompetensgapPercent finns och inte är 0 */}
             {((quizResults.strategicMaturityPercent !== undefined && quizResults.strategicMaturityPercent !== 0) ||
               (quizResults.kompetensgapPercent !== undefined && quizResults.kompetensgapPercent !== 0)) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   {/* Visas endast om strategicMaturityPercent finns och inte är 0 */}
                   {quizResults.strategicMaturityPercent !== undefined && quizResults.strategicMaturityPercent !== 0 && (
                       <div className="quiz-metric-card">
                         <div className="flex justify-center mb-4">
                           <TrendingUp className="w-8 h-8 text-deep-purple" />
                         </div>
                         <h6 className="text-[23px] font-medium mb-4">AI strategisk mognad</h6>
                         <div className="text-[3.75rem] font-bold text-deep-purple mb-4 py-4">
                           {quizResults.strategicMaturityPercent}%
                         </div>
                         <p className="quiz-body-text">Bedömning av hur väl AI är integrerad i företagets övergripande strategi</p>
                       </div>
                   )}

                   {/* Visas endast om kompetensgapPercent finns och inte är 0 */}
                   {quizResults.kompetensgapPercent !== undefined && quizResults.kompetensgapPercent !== 0 && (
                       <div className="quiz-metric-card">
                         <div className="flex justify-center mb-4">
                           <Users className="w-8 h-8 text-deep-purple" />
                         </div>
                         <h6 className="text-[23px] font-medium mb-4">Kompetens