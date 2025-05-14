// netlify/functions/quiz.ts

import type { Handler, HandlerResponse } from "@netlify/functions";
import { google } from "googleapis";

<<<<<<< HEAD
export const handler: Handler = async (event): Promise<HandlerResponse> => {
  // common headers for all responses
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // 1) CORS preflight
=======
export const handler: Handler = async (event) => {
  // CORS-preflight
>>>>>>> vodka-redbull
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({}),  // must be JSON string
    };
  }

<<<<<<< HEAD
  // 2) Only POST allowed
=======
  // Only allow POST
>>>>>>> vodka-redbull
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
<<<<<<< HEAD
    // 3) Parse payload
=======
    // Parse payload
>>>>>>> vodka-redbull
    const data = JSON.parse(event.body || "{}");
    const answers: Record<string, number> = data.numericAnswers ?? data.answers ?? {};

<<<<<<< HEAD
    const score       = Number(data.totalScore) || 0;
    const maxScore    = Number(data.maxScore)   || 1;
    const industry    = data.industry           || "";
    const companySize = data.companySize        || "";
    const strangeQ    = data.strangeAIQuestion  || "";
    const version     = data.quiz_version       || "";
    const timestamp   = data.timestamp          || new Date().toISOString();
=======
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

    // Calculate result level based on total score
    let level;
    let description;
    let recommendations;
>>>>>>> vodka-redbull

    // 4) Compute level & text
    let level: string, description: string, recommendations: string[];
    if (score <= 10) {
      level = "Pappskalle";
      description = "Du är som en nybörjare på gymmet som försöker lyfta de tyngsta vikterna direkt. Dags att börja med grunderna!";
      recommendations = [ /* … */ ];
    } else if (score <= 20) {
      level = "Nyfiken";
      description = "Du har börjat din AI-resa, ungefär som någon som precis upptäckt att det finns mer på gymmet än löpbandet!";
      recommendations = [ /* … */ ];
    } else {
      level = "Beach Ready";
      description = "Wow! Du är AI-fit och redo för stranden! Din organisation flexar sina AI-muskler som en erfaren bodybuilder!";
      recommendations = [ /* … */ ];
    }

    // 5) Percentages
    const strategicMaturityPercent = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100)));
    const kompetensgapPercent       = Math.min(100, Math.max(0, Math.round(100 - (score / maxScore) * 100)));
    const aiReadinessPercent        = strategicMaturityPercent;

<<<<<<< HEAD
    // 6) Build row for Sheets
    const rowData = [
      timestamp, industry, companySize,
      ...Array.from({ length: 10 }, (_, i) => Number(answers[String(i + 1)] ?? 0)),
      score, level,
      strategicMaturityPercent,
      kompetensgapPercent,
      aiReadinessPercent,
      version, strangeQ,
    ];

    // 7) Append to Google Sheet
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
      range: "Quiz Results!A:T",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [rowData] },    // <— use `requestBody`, not `resource`
    });

    // 8) Return quiz result
    const responsePayload = {
      success: true,
=======
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
>>>>>>> vodka-redbull
      level,
      description,
      recommendations,
      comparative_statement: `Du ligger bättre till än ${Math.floor(Math.random() * 30) + 60}% av alla som tagit testet!`,
      strategicMaturityPercent,
      kompetensgapPercent,
      aiReadinessPercent,
    };
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responsePayload),
    };

  } catch (error: any) {
    console.error("Error processing quiz submission:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
