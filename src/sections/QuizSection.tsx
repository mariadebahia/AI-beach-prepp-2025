
import React, { useState } from 'react';
// Standard import-sökvägar utan filändelser - KONTROLLERA EXAKT STAVNING OCH VERSALISERING i filhanteraren i Bolt.
// Mappar: utils, components
// Filer: quizData, QuizOption, ProgressBar, Button
// Om filerna i din Bolt-miljö har ändelser (t.ex. .ts, .tsx) OCH byggverktyget kräver det,
// lägg till ändelserna här igen EFTER att du har dubbelkollat namnen.
import { quizQuestions } from '../utils/quizData';
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

const QuizSection: React.FC = () => {
  // State för att hantera quiz-flödet
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(quizQuestions.length).fill(''));
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<{
    result_page_title: string;
    result_html_content: string;
    comparative_statement: string;
    strategicMaturityPercent: number;
    kompetensgapPercent: number;
  } | null>(null);

  // Hjälpfunktion för fördröjning (används i återförsökslogiken)
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Funktion för att skicka quiz-svar till backend
  const submitQuiz = async (answers: string[]) => {
    // Konvertera svar till objekt med poäng
    const answersObject: Record<string, number> = {};
    const totalScore = answers.reduce((sum, answerId, index) => {
      const option = quizQuestions[index].options.find(opt => opt.id === answerId);
      const score = option?.points || 0;
      // Lägg till poäng för poängfrågor
      if (quizQuestions[index].type !== 'categorization') { // Lägg till koll för kategoriseringsfrågor senare
         answersObject[`question${index + 1}`] = score;
      }
      return sum + score;
    }, 0);

    // TODO: Lägg till logik här för att samla in svar från kategoriseringsfrågor (storlek, bransch)
    // och inkludera dem i payloaden. Exempel:
    // const companySizeAnswer = answers[quizQuestions.findIndex(q => q.id === 'companySize')];
    // const industryAnswer = answers[quizQuestions.findIndex(q => q.id === 'industry')];


    // Bygg payload för API-anropet
    const payload = {
      answers: answersObject, // Poängsvar
      totalScore,
      maxScore: quizQuestions.length * 3, // Kan behöva justeras om kategoriseringsfrågor läggs till utan poäng
      timestamp: new Date().toISOString(),
      quiz_version: '1.0',
      // TODO: Lägg till kategoriseringssvar här när de är implementerade i front-end
      // companySize: companySizeAnswer,
      // industry: industryAnswer,
    };

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
  const submitWithRetry = async (answers: string[], maxRetries = 2) => {
    let retries = 0;

    while (retries <= maxRetries) {
      try {
        if (retries > 0) {
          console.log(`Försöker igen... (${retries}/${maxRetries})`);
        }
        // Försök skicka quizet
        return await submitQuiz(answers);
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


  // Funktion som körs när användaren väljer ett svar
  const handleAnswer = async (optionId: string) => {
    // Spara användarens svar
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionId;
    setAnswers(newAnswers);

    // Om det finns fler frågor, gå till nästa
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return; // Avsluta funktionen här
    }

    // Om det var sista frågan, skicka in quizet
    setIsSubmitting(true); // Visa laddningsindikator
    setError(null); // Rensa tidigare felmeddelanden

    try {
      // Försök skicka quizet med återförsökslogik
      const results = await submitWithRetry(newAnswers);
      // Sätt resultaten och visa resultatsidan
      setQuizResults(results);
      setShowResults(true);
    } catch (err) {
      // Hantera fel vid inskickning
      console.error("Failed to submit quiz:", err);
      // Visa ett användarvänligt felmeddelande
      const errorMessage = err instanceof Error ? err.message : 'Ett oväntat fel inträffade';
      setError(`Det gick inte att skicka dina svar. ${errorMessage}`);
      // Visa standardresultat även vid fel
      setQuizResults(defaultResults);
      setShowResults(true); // Gå till resultatsidan även vid fel för att visa standardresultat/felmeddelande
    } finally {
      // Avsluta laddningsindikatorn
      setIsSubmitting(false);
    }
  };

  // Hjälpfunktion för att välja ikon baserat på resultatnivå
  const getResultIcon = () => {
    if (!quizResults) return null;

    // TODO: Uppdatera denna logik när de nya resultatnivåerna (Uppvärmning, Träning, Elitatleten) implementeras i backend
    switch (quizResults.result_page_title.toLowerCase()) {
      case 'pappskalle': // Gammal nivå
        return <Dumbbell className="w-16 h-16 text-red-500 mx-auto mb-6" />;
      case 'nyfiken': // Gammal nivå
        return <Brain className="w-16 h-16 text-yellow-500 mx-auto mb-6" />;
      case 'beach ready': // Gammal nivå
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
    <section className="py-32 px-8 bg-beach-pink" id="quiz-section">
      <div className="max-w-3xl mx-auto">
        {/* Rubriker för quiz-sektionen - Använder den nya CSS-klassen h2-quiz-outline */}
        {/* TA BORT ALLA INLINE STILAR HÄRIFRÅN */}
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]"> {/* Lägg till h2-quiz-outline */}
          Har ni AI-FOMO på jobbet?
        </h2>
         {/* TA BORT ALLA INLINE STILAR HÄRIFRÅN */}
        <h2 className="h2-quiz-outline mb-8 text-center leading-[1.2]"> {/* Lägg till h2-quiz-outline */}
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
              currentStep={currentQuestion + 1}
              totalSteps={quizQuestions.length}
            />

            {/* Aktuell fråga */}
            <h3 className="text-xl font-semibold mb-6">
              {quizQuestions[currentQuestion].question}
            </h3>

            {/* Svarsalternativ */}
            <div className="space-y-4">
              {quizQuestions[currentQuestion].options.map((option) => (
                <QuizOption
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  isSelected={answers[currentQuestion] === option.id}
                  onSelect={() => !isSubmitting && handleAnswer(option.id)} // Förhindra klick under inskickning
                />
              ))}
            </div>
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
              Din AI-fitness nivå: {quizResults.result_page_title} {/* TODO: Uppdatera texten här när de nya nivåerna är på plats */}
            </h2>

            {/* Dynamiskt HTML-innehåll från backend (rekommendationer etc.) */}
            <div className="quiz-body-html-content mb-8" dangerouslySetInnerHTML={{ __html: quizResults.result_html_content }} />

            {/* Jämförelsestatistik */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="quiz-percentile">
                {quizResults.comparative_statement}
              </p>
            </div>

            {/* Metrik-kort (Strategisk Mognad, Kompetensgap) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            </div>

            {/* Knapp för att scrolla till nästa sektion */}
            <Button
              onClick={() => document.getElementById('competition-section')?.scrollIntoView({ behavior: 'smooth' })}
              variant="purple"
              className="bg-beach-purple text-white" // Exempel på Tailwind-klasser för knappstil
            >
              Tävla om en AI-workshop
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizSection;
