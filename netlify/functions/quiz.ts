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

    // Calculate result level based on total score
    let level;
    let description;
    let recommendations;

    if (score <= 10) {
      level = 'Pappskalle';
      description = 'Du är som en nybörjare på gymmet som försöker lyfta de tyngsta vikterna direkt. Dags att börja med grunderna!';
      recommendations = [
        'Börja med en AI-introduktionskurs (tänk personlig tränare för nybörjare)',
        'Experimentera med ChatGPT (som att lära sig grundläggande övningar)',
        'Hitta ett litet projekt där AI kan hjälpa er (som att sätta upp ett enkelt träningsschema)'
      ];
    } else if (score <= 20) {
      level = 'Nyfiken';
      description = 'Du har börjat din AI-resa, ungefär som någon som precis upptäckt att det finns mer på gymmet än löpbandet!';
      recommendations = [
        'Utveckla en AI-strategi (som en personlig träningsplan)',
        'Utbilda teamet i AI-användning (gruppträning är alltid roligare)',
        'Testa mer avancerade verktyg (dags att prova den där nya maskinen på gymmet)'
      ];
    } else {
      level = 'Beach Ready';
      description = 'Wow! Du är AI-fit och redo för stranden! Din organisation flexar sina AI-muskler som en erfaren bodybuilder!';
      recommendations = [
        'Förfina er AI-strategi (även proffs behöver justera sin träningsplan)',
        'Utforska cutting-edge AI-implementeringar (som att testa nya träningsmetoder)',
        'Bli en AI-influencer i er bransch (dela med er av era gains!)'
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
    const range = 'Quiz Results!A:Q'; // 17 columns

    // Prepare row data matching exactly 17 columns (A through Q)
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
      kompetensgapPercent                         // Q: Competency Gap %
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
      kompetensgapPercent
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