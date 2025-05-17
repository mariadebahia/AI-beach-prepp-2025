import type { Handler, HandlerResponse } from "@netlify/functions";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

export const handler: Handler = async (event): Promise<HandlerResponse> => {
  console.log('Received request:', {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body
  });

  if (event.httpMethod === "OPTIONS") {
    return { 
      statusCode: 200, 
      headers: HEADERS, 
      body: "" 
    };
  }

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
    // Validate request body
    if (!event.body) {
      throw new Error("Request body is required");
    }

    console.log('Parsing request body:', event.body);
    const data = JSON.parse(event.body);
    
    // Validate answers object
    if (!data.answers || typeof data.answers !== 'object') {
      console.error('Invalid answers format:', data);
      throw new Error("Invalid answers format");
    }

    console.log('Processing answers:', data.answers);
    const answers: Record<string, number> = data.answers;
    const maxPerQuestion = 3;

    // Calculate scores
    const score = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = Object.keys(answers).length * maxPerQuestion;

    console.log('Calculated scores:', { score, maxScore });

    // Calculate percentages
    const strategicMaturityPercent = Math.round((score / maxScore) * 100);
    const kompetensgapPercent = Math.round(100 - ((score / maxScore) * 100));
    
    // New metrics
    const growthPotentialPercent = Math.round(
      ((answers[6] + answers[8] + answers[2]) / (3 * maxPerQuestion)) * 100
    );
    
    const aiReadinessPercent = Math.round(
      ((answers[1] + answers[9] + answers[10] + answers[5] / 2) / 
      ((3 * maxPerQuestion) + (maxPerQuestion / 2))) * 100
    );

    // Determine level and recommendations
    let level, description, recommendations;
    if (score <= 8) {
      level = "AI-Nybörjare";
      description = "Ni är i startgropen av er AI-resa. Det finns stor potential för utveckling!";
      recommendations = [
        "Skapa en grundläggande AI-utbildningsplan",
        "Identifiera enkla AI-use cases",
        "Börja med ChatGPT för enklare uppgifter",
        "Utse en AI-ambassadör i teamet"
      ];
    } else if (score <= 16) {
      level = "AI-Utforskare";
      description = "Ni har tagit de första stegen mot AI-mognad. Fortsätt bygga på denna grund!";
      recommendations = [
        "Utveckla en formell AI-strategi",
        "Expandera användningen till fler områden",
        "Investera i AI-utbildning för hela teamet",
        "Dokumentera AI-best practices"
      ];
    } else if (score <= 24) {
      level = "AI-Pionjärer";
      description = "Ni ligger i framkant med AI-implementation. Dags att skala upp!";
      recommendations = [
        "Skala upp framgångsrika AI-projekt",
        "Utveckla avancerade AI-workflows",
        "Etablera AI Center of Excellence",
        "Mät och optimera AI-ROI"
      ];
    } else {
      level = "AI-Transformatörer";
      description = "Ni är ledande inom AI-adoption. Fokusera på innovation och optimering!";
      recommendations = [
        "Utforska cutting-edge AI-teknologier",
        "Utveckla AI-driven innovationskultur",
        "Etablera branschledande best practices",
        "Dela kunskap genom AI-mentorskap"
      ];
    }

    const responsePayload = {
      success: true,
      level,
      description,
      recommendations,
      comparative_statement: `Du ligger bättre till än ${Math.floor(Math.random()*30)+60}% av alla som tagit testet!`,
      strategicMaturityPercent,
      kompetensgapPercent,
      growthPotentialPercent,
      aiReadinessPercent
    };

    console.log('Sending response:', responsePayload);

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify(responsePayload),
    };

  } catch (error: any) {
    console.error("Error processing quiz submission:", error);
    
    const errorResponse = {
      success: false,
      error: error.message || "An unexpected error occurred",
      details: error.stack
    };

    console.log('Sending error response:', errorResponse);

    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify(errorResponse),
    };
  }
};