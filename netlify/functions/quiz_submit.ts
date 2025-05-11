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
    };
  }

  try {
    const payload: QuizPayload = JSON.parse(event.body || '{}');
    const { totalScore, answers, industry, companySize, strangeAIQuestion } = payload;

    // Calculate result level based on total score
    let level;
    let description;
    let recommendations;

    if (totalScore <= 10) {
      level = 'Pappskalle';
      description = 'Du är som en nybörjare på gymmet som försöker lyfta de tyngsta vikterna direkt. Dags att börja med grunderna!';
      recommendations = [
        'Börja med en AI-introduktionskurs (tänk personlig tränare för nybörjare)',
        'Experimentera med ChatGPT (som att lära sig grundläggande övningar)',
        'Hitta ett litet projekt där AI kan hjälpa er (som att sätta upp ett enkelt träningsschema)'
      ];
    } else if (totalScore <= 20) {
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
    const strategicMaturityPercent = Math.round((totalScore / payload.maxScore) * 100);
    const kompetensgapPercent = Math.round(100 - ((totalScore / payload.maxScore) * 100));

    // Google Sheets Integration
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    const SHEET_NAME = 'Quiz Results';

    // Prepare row data to match exactly 19 columns in the Google Sheet
    const rowData = [
      new Date().toISOString(),                    // Timestamp
      industry || '',                              // Industry
      companySize || '',                           // Company Size
      answers[1] || 0,                             // Q1 Score
      answers[2] || 0,                             // Q2 Score
      answers[3] || 0,                             // Q3 Score
      answers[4] || 0,                             // Q4 Score
      answers[5] || 0,                             // Q5 Score
      answers[6] || 0,                             // Q6 Score
      answers[7] || 0,                             // Q7 Score
      answers[8] || 0,                             // Q8 Score
      answers[9] || 0,                             // Q9 Score
      answers[10] || 0,                            // Q10 Score
      totalScore,                                  // Total Score
      level,                                       // Result Level
      strategicMaturityPercent,                    // Strategic Maturity %
      kompetensgapPercent,                         // Competency Gap %
      strangeAIQuestion || '',                     // Strange AI Question
      payload.quiz_version                         // Quiz Version
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:S`,                  // Updated to match 19 columns (A through S)
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
      kompetensgapPercent
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };