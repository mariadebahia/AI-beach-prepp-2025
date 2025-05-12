import { Handler } from "@netlify/functions";
import { google } from "googleapis";

export const handler: Handler = async (event) => {
  // 1) CORS-preflight
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

  try {
    // 2) Read payload
    const data = JSON.parse(event.body || "{}");
    // FALLBACK for numericAnswers → always an object
    const answers: Record<string, number> =
      data.numericAnswers ?? data.answers ?? {};

    // Other fields with safe default values
    const industry: string           = data.industry           || "";
    const companySize: string        = data.companySize        || "";
    const strangeAIQuestion: string  = data.strangeAIQuestion  || "";
    const totalScore: number         = Number(data.totalScore) || 0;
    const maxScore: number           = Number(data.maxScore)   || 0;
    const quizVersion: string        = data.quiz_version       || "";
    const timestamp: string          = data.timestamp          || new Date().toISOString();

    // 3) Build row DYNAMICALLY for Q1-Q10
    const row = [
      timestamp,       // A
      industry,        // B
      companySize,     // C
      // D-M = Q1-Q10
      ...Array.from({ length: 10 }, (_, i) => Number(answers[String(i+1)] ?? 0)),
      totalScore,      // N
      maxScore,        // O
      quizVersion,     // P
      strangeAIQuestion// Q
    ];

    // 4) Authenticate and write to Sheets
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID!,
      range: "Quiz Results!A:Q",
      valueInputOption: "RAW",
      requestBody: { values: [row] },
    });

    // 5) Send back success response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true }),
    };

  } catch (err: any) {
    console.error("Error processing quiz submission:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};