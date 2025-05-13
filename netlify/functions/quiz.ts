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
    const aiReadinessPercent = Math.min(100, Math.max(0, Math.round((score / maxScore) * 100))) || 0;

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
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('Error processing quiz submission:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};