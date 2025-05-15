import { Handler } from "@netlify/functions";
import { google } from "googleapis";

export const handler: Handler = async (event) => {
  const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // CORS-preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ 
        success: false, 
        error: "Method not allowed" 
      }),
    };
  }

  try {
    // Parse payload
    const data = JSON.parse(event.body || "{}");

    // Ensure numeric values
    const score = Number(data.totalScore) || 0;
    const maxScore = Number(data.maxScore) || 1;
    const timestamp = data.timestamp || new Date().toISOString();
    const answers = data.answers || {};
    const growthPotentialPercent = data.growthPotentialPercent || 0;
    const aiReadinessPercent = data.aiReadinessPercent || 0;

    // 4) Beräkna nivå, beskrivning och rekommendationer enligt nya intervall
    let level: string;
    let description: string;
    let recommendations: string[];

    if (score <= 8) {                       // 0 – 8
      level = "AI-Nybörjare";
      description =
        "Ni står fortfarande i startgroparna när det gäller AI-användning. Det är helt ok – alla börjar någonstans!\n" +
        "AI-strategisk mognad: Låg (0-25%)\nAI-Readiness: Låg (0-25%)";
      recommendations = [
        "Utse en AI-ansvarig som kan driva initiativ och skapa en första enkel strategi",
        "Arrangera en inspirationsföreläsning om AI för hela organisationen",
        "Börja med en workshop där ni testar ChatGPT tillsammans på konkreta arbetsuppgifter",
        "Identifiera ett enkelt pilotprojekt där AI kan skapa direkt värde för verksamheten",
      ];
    } else if (score <= 16) {               // 9 – 16
      level = "AI-Utforskare";
      description =
        "Bra jobbat så här långt! Ni har tagit viktiga första steg och börjat utforska AI-landskapet.";
      recommendations = [
        "Formalisera er AI-strategi med tydlig koppling till affärsmål och avsätt dedikerad budget",
        "Utveckla en strukturerad datainsamlings- och hanteringsstrategi för AI-implementering",
        "Investera i strukturerad kompetensutveckling för nyckelpersoner och team",
        "Integrera fler AI-verktyg i era dagliga arbetsflöden med uppföljning av användning",
      ];
    } else if (score <= 24) {               // 17 – 24
      level = "AI-Pionjärer";
      description =
        "Imponerande! Ni ligger långt fram i AI-användning och har byggt en solid grund.\n" +
        "AI-strategisk mognad: Hög (51-75%)\nAI-Readiness: Hög (51-75%)";
      recommendations = [
        "Utveckla mätmetoder för att kvantifiera affärsresultat från era AI-satsningar",
        "Fördjupa integrationen mellan AI och övergripande affärsstrategi på ledningsnivå",
        "Etablera ett AI Center of Excellence för att koordinera och accelerera initiativ",
        "Utforska avancerade AI-användningsområden med potential att transformera verksamheten",
      ];
    } else {                                // 25 – 30
      level = "AI-Transformatörer";
      description =
        "Ni är i en klass för er själva! AI är en integrerad del av hela er verksamhet.\n" +
        "AI-strategisk mognad: Mycket hög (76-100%)\nAI-Readiness: Mycket hög (76-100%)";
      recommendations = [
        "Utveckla en strategi för att identifiera och hantera framtida AI-teknologier",
        "Utvärdera möjligheter att skapa helt nya affärsmodeller baserade på AI",
        "Bygg strategiska partnerskap med teknikleverantörer och akademin",
        "Balansera innovation med robusta ramverk för ansvarsfull AI-användning",
      ];
    }

    // Calculate percentages
    const strategicMaturityPercent = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100))) || 0;
    const kompetensgapPercent = Math.min(100, Math.max(0, Math.round(100 - ((score / maxScore) * 100)))) || 0;

    // Google Sheets Integration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = 'Quiz Results!A:S'; // Updated to 19 columns

    // Prepare row data matching exactly 19 columns (A through S)
    const rowData = [
      timestamp,                                    // A: Timestamp
      '',                                          // B: Industry (empty)
      '',                                          // C: Company Size (empty)
      Number(answers[1]) || 0,                     // D: Q1 Score
      Number(answers[2]) || 0,                     // E: Q2 Score
      Number(answers[3]) || 0,                     // F: Q3 Score
      Number(answers[4]) || 0,                     // G: Q4 Score
      Number(answers[5]) || 0,                     // H: Q5 Score
      Number(answers[6]) || 0,                     // I: Q6 Score
      Number(answers[7]) || 0,                     // J: Q7 Score
      Number(answers[8]) || 0,                     // K: Q8 Score
      Number(answers[9]) || 0,                     // L: Q9 Score
      Number(answers[10]) || 0,                    // M: Q10 Score
      score,                                       // N: Total Score
      level,                                       // O: Result Level
      strategicMaturityPercent,                    // P: Strategic Maturity %
      kompetensgapPercent,                        // Q: Competency Gap %
      growthPotentialPercent,                     // R: Growth Potential %
      aiReadinessPercent                          // S: AI Readiness %
    ];

    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [rowData],
      },
    });

    const response = {
      success: true,
      level,
      description,
      recommendations,
      comparative_statement: `Du ligger bättre till än ${Math.floor(Math.random() * 30) + 60}% av alla som tagit testet!`,
      strategicMaturityPercent,
      kompetensgapPercent,
      growthPotentialPercent,
      aiReadinessPercent
    };

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(response),
    };

  } catch (err: any) {
    console.error('Quiz error:', err);
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ 
        success: false, 
        error: err.message ?? "Unknown error" 
      }),
    };
  }
};