import { QuizQuestion, QuizResult } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Hur är er relation till AI just nu?',
    type: 'multiple-choice',
    options: [
      { id: '1a', text: 'Vi är som främlingar som aldrig mötts', points: 0 },
      { id: '1b', text: 'Vi har swipat höger på ChatGPT några gånger', points: 1 },
      { id: '1c', text: 'Vi dejtar regelbundet men inget seriöst än', points: 2 },
      { id: '1d', text: 'Vi är i ett långsiktigt förhållande', points: 3 }
    ]
  },
  {
    id: 2,
    question: 'Hur många AI-verktyg har ni i er digitala verktygslåda?',
    type: 'multiple-choice',
    options: [
      { id: '2a', text: 'Vår verktygslåda är tom som efter ett inbrott', points: 0 },
      { id: '2b', text: 'Vi har en skruvmejsel (ChatGPT) och en hammare (Midjourney)', points: 1 },
      { id: '2c', text: 'Vi har en helt okej uppsättning verktyg', points: 2 },
      { id: '2d', text: 'Vi är som AI-versionen av Byggmax', points: 3 }
    ]
  },
  {
    id: 3,
    question: 'Hur ser er AI-strategi ut?',
    type: 'multiple-choice',
    options: [
      { id: '3a', text: 'Strategi? Vi har inte ens en plan för fredagsfikan', points: 0 },
      { id: '3b', text: 'Vi har pratat om AI på ett möte en gång', points: 1 },
      { id: '3c', text: 'Vi har en dokumenterad strategi som faktiskt följs ibland', points: 2 },
      { id: '3d', text: 'Vår AI-strategi är integrerad i hela verksamhetsplanen', points: 3 }
    ]
  },
  {
    id: 4,
    question: 'Hur reagerar era anställda när AI nämns?',
    type: 'multiple-choice',
    options: [
      { id: '4a', text: 'De gömmer sig under skrivbordet och viskar "Skynet"', points: 0 },
      { id: '4b', text: 'De nickar artigt men använder aldrig AI-verktygen', points: 1 },
      { id: '4c', text: 'Några entusiaster använder AI regelbundet och delar tips', points: 2 },
      { id: '4d', text: 'AI-verktyg är en naturlig del av vardagsarbetet för de flesta', points: 3 }
    ]
  },
  {
    id: 5,
    question: 'Hur mycket resurser lägger ni på AI-utveckling?',
    type: 'multiple-choice',
    options: [
      { id: '5a', text: 'Samma som min investering i kryptovaluta 2022 - noll', points: 0 },
      { id: '5b', text: 'Vi har ett gratis ChatGPT-konto som vi delar på', points: 1 },
      { id: '5c', text: 'Vi har en faktisk budget, men den är lite blyg', points: 2 },
      { id: '5d', text: 'Vi investerar som om AI var det nya guldet', points: 3 }
    ]
  },
  {
    id: 6,
    question: 'Hur ligger ni till jämfört med konkurrenterna?',
    type: 'multiple-choice',
    options: [
      { id: '6a', text: 'Vi är som en häst och vagn i en Tesla-utställning', points: 0 },
      { id: '6b', text: 'Vi är som en Volvo 740 bland Teslor', points: 1 },
      { id: '6c', text: 'Vi kör hybrid medan andra fortfarande tankar bensin', points: 2 },
      { id: '6d', text: 'Vi är som en flygande bil bland vanliga elbilar', points: 3 }
    ]
  },
  {
    id: 7,
    question: 'Hur hanterar ni AI-etik?',
    type: 'multiple-choice',
    options: [
      { id: '7a', text: 'AI-etik låter som namnet på en science fiction-film', points: 0 },
      { id: '7b', text: 'Vi har googlat "är AI farligt?" en gång', points: 1 },
      { id: '7c', text: 'Vi har faktiskt några riktlinjer nedskrivna', points: 2 },
      { id: '7d', text: 'Vi har en AI-etikchef som är strängare än en gymnasielärare', points: 3 }
    ]
  },
  {
    id: 8,
    question: 'Vad är er vision för AI i framtiden?',
    type: 'multiple-choice',
    options: [
      { id: '8a', text: 'Framtiden? Vi försöker överleva nuet', points: 0 },
      { id: '8b', text: 'Vi hoppas AI inte tar över världen', points: 1 },
      { id: '8c', text: 'Vi ser ljust på framtiden med AI som vår träningskompis', points: 2 },
      { id: '8d', text: 'Vi planerar att bli AI-influencers och sälja proteinshakes', points: 3 }
    ]
  },
  {
    id: 9,
    question: 'Hur ser ert AI-kunskapsläge ut?',
    type: 'multiple-choice',
    options: [
      { id: '9a', text: 'Vi vet lika mycket om AI som om kvantfysik på mandarin', points: 0 },
      { id: '9b', text: 'En person har sett en YouTube-video om ChatGPT', points: 1 },
      { id: '9c', text: 'Vi har några självlärda AI-entusiaster i korridorerna', points: 2 },
      { id: '9d', text: 'Vi har både formell och informell AI-utbildning för alla', points: 3 }
    ]
  },
  {
    id: 10,
    question: 'Hur är er data förberedd för AI-implementering?',
    type: 'multiple-choice',
    options: [
      { id: '10a', text: 'Vår data är som en tonårings rum - totalt kaos', points: 0 },
      { id: '10b', text: 'Vi har börjat städa men hittar fortfarande inte strumporna', points: 1 },
      { id: '10c', text: 'Vi har hyfsat organiserade datamappar och system', points: 2 },
      { id: '10d', text: 'Vår data är mer välorganiserad än Marie Kondos garderob', points: 3 }
    ]
  }
];

