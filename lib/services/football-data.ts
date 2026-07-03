import type { Match, Team, TeamMatchesResponse } from "../types/match";

const BASE_URL = "https://api.football-data.org/v4";

async function fdFetch<T>(path: string, revalidateSeconds: number): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY! },
        next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) {
        throw new Error(`football-data.org error ${res.status} en ${path}`);
    }

    return res.json();
}

export async function getTeam(teamId: number): Promise<Team> {
    return fdFetch<Team>(`/teams/${teamId}`, 86400);
}

/**
 * CONFIRMADO EN CONVERSACIÓN PREVIA: el filtro de query usa "SCHEDULED",
 * aunque el campo `status` del objeto match devuelto sea "TIMED".
 * No cambiar a status=TIMED en el filtro — se probó y devuelve count: 0.
 */
export async function getTeamRelevantMatch(
    teamId: number,
    competitionCode: string
): Promise<{ match: Match; type: "upcoming" | "last-finished" } | null> {
    const upcoming = await fdFetch<TeamMatchesResponse>(
        `/teams/${teamId}/matches?status=SCHEDULED&competitions=${competitionCode}&limit=1`,
        3600
    );

    if (upcoming.matches.length > 0) {
        return { match: upcoming.matches[0], type: "upcoming" };
    }

    const finished = await fdFetch<TeamMatchesResponse>(
        `/teams/${teamId}/matches?status=FINISHED&competitions=${competitionCode}&limit=1`,
        21600
    );

    return finished.matches.length > 0
        ? { match: finished.matches[0], type: "last-finished" }
        : null;
}