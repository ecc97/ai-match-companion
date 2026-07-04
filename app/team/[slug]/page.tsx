import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { FEATURED_TEAMS, COMPETITION_CODE } from "@/config/matches.config";
import { getTeam, getTeamRelevantMatch } from "@/lib/services/football-data";
import { generateMatchIntelligence } from "@/lib/services/groq";
import { MatchInsightsToggle } from "@/components/MatchInsightsToggle";
import { PlayerAvatar } from "@/components/PlayerAvatar";

export function generateStaticParams() {
    return FEATURED_TEAMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const teamConfig = FEATURED_TEAMS.find((t) => t.slug === slug);
    if (!teamConfig) return {};

    const title = `${teamConfig.displayName} — Análisis de Partidos con IA`;
    const description = `Análisis inteligente del próximo partido de ${teamConfig.displayName}. Descubre las claves tácticas, jugadores a seguir y predicciones generadas por IA.`;

    return {
        title: teamConfig.displayName,
        description,
        openGraph: {
            title,
            description,
            url: `/team/${slug}`,
            images: [
                {
                    url: `https://flagcdn.com/w80/${teamConfig.flagCode}.png`,
                    width: 80,
                    height: 60,
                    alt: `Bandera de ${teamConfig.displayName}`,
                },
            ],
        },
        twitter: {
            title,
            description,
        },
        alternates: {
            canonical: `/team/${slug}`,
        },
    };
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
            <main className="flex flex-col justify-center min-h-screen bg-teamMatchMain px-4 text-white">
                <p className="text-neutral-400">No hay partidos disponibles para {team.name}.</p>
            </main>
        );
    }

    const { match, type } = result;
    const opponent = match.homeTeam.id === teamConfig.teamId ? match.awayTeam : match.homeTeam;
    const isHome = match.homeTeam.id === teamConfig.teamId;

    if (type === "last-finished") {
        const teamScore = isHome ? match.score.fullTime.home : match.score.fullTime.away;
        const opponentScore = isHome ? match.score.fullTime.away : match.score.fullTime.home;
        const resultLabel =
            teamScore! > opponentScore! ? "Victoria" : teamScore! < opponentScore! ? "Derrota" : "Empate";
        const resultColor =
            teamScore! > opponentScore! ? "text-emerald-400" : teamScore! < opponentScore! ? "text-red-400" : "text-neutral-400";

        const finishedJsonLd = {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
            description: `Resultado del último partido de ${teamConfig.displayName}: ${match.homeTeam.name} ${teamScore} - ${opponentScore} ${match.awayTeam.name}`,
            sport: "Soccer",
            homeTeam: { "@type": "SportsTeam", name: match.homeTeam.name },
            awayTeam: { "@type": "SportsTeam", name: match.awayTeam.name },
            competitor: match.homeTeam.name,
            startDate: match.utcDate,
            location: { "@type": "StadiumOrArena", name: match.stage.replace("_", " ") },
        };

        return (
            <main className="flex flex-col justify-center min-h-screen bg-teamMatchMain text-white px-4 py-8">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(finishedJsonLd).replace(/</g, "\\u003c"),
                    }}
                />
                <div className="max-w-md mx-auto space-y-4">
                    <p className="text-center text-neutral-500 text-sm uppercase tracking-wide">
                        Sin partidos próximos programados
                    </p>

                    <div className="bg-neutral-900 rounded-2xl p-6 text-center space-y-3">
                        <p className={`text-sm font-semibold ${resultColor}`}>Último partido — {resultLabel}</p>
                        <div className="flex items-center justify-center gap-4">
                            <TeamCrest team={match.homeTeam} />
                            <span className="text-2xl font-bold">
                                {match.score.fullTime.home} - {match.score.fullTime.away}
                            </span>
                            <TeamCrest team={match.awayTeam} />
                        </div>
                        <p className="text-neutral-400 text-sm">
                            {match.stage.replace("_", " ")} · {match.competition.name}
                        </p>
                    </div>
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

    const matchJsonLd = {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        description: `Análisis IA del partido de ${teamConfig.displayName}: ${match.homeTeam.name} vs ${match.awayTeam.name}. Descubre jugadores clave, tácticas y predicciones.`,
        sport: "Soccer",
        homeTeam: { "@type": "SportsTeam", name: match.homeTeam.name },
        awayTeam: { "@type": "SportsTeam", name: match.awayTeam.name },
        startDate: match.utcDate,
        location: { "@type": "StadiumOrArena", name: match.stage.replace("_", " ") },
    };

    return (
        <main className="flex flex-col justify-center min-h-screen bg-teamMatchMain text-white px-4 py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(matchJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            <div className="max-w-md mx-auto space-y-4">
                <div className="flex items-center justify-center gap-4">
                    <TeamCrest team={match.homeTeam} />
                    <span className="text-neutral-500 text-sm">vs</span>
                    <TeamCrest team={match.awayTeam} />
                </div>

                <div className="bg-gradient-to-r from-blue-900/40 to-neutral-900 rounded-2xl px-4 py-3 text-center">
                    <p className="text-[11px] tracking-widest text-neutral-400 uppercase mb-1">
                        Match Intelligence
                    </p>
                    <h1 className="text-lg font-bold uppercase">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                    </h1>
                </div>

                <section className="bg-neutral-900 rounded-xl p-4">
                    <p className="text-amber-400 text-sm font-semibold mb-3">🔥 Key battle</p>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <PlayerAvatar name={intelligence.keyBattlePlayer} />
                            <span className="text-xs text-neutral-300">{intelligence.keyBattlePlayer}</span>
                        </div>
                        <span className="text-neutral-500 text-xs">vs</span>
                        <div className="flex flex-col items-center gap-1">
                            <TeamCrest team={opponent} />
                            <span className="text-xs text-neutral-300 text-center">{intelligence.keyBattleContext}</span>
                        </div>
                    </div>
                </section>

                <section className="bg-neutral-900 rounded-xl p-4 text-center">
                    <p className="text-yellow-300 text-sm font-semibold mb-3">
                        ⭐ Player to watch: {intelligence.playerToWatch}
                    </p>
                    <div className="flex justify-center mb-2">
                        <PlayerAvatar name={intelligence.playerToWatch} size={56} />
                    </div>
                    <p className="text-neutral-300 text-sm">{intelligence.playerToWatchReason}</p>
                </section>

                <section className="bg-neutral-900 rounded-xl p-4">
                    <p className="text-sm font-semibold mb-1">AI Story</p>
                    <p className="text-neutral-300">{intelligence.story}</p>
                </section>

                <MatchInsightsToggle squad={team.squad} />
            </div>
        </main>
    );
}

function TeamCrest({ team }: { team: { name: string | null; crest: string | null } }) {
    if (!team.crest) return <div className="w-10 h-10 bg-neutral-800 rounded-full" />;
    return (
        <Image
            src={team.crest}
            alt={team.name ?? "Equipo"}
            width={40}
            height={40}
            unoptimized
        />
    );
}