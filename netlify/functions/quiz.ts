import type { Handler, HandlerResponse } from "@netlify/functions";
import { google } from "googleapis";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  // 1) CORS‐preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: "",
    };
  }

  // 2) Endast POST tillåtet
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // 3) Läs in payload
    const data = JSON.parse(event.body || "{}");
    const answers: Record<string, number> = data.numericAnswers ?? data.answers ?? {};

    const score       = Number(data.totalScore) || 0;
    const maxScore    = Number(data.maxScore)   || 1;
    const industry    = String(data.industry || "");
    const companySize = String(data.companySize || "");
    const strangeQ    = String(data.strangeAIQuestion || "");
    const version     = String(data.quiz_version || "");
    const timestamp   = String(data.timestamp || new Date().toISOString());

    // 4) Beräkna nivå, beskrivning och rekommendationer
    let level: string;
    let description: string;
    let recommendations: string[];
    if (score <= 10) {
      level = "Pappskalle";
      description = "Du är som en nybörjare på gymmet som försöker lyfta de tyngsta vikterna direkt. Dags att börja med grunderna!";
      recommendations = [
        "Börja med en AI-introduktionskurs",
        "Experimentera med ChatGPT",
        "Hitta ett litet AI-projekt",
      ];
    } else if (score <= 20) {
      level = "Nyfiken";
      description = "Du har börjat din AI-resa, ungefär som någon som upptäckt att det finns mer på gymmet än löpbandet!";
      recommendations = [
        "Utveckla en AI-strategi",
        "Utbilda teamet i AI-användning",
        "Testa nya AI-verktyg",
      ];
    } else {
      level = "Beach Ready";
      description = "Wow! Du är AI-fit och redo för stranden!";
      recommendations = [
        "Förfina er AI-strategi",
        "Utforska cutting-edge AI",
        "Bli en AI-influencer",
      ];
    }

    // 5) Procentsatser
    const strategicMaturityPercent = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));
    const kompetensgapPercent       = Math.min(100, Math.max(0, Math.round(100 - ((score / maxScore) * 100))));
    const aiReadinessPercent        = strategicMaturityPercent;

    // 6) Google Sheets‐integration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID!;
    const range = "Quiz Results!A:T";

    // Förbered raden (A-T)
    const rowData = [
      timestamp, industry, companySize,
      ...Array.from({ length: 10 }, (_, i) => Number(answers[String(i+1)] ?? 0)),
      score, level,
      strategicMaturityPercent,
      kompetensgapPercent,
      aiReadinessPercent,
      version, strangeQ
    ];

    // 7) Skriv till arket
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [rowData] },
    });

    // 8) Skicka tillbaka resultatet
    const responsePayload = {
      success: true,
      level,
      description,
      recommendations,
      comparative_statement: `Du ligger bättre till än ${Math.floor(Math.random()*30)+60}% av alla som tagit testet!`,
      strategicMaturityPercent,
      kompetensgapPercent,
      aiReadinessPercent,
    };

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(responsePayload),
    };

  } catch (error: any) {
    console.error("Error processing quiz submission:", error);
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
