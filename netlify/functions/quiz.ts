import { Handler } from "@netlify/functions";
import { google } from "googleapis";

export const handler: Handler = async (event) => {
  // 1) CORS‐preflight
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
    // 2) Läs in payload
    const data = JSON.parse(event.body || "{}");
    const answers: Record<string, number> =
      data.numericAnswers ?? data.answers ?? {};

    // Övriga fält med säkra default‐värden
    const industry          = data.industry          || "";
    const companySize       = data.companySize       || "";
    const strangeAIQuestion = data.strangeAIQuestion || "";
    const totalScore        = Number(data.totalScore) || 0;
    const maxScore          = Number(data.maxScore)   || 0;
    const quizVersion       = data.quiz_version      || "";
    const timestamp         = data.timestamp         || new Date().toISOString();

    // 3) Bygg raden dynamiskt för Q1–Q10
    const row = [
      timestamp,
      industry,
      companySize,
      ...Array.from({ length: 10 }, (_, i) => Number(answers[String(i + 1)] ?? 0)),
      totalScore,
      maxScore,
      quizVersion,
      strangeAIQuestion,
    ];

    // 4) Autentisera och skriv till Google Sheets
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

    // 5) Skicka tillbaka succé
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
