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

  // 2) Only POST allowed
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // 3) Parse payload
    const data = JSON.parse(event.body || "{}");
    const answers: Record<string, number> = data.numericAnswers ?? data.answers ?? {};

    // Ensure numeric values
    const score = Number(data.totalScore) || 0;
    const maxScore = Number(data.maxScore) || 1;
    const industry = data.industry;
    const companySize = data.companySize;
    const strangeQ = data.strangeAIQuestion;
    const version = data.quiz_version || "";
    const timestamp = data.timestamp || new Date().toISOString();

    // 4) Calculate level, description and recommendations
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

    // 5) Calculate percentages
    const strategicMaturityPercent = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));
    const kompetensgapPercent = Math.min(100, Math.max(0, Math.round(100 - ((score / maxScore) * 100))));
    const aiReadinessPercent = strategicMaturityPercent;

    // 6) Google Sheets integration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = "Quiz Results!A:T";

    // Prepare row data matching exactly 20 columns (A through T)
    const rowData = [
      timestamp,                    // A: Timestamp
      industry,                     // B: Industry
      companySize,                  // C: Company Size
      Number(answers[1]) || 0,      // D: Q1 Score
      Number(answers[2]) || 0,      // E: Q2 Score
      Number(answers[3]) || 0,      // F: Q3 Score
      Number(answers[4]) || 0,      // G: Q4 Score
      Number(answers[5]) || 0,      // H: Q5 Score
      Number(answers[6]) || 0,      // I: Q6 Score
      Number(answers[7]) || 0,      // J: Q7 Score
      Number(answers[8]) || 0,      // K: Q8 Score
      Number(answers[9]) || 0,      // L: Q9 Score
      Number(answers[10]) || 0,     // M: Q10 Score
      score,                        // N: Total Score
      level,                        // O: Result Level
      strategicMaturityPercent,     // P: Strategic Maturity %
      kompetensgapPercent,         // Q: Competency Gap %
      aiReadinessPercent,          // R: AI-readiness %
      version,                      // S: Quiz Version
      strangeQ                      // T: Strange AI Question
    ];

    // 7) Write to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [rowData] },
    });

    // 8) Return result
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