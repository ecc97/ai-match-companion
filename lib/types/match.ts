export interface MatchTeam {
    id: number | null;
    name: string | null;
    crest: string | null;
}

export interface Match {
    id: number;
    utcDate: string;
    status: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED";
    stage: string;
    group: string | null;
    competition: { id: number; name: string; code: string };
    homeTeam: MatchTeam;
    awayTeam: MatchTeam;
    score: {
        winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
        fullTime: { home: number | null; away: number | null };
    };
}

export interface TeamMatchesResponse {
    matches: Match[];
}

export interface TeamSquadPlayer {
    id: number;
    name: string;
    position: "Goalkeeper" | "Defence" | "Midfield" | "Offence";
    dateOfBirth: string;
    nationality: string;
}

export interface Team {
    id: number;
    name: string;
    crest: string;
    squad: TeamSquadPlayer[];
    lastUpdated: string;
}