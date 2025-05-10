import React, { useState, ChangeEvent } from 'react';
import { quizQuestions, QuizQuestion, QuizResult } from '../utils/quizData';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Dumbbell, Brain, Rocket, TrendingUp, Users } from 'lucide-react';

// API Configuration
const MANUS_WEBHOOK_URL = 'https://29yhyi3c9q7y.manus.space/quiz_submit';
const API_KEY = 'ed5aed3cdd2410758637cc8a50e26f4bb4402bead81885f55a933331228fb5f1';

// Standardresultat om API-anropet misslyckas eller inte returnerar JSON
// Detta objekt används när API-anropet misslyckas (t.ex. 401-fel)
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
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!',
  strategicMaturityPercent: 75,
  kompetensgapPercent: 60
};

// Definiera en typ för att lagra alla svar, inklusive de nya typerna
interface AllAnswers {
  [questionId: string | number]: string; // Svar lagras med frågans ID som nyckel
}

// Uppdatera QuizResult typen för att inkludera fält som defaultResults har
// Om din backend SKA returnera comparative_statement, strategicMaturityPercent, kompetensgapPercent,
// måste dessa läggas till i QuizResult interface i src/utils/quizData.ts också.
interface ExtendedQuizResult extends QuizResult {
    comparative_statement?: string;
    strategicMaturityPercent?: number;
    kompetensgapPercent?: number;
    result_page_title?: string; // Lägg till om backend skickar detta istället för level
}


