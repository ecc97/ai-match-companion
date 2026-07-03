export interface FeaturedTeam {
  teamId: number;
  slug: string;
  displayName: string;
  flagCode: string;
}

export const FEATURED_TEAMS: FeaturedTeam[] = [
  { teamId: 762, slug: "argentina", displayName: "Argentina", flagCode: "ar" },
  { teamId: 764, slug: "brazil", displayName: "Brasil", flagCode: "br" },
  { teamId: 818, slug: "colombia", displayName: "Colombia", flagCode: "co" },
  { teamId: 773, slug: "france", displayName: "Francia", flagCode: "fr" },
  { teamId: 769, slug: "mexico", displayName: "México", flagCode: "mx" },
  { teamId: 765, slug: "portugal", displayName: "Portugal", flagCode: "pt" },
  { teamId: 760, slug: "spain", displayName: "España", flagCode: "es" },
  { teamId: 761, slug: "paraguay", displayName: "Paraguay", flagCode: "py" },
  // Caso especial: gb-eng, no "gb" — confirmado con flagcdn/Flagpedia,
  // "gb" solo devolvería el Union Jack, no la bandera de Inglaterra.
  { teamId: 770, slug: "england", displayName: "Inglaterra", flagCode: "gb-eng" },
  { teamId: 771, slug: "usa", displayName: "Estados Unidos", flagCode: "us" },
  { teamId: 825, slug: "egypt", displayName: "Egipto", flagCode: "eg" },
  { teamId: 759, slug: "germany", displayName: "Alemania", flagCode: "de" },
];

export const COMPETITION_CODE = "WC";