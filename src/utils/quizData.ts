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
      level: 'Pappskalle',
      description: 'Du är som en nybörjare på gymmet som försöker lyfta de tyngsta vikterna direkt. Dags att börja med grunderna!',
      recommendations: [
        'Börja med en AI-introduktionskurs (tänk personlig tränare för nybörjare)',
        'Experimentera med ChatGPT (som att lära sig grundläggande övningar)',
        'Hitta ett litet projekt där AI kan hjälpa er (som att sätta upp ett enkelt träningsschema)'
      ]
    };
  } else if (score <= 20) {
    return {
      level: 'Nyfiken',
      description: 'Du har börjat din AI-resa, ungefär som någon som precis upptäckt att det finns mer på gymmet än löpbandet!',
      recommendations: [
        'Utveckla en AI-strategi (som en personlig träningsplan)',
        'Utbilda teamet i AI-användning (gruppträning är alltid roligare)',
        'Testa mer avancerade verktyg (dags att prova den där nya maskinen på gymmet)'
      ]
    };
  } else {
    return {
      level: 'Beach Ready',
      description: 'Wow! Du är AI-fit och redo för stranden! Din organisation flexar sina AI-muskler som en erfaren bodybuilder!',
      recommendations: [
        'Förfina er AI-strategi (även proffs behöver justera sin träningsplan)',
        'Utforska cutting-edge AI-implementeringar (som att testa nya träningsmetoder)',
        'Bli en AI-influencer i er bransch (dela med er av era gains!)'
      ]
    };
  }
};