export const getQuizResult = (score: number): QuizResult => {
  if (score <= 10) {
    return {
      level: 'AI-Nybörjare',
      description: 'Ni står fortfarande i startgroparna när det gäller AI-användning.',
      recommendations: [
        'Utse en AI-ansvarig som kan driva initiativ och skapa en första enkel strategi',
        'Arrangera en inspirationsföreläsning om AI för hela organisationen',
        'Börja med en workshop där ni testar ChatGPT tillsammans på konkreta arbetsuppgifter',
        'Identifiera ett enkelt pilotprojekt där AI kan skapa direkt värde för verksamheten'
      ]
    };
  } else if (score <= 16) {
    return {
      level: 'AI-Utforskare',
      description: 'Bra jobbat så här långt! Ni har tagit viktiga första steg och börjat utforska AI-landskapet.',
      recommendations: [
        'Formalisera er AI-strategi med tydlig koppling till affärsmål och avsätt dedikerad budget',
        'Utveckla en strukturerad datainsamlings- och hanteringsstrategi för AI-implementering',
        'Investera i strukturerad kompetensutveckling för nyckelpersoner och team',
        'Integrera fler AI-verktyg i era dagliga arbetsflöden med uppföljning av användning'
      ]
    };
  } else if (score <= 24) {
    return {
      level: 'AI-Pionjärer',
      description: 'Imponerande! Ni ligger långt fram i AI-användning och har byggt en solid grund.',
      recommendations: [
        'Utveckla mätmetoder för att kvantifiera affärsresultat från era AI-satsningar',
        'Fördjupa integrationen mellan AI och övergripande affärsstrategi på ledningsnivå',
        'Etablera ett AI Center of Excellence för att koordinera och accelerera initiativ',
        'Utforska avancerade AI-användningsområden med potential att transformera verksamheten'
      ]
    };
  } else {
    return {
      level: 'AI-Transformatörer',
      description: 'Ni är i en klass för er själva! AI är en integrerad del av hela er verksamhet.',
      recommendations: [
        'Utveckla en strategi för att identifiera och hantera framtida AI-teknologier',
        'Utvärdera möjligheter att skapa helt nya affärsmodeller baserade på AI',
        'Bygg strategiska partnerskap med teknikleverantörer och akademin',
        'Balansera innovation med robusta ramverk för ansvarsfull AI-användning'
      ]
    };
  }
};