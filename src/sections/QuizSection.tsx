import React, { useState, ChangeEvent } from 'react'; // Importera ChangeEvent för input-hantering
import { quizQuestions, QuizQuestion, QuizOption, QuizResult } from '../utils/quizData'; // Importera typerna
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { Dumbbell, Brain, Rocket, TrendingUp, Users } from 'lucide-react';

// Kontrollera att denna URL är den senaste och korrekta från Manus.im
const MANUS_WEBHOOK_URL = 'https://4zmhqivc0g0q.manus.space/quiz_submit';

// Standardresultat om API-anropet misslyckas eller inte returnerar JSON
const defaultResults = {
  result_page_title: 'Nyfiken',
  result_html_content: `
    <p class="quiz-body-text mb-8">Du har tagit dina första steg in i AI-världen och visar stor potential!</p>
    <div class="mb-8">
      <h6 class="text-[23px] font-medium mb-4">Rekommendationer:</h6>
      <ul class="quiz-recommendations">
        <li class="flex items-center justify-center gap-3 mb-4">
          <span class="text-center leading-snug">Börja med att identifiera enkla AI-användningsfall</span>
        </li>
        <li class="flex items-center justify-center gap-3 mb-4">
          <span class="text-center leading-snug">Utbilda teamet i grundläggande AI-koncept</span>
        </li>
        <li class="flex items-center justify-center gap-3 mb-4">
          <span class="text-center leading-snug">Experimentera med färdiga AI-verktyg</span>
        </li>
      </ul>
    </div>
  `,
  comparative_statement: 'Du ligger bättre till än 65% av alla som tagit testet!',
  strategicMaturityPercent: 75,
  kompetensgapPercent: 60
};

// Definiera en typ för att lagra alla svar, inklusive de nya typerna
interface AllAnswers {
  [questionId: string | number]: string; // Svar lagras med frågans ID som nyckel
}


const QuizSection: React.FC = () => {
  // State för att hantera quiz-flödet
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Använd index
  const [answers, setAnswers] = useState<AllAnswers>({}); // Använd AllAnswers typ
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null); // Använd QuizResult typ

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
      maxPossibleScore: quizQuestions
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
          'X-API-KEY': 'ed5aed3cdd2410758637cc8a50e26fbb4402bead81885f55a933331228fb5f1'
        },
        body: JSON.stringify(payload),
        mode: 'cors', // Explicit CORS-läge
        credentials: 'omit' // Skicka inte cookies
      });

      // Hantera HTTP-fel (t.ex. 401, 404, 500)
      if (!response.ok) {
         const errorText = await response.text(); // Försök läsa felmeddelande från servern
         throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText || response.statusText}`);
      }

      // Kontrollera om svaret är JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json(); // Returnera JSON-svaret från backend
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
       setQuizResults(results);
       // TODO: Använd resultaten från backend för att visa dynamiskt innehåll
       // Just nu används defaultResults för result_html_content, comparative_statement etc.
       // Du behöver mappa resultaten från API-svaret till ditt state.
       // Exempel: setQuizResults({ ...results, level: results.result_page_title });
       // Se över hur backend-svaret ser ut och anpassa här.
       setQuizResults(results); // Använder hela resultsobjektet från backend
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

    // TODO: Uppdatera denna logik när de nya resultatnivåerna (Uppvärmning, Träning, Elitatleten) implementeras i backend
    // Använd quizResults.level som kommer från backend via getQuizResult i quizData.ts
    switch (quizResults.level.toLowerCase()) {
      case 'pappskalle':
        return <Dumbbell className="w-16 h-16 text-red-500 mx-auto mb-6" />;
      case 'nyfiken':
        return <Brain className="w-16 h-16 text-yellow-500 mx-auto mb-6" />;
      case 'beach ready':
        return <Rocket className="w-16 h-16 text-green-500 mx-auto mb-6" />;
      // TODO: Lägg till case för nya nivåer här
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
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]">
          Har ni AI-FOMO på jobbet?
        </h2>
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
              Din AI-fitness nivå: {quizResults.level} {/* Använd level från QuizResult */}
            </h2>

            {/* Dynamiskt HTML-innehåll från backend (rekommendationer etc.) */}
            {/* Använd dangerouslySetInnerHTML endast om HTML-innehållet är säkert och kommer från en betrodd källa */}
            {/* Visar beskrivning och rekommendationer från quizResults */}
            <div className="quiz-body-html-content mb-8" dangerouslySetInnerHTML={{ __html: quizResults.description + (quizResults.recommendations && quizResults.recommendations.length > 0 ? '<h6 class="text-[23px] font-medium mb-4 mt-6">Rekommendationer:</h6><ul class="quiz-recommendations">' + quizResults.recommendations.map(rec => `<li class="flex items-center justify-center gap-3 mb-4"><span class="text-center leading-snug">${rec}</span></li>`).join('') + '</ul>' : '') }} />


            {/* Jämförelsestatistik - Visas endast om comparative_statement finns i resultatet */}
            {/* TODO: Om backend skickar comparative_statement, avkommentera detta och lägg till i QuizResult typen */}
            {/*
            {quizResults.comparative_statement && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <p className="quiz-percentile">
                    {quizResults.comparative_statement}
                  </p>
                </div>
            )}
            */}


            {/* Metrik-kort (Strategisk Mognad, Kompetensgap) - Visas endast om dessa finns i resultatet */}
             {/* TODO: Om backend skickar dessa metrics, avkommentera detta och lägg till i QuizResult typen */}
             {/*
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
             */}


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