const QuizSection: React.FC = () => {
  // State för att hantera quiz-flödet
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Använd index
  const [answers, setAnswers] = useState<AllAnswers>({}); // Använd AllAnswers typ
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Använd ExtendedQuizResult för att hantera både API-svar och defaultResults
  const [quizResults, setQuizResults] = useState<ExtendedQuizResult | null>(null);


  // Hämta aktuell fråga baserat på index
  // Lägg till en defensiv koll om quizQuestions är tom eller index är utanför gränserna
  const currentQuestion = quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length
    ? quizQuestions[currentQuestionIndex]
    : null;


  // Hjälpfunktion för fördröjning (används i återförsökslogiken)
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Funktion för att skicka quiz-svar till backend
  const submitQuiz = async (allAnswers: AllAnswers) => {
    // Beräkna total poäng endast från multiple-choice frågor
    let totalScore = 0;
    const scoredAnswers: Record<string | number, string> = {};

    quizQuestions.forEach(question => {
      const answerId = allAnswers[question.id];
      if (question.type === 'multiple-choice' && answerId) {
        const selectedOption = question.options?.find(opt => opt.id === answerId);
        if (selectedOption && selectedOption.points !== undefined) {
          totalScore += selectedOption.points;
          scoredAnswers[question.id] = answerId; // Lagra ID för multiple-choice svar
        }
      }
    });

    // Samla alla svar, inklusive de nya typerna
    const payloadAnswers: Record<string | number, string> = { ...scoredAnswers }; // Starta med poängsatta svar

    // Lägg till svar från dropdown och text-frågor
    quizQuestions.forEach(question => {
        if (question.type !== 'multiple-choice') {
            const answer = allAnswers[question.id];
            if (answer) {
                 payloadAnswers[question.id] = answer; // Lagra värdet för dropdown/text svar
            }
        }
    });


    // Bygg payload för API-anropet
    const payload = {
      answers: payloadAnswers, // Skicka ALLA svar till backend
      totalScore, // Skicka den beräknade poängen
      // ÄNDRAT: maxPossibleScore till maxScore för att matcha backend
      maxScore: quizQuestions
                         .filter(q => q.type === 'multiple-choice') // Endast poäng från multiple-choice
                         .reduce((sum, q) => sum + Math.max(...(q.options?.map(opt => opt.points || 0) || [0])), 0), // Beräkna max poäng dynamiskt
      timestamp: new Date().toISOString(),
      quiz_version: '1.1', // Uppdatera version om du gör större ändringar
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
          // Använder den nya API-nyckeln från Manus.im
          'X-API-KEY': 'ed5aed3cdd2410758637cc8a50e26f4bb4402bead81885f55a933331228fb5f1' // <-- Använd den NYA nyckeln här!
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

     // Gå till nästa fråga automatiskt ENDAST för multiple-choice frågor
     if (currentQuestion!.type === 'multiple-choice' && currentQuestionIndex < quizQuestions.length - 1) { // Använd non-null assertion
       setCurrentQuestionIndex(currentQuestionIndex + 1);
     } else if (currentQuestionIndex === quizQuestions.length - 1) {
       // Om det var sista frågan OCH multiple-choice/dropdown, skicka in
       submitAllAnswers(newAnswers);
     }
     // För dropdowns som inte är sista frågan, krävs klick på "Nästa" knapp
  };

  // Funktion som körs när användaren skriver i ett textfält eller väljer i dropdown
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
     if (isSubmitting) return; // Förhindra ändringar under inskickning

     const newAnswers = { ...answers, [currentQuestion!.id]: event.target.value }; // Använd non-null assertion
     setAnswers(newAnswers);

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

      if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
          // Om det var sista frågan, skicka in quizet
          submitAllAnswers(answers);
      }
  };

  // Funktion för att skicka in ALLA svar när quizet är klart
  const submitAllAnswers = async (finalAnswers: AllAnswers) => {
     setIsSubmitting(true); // Visa laddningsindikator
     setError(null); // Rensa tidigare felmeddelanden

     try {
       const results = await submitWithRetry(finalAnswers);
       // Mappa defaultResults till ExtendedQuizResult om det behövs, annars använd direkt
       // Om API-svaret matchar ExtendedQuizResult direkt, kan du använda det som det är.
       // Om inte, gör en mappning här.
       setQuizResults(results); // Använder resultsobjektet från submitWithRetry (som returnerar API-svaret eller defaultResults)
       setShowResults(true); // Visa resultatsidan
     } catch (err) {
       console.error("Failed to submit quiz:", err);
       const errorMessage = err instanceof Error ? err.message : 'Ett oväntat fel inträffade';
       setError(`Det gick inte att skicka dina svar. ${errorMessage}`);
       setQuizResults(defaultResults); // Visa standardresultat även vid fel
       setShowResults(true); // Gå till resultatsidan även vid fel
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
      default:
        return null; // Eller en standardikon
    }
  };


  // Renderar quiz-sektionen
  return (
    <section className="py-32 px-8 bg-[#CDB4DB]" id="quiz-section"> {/* Använder den nya bakgrundsfärgsklassen */}
      <div className="max-w-3xl mx-auto">
        {/* Rubriker för quiz-sektionen - Använder den nya CSS-klassen h2-quiz-outline */}
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
          Har ni AI-FOMO på jobbet?
        </h2>
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
          Lungt, vi får er att komma igång!
        </h2>

        {/* Mindre text under H2 */}
        <h5 className="text-[1.4375rem] leading-relaxed mb-8 text-center">
          Kör vårt 2-minuters quiz och kolla vilket AI-nivå ni är på idag: Pappskalle, Nyfiken Nybörjare eller Beach Ready?
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
                {currentQuestion.type !== 'multiple-choice' && (
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
            {/* Visar beskrivning och rekommendationer från quizResults */}
            {/* Använd dangerouslySetInnerHTML endast om HTML-innehållet är säkert och kommer från en betrodd källa */}
            <div className="quiz-body-html-content mb-8" dangerouslySetInnerHTML={{ __html: (quizResults.description || defaultResults.description) + (quizResults.recommendations && quizResults.recommendations.length > 0 ? '<h6 class="text-[23px] font-medium mb-4 mt-6">Rekommendationer:</h6><ul class="quiz-recommendations">' + quizResults.recommendations.map(rec => `<li class="flex items-center justify-center gap-3 mb-4"><span class="text-center leading-snug">${rec}</span></li>`).join('') + '</ul>' : '') }} />


            {/* Jämförelsestatistik - Visas endast om comparative_statement finns i resultatet */}
            {/* Avkommenterad för att visas när defaultResults används */}
            {quizResults.comparative_statement && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <p className="quiz-percentile">
                    {quizResults.comparative_statement}
                  </p>
                </div>
            )}


            {/* Metrik-kort (Strategisk Mognad, Kompetensgap) - Visas endast om dessa finns i resultatet */}
             {/* Avkommenterad för att visas när defaultResults används */}
             {(quizResults.strategicMaturityPercent !== undefined || quizResults.kompetensgapPercent !== undefined) && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   {quizResults.strategicMaturityPercent !== undefined && (
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

                   {quizResults.kompetensgapPercent !== undefined && (
                       <div className="quiz-metric-card">
                         <div className="flex justify-center mb-4">
                           <Users className="w-8 h-8 text-deep-purple" />
                         </div>
                         <h6 className="text-[23px] font-medium mb-4">Kompetensgap</h6>
                         <div className="text-[3.75rem] font-bold text-deep-purple mb-4 py-4">
                           {quizResults.kompetensgapPercent}%
                         </div>
                         <p className="quiz-body-text">Skillnaden mellan nuvarande kompetens och vad som krävs för nästa nivå</p>
                       </div>
                   )}
                 </div>
             )}


            {/* Knapp för att scrolla till nästa sektion */}
            <Button
              onClick={() => document.getElementById('competition-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="purple" // Anpassa variant/stil vid behov
              className="bg-beach-purple text-white" // Exempel på Tailwind-klasser för knappstil
            >
              Tävla om en AI-workshop
            </Button>
          </div>
        )}

        {/* Laddningsindikator */}
        {isSubmitting && (
             <div className="text-center text-lg font-semibold mt-6">
                 Skickar svar...
             </div>
         )}

      </div>
    </section>
  );
};

export default QuizSection;