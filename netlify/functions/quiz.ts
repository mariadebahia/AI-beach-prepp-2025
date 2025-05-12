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

  // Endast POST tillåtet här
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // 2) Läs in payload
    const data = JSON.parse(event.body || "{}");

    // Fallback om data.numericAnswers eller data.answers saknas
    const answers: Record<string, number> =
      data.numericAnswers ?? data.answers ?? {};

    // Säkerställ att vi har siffror
    const score       = Number(data.totalScore) || 0;
    const maxScore    = Number(data.maxScore)   || 1;
    const industry    = data.industry           || "";
    const companySize = data.companySize        || "";
    const strangeQ    = data.strangeAIQuestion  || "";
    const version     = data.quiz_version       || "";
    const timestamp   = data.timestamp          || new Date().toISOString();

    // 3) Resultat
