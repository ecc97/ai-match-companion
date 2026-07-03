import { notFound } from "next/navigation";
import { FEATURED_TEAMS, COMPETITION_CODE } from "@/config/matches.config";
import { getTeam, getTeamRelevantMatch } from "@/lib/services/football-data";
import { generateMatchIntelligence } from "@/lib/services/groq";

export function generateStaticParams() {
    return FEATURED_TEAMS.map((t) => ({ slug: t.slug }));
}

export default async function TeamPage({ params }: PageProps<"/team/[slug]">) {
    const { slug } = await params;
    const teamConfig = FEATURED_TEAMS.find((t) => t.slug === slug);
    if (!teamConfig) notFound();

    const [team, result] = await Promise.all([
        getTeam(teamConfig.teamId),
        getTeamRelevantMatch(teamConfig.teamId, COMPETITION_CODE),
    ]);

    if (!result) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4">
                <p className="text-neutral-400">No hay partidos disponibles para {team.name}.</p>
            </main>
        );
    }

    const { match, type } = result;
    const opponent = match.homeTeam.id === teamConfig.teamId ? match.awayTeam : match.homeTeam;

    // Placeholder simple — el diseño final de este caso quedó pendiente
    if (type === "last-finished") {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 text-center text-white">
                <div>
                    <p className="text-neutral-400 mb-2">Último partido de {team.name}</p>
                    <h1 className="text-xl font-semibold">
                        {match.homeTeam.name} {match.score.fullTime.home} - {match.score.fullTime.away} {match.awayTeam.name}
                    </h1>
                </div>
            </main>
        );
    }

    const keyPlayers = team.squad
        .filter((p) => p.position === "Midfield" || p.position === "Offence")
        .slice(0, 5)
        .map((p) => p.name);

    const intelligence = await generateMatchIntelligence({
        homeTeam: team.name,
        awayTeam: opponent.name ?? "Rival por confirmar",
        homeKeyPlayers: keyPlayers,
        competition: match.competition.name,
        stage: match.stage,
    });

    return (
        <main className="min-h-screen bg-neutral-950 text-white px-4 py-8">
            <div className="max-w-md mx-auto space-y-4">
                <h1 className="text-lg font-bold text-center">
                    {match.homeTeam.name} vs {match.awayTeam.name}
                </h1>

                <section className="bg-neutral-900 rounded-xl p-4">
                    <p className="text-amber-400 text-sm font-semibold mb-1">🔥 Key battle</p>
                    <p>{intelligence.keyBattle}</p>
                </section>

                <section className="bg-neutral-900 rounded-xl p-4">
                    <p className="text-yellow-300 text-sm font-semibold mb-1">⭐ Player to watch</p>
                    <p>{intelligence.playerToWatch}</p>
                </section>

                <section className="bg-neutral-900 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-1">AI Story</p>
                    <p className="text-neutral-300">{intelligence.story}</p>
                </section>
            </div>
        </main>
    );
}