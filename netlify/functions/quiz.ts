<<<<<<< HEAD
import { Handler } from '@netlify/functions';
import { google } from 'googleapis';

interface QuizPayload {
  answers: Record<string, number>;
  totalScore: number;
  maxScore: number;
  timestamp: string;
  quiz_version: string;
  industry?: string;
  companySize?: string;
  strangeAIQuestion?: string;
}

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
=======
import { Handler } from "@netlify/functions";
import { google } from "googleapis";

export const handler: Handler = async (event) => {
  // CORS-preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
>>>>>>> vodka-redbull
    };
  }

  try {
<<<<<<< HEAD
<<<<<<< HEAD
    const payload: QuizPayload = JSON.parse(event.body || '{}');
    const { totalScore, answers, industry, companySize, strangeAIQuestion } = payload;
=======
    // 2) Läs in payload
=======
    // Parse payload
>>>>>>> vodka-redbull
    const data = JSON.parse(event.body || "{}");

    // Fallback if data.numericAnswers or data.answers is missing
    const answers: Record<string, number> = data.numericAnswers ?? data.answers ?? {};

    // Ensure numeric values
    const score = Number(data.totalScore) || 0;
    const maxScore = Number(data.maxScore) || 1;
    const industry = data.industry || "";
    const companySize = data.companySize || "";
    const strangeQ = data.strangeAIQuestion || "";
    const version = data.quiz_version || "";
    const timestamp = data.timestamp || new Date().toISOString();
>>>>>>> vodka-redbull

    // Calculate result level based on total score
    let level;
    let description;
    let recommendations;

<<<<<<< HEAD
    if (totalScore <= 10) {
=======
    if (score <= 10) {
>>>>>>> vodka-redbull
      level = 'Pappskalle';
      description = 'Du är som en nybörjare på gymmet som försöker lyfta de tyngsta vikterna direkt. Dags att börja med grunderna!';
      recommendations = [
        'Börja med en AI-introduktionskurs (tänk personlig tränare för nybörjare)',
        'Experimentera med ChatGPT (som att lära sig grundläggande övningar)',
        'Hitta ett litet projekt där AI kan hjälpa er (som att sätta upp ett enkelt träningsschema)'
      ];
<<<<<<< HEAD
    } else if (totalScore <= 20) {
=======
    } else if (score <= 20) {
>>>>>>> vodka-redbull
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

<<<<<<< HEAD
    // Calculate percentages with safeguards
    const maxScore = payload.maxScore || 1; // Safeguard against division by zero
    const strategicMaturityPercent = Math.min(100, Math.max(0, Math.round((totalScore / maxScore) * 100))) || 0;
    const kompetensgapPercent = Math.min(100, Math.max(0, Math.round(100 - ((totalScore / maxScore) * 100)))) || 0;
    const aiReadinessPercent = Math.min(100, Math.max(0, Math.round((totalScore / maxScore) * 100))) || 0;

    // Google Sheets Integration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const sheetName = 'Quiz Results';
    const range = `${sheetName}!A:T`; // Updated range for 20 columns

    // Prepare row data matching exactly 20 columns
    const rowData = [
      new Date(payload.timestamp).toISOString(),    // 1. Timestamp
      industry || '',                               // 2. Industry
      companySize || '',                            // 3. Company Size
      Number(answers[1]) || 0,                      // 4. Q1 Score
      Number(answers[2]) || 0,                      // 5. Q2 Score
      Number(answers[3]) || 0,                      // 6. Q3 Score
      Number(answers[4]) || 0,                      // 7. Q4 Score
      Number(answers[5]) || 0,                      // 8. Q5 Score
      Number(answers[6]) || 0,                      // 9. Q6 Score
      Number(answers[7]) || 0,                      // 10. Q7 Score
      Number(answers[8]) || 0,                      // 11. Q8 Score
      Number(answers[9]) || 0,                      // 12. Q9 Score
      Number(answers[10]) || 0,                     // 13. Q10 Score
      Number(totalScore) || 0,                      // 14. Total Score
      level || 'Nyfiken',                          // 15. Result Level
      strategicMaturityPercent,                     // 16. Strategic Maturity %
      kompetensgapPercent,                         // 17. Competency Gap %
      aiReadinessPercent,                          // 18. AI-readiness %
      payload.quiz_version || '1.0',                // 19. Quiz Version
      strangeAIQuestion || '',                      // 20. Strange AI Question
    ];

    // Debug logging for Sheets API call
    console.log('Debugging Sheets Append Request:');
    console.log('spreadsheetId:', spreadsheetId);
    console.log('range:', range);
    console.log('values being sent:', [rowData]); // Log the [rowData] structure
    console.log('rowData content:', rowData); // Log the content of the rowData array

    // Append the row to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [rowData],
      },
    });

    console.log('Quiz data successfully logged to Google Sheet');
=======
    // Calculate percentages
    const strategicMaturityPercent = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100))) || 0;
    const kompetensgapPercent = Math.min(100, Math.max(0, Math.round(100 - ((score / maxScore) * 100)))) || 0;
    const aiReadinessPercent = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100))) || 0;
>>>>>>> vodka-redbull

    // Google Sheets Integration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    const range = 'Quiz Results!A:T';

    // Prepare row data
    const rowData = [
      timestamp,                                    // A: Timestamp
      industry,                                     // B: Industry
      companySize,                                 // C: Company Size
      ...Array.from({ length: 10 }, (_, i) =>      // D-M: Q1-Q10 Scores
        Number(answers[String(i + 1)] ?? 0)
      ),
      score,                                       // N: Total Score
      level,                                       // O: Result Level
      strategicMaturityPercent,                    // P: Strategic Maturity %
      kompetensgapPercent,                        // Q: Competency Gap %
      aiReadinessPercent,                         // R: AI-readiness %
      version,                                     // S: Quiz Version
      strangeQ,                                    // T: Strange AI Question
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
      level,
      description,
      recommendations,
      comparative_statement: `Du ligger bättre till än ${Math.floor(Math.random() * 30) + 60}% av alla som tagit testet!`,
      strategicMaturityPercent,
      kompetensgapPercent,
      aiReadinessPercent
    };

    return {
      statusCode: 200,
      headers: {
<<<<<<< HEAD
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response),
    };
=======
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response),
    };

>>>>>>> vodka-redbull
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    return {
      statusCode: 500,
      headers: {
<<<<<<< HEAD
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
=======
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Internal server error" }),
>>>>>>> vodka-redbull
    };
  }
};