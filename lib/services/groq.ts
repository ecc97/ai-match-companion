import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export interface MatchIntelligence {
    keyBattlePlayer: string;
    keyBattleContext: string;
    playerToWatch: string;
    playerToWatchReason: string;
    story: string;
}

export async function generateMatchIntelligence(context: {
    homeTeam: string;
    awayTeam: string;
    homeKeyPlayers: string[];
    competition: string;
    stage: string;
}): Promise<MatchIntelligence> {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content:
                    "Eres un periodista deportivo experto. Respondes SOLO en JSON válido, sin texto adicional ni markdown.",
            },
            {
                role: "user",
                content: `Partido: ${context.homeTeam} vs ${context.awayTeam}.
Competencia: ${context.competition}, fase: ${context.stage}.
Jugadores clave de ${context.homeTeam}: ${context.homeKeyPlayers.join(", ")}.

Genera un JSON con estas claves exactas:
{
  "keyBattlePlayer": "nombre de UN jugador de ${context.homeTeam} de la lista dada",
  "keyBattleContext": "descripción corta (máx 5 palabras) del reto que enfrenta, ej: 'mediocampo brasileño'",
  "playerToWatch": "nombre del jugador más determinante de ${context.homeTeam}",
  "playerToWatchReason": "una frase corta (máx 12 palabras) explicando por qué",
  "story": "por qué este partido importa, 2-3 frases, tono narrativo"
}`,
            },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Groq no devolvió contenido");
    return JSON.parse(raw) as MatchIntelligence;
}