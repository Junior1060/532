/**
 * Maps a 2026 World Cup team name to its flag emoji.
 * Keys match the team-name strings used in `src/data/cities.ts`.
 * Returns "" for bracket placeholders (e.g. "Winners Group I", "Third place",
 * "Winner R32") so the UI simply shows no flag for not-yet-decided slots.
 */
const TEAM_FLAGS: Record<string, string> = {
  // Group A
  Mexico: "🇲🇽",
  "South Korea": "🇰🇷",
  Czechia: "🇨🇿",
  "South Africa": "🇿🇦",
  // Group B
  Switzerland: "🇨🇭",
  Canada: "🇨🇦",
  Qatar: "🇶🇦",
  "Bosnia & Herzegovina": "🇧🇦",
  // Group C
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  // Group D
  USA: "🇺🇸",
  Turkey: "🇹🇷",
  Australia: "🇦🇺",
  Paraguay: "🇵🇾",
  // Group E
  Germany: "🇩🇪",
  Ecuador: "🇪🇨",
  "Ivory Coast": "🇨🇮",
  "Curaçao": "🇨🇼",
  // Group F
  Netherlands: "🇳🇱",
  Japan: "🇯🇵",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
  // Group G
  Belgium: "🇧🇪",
  Egypt: "🇪🇬",
  Iran: "🇮🇷",
  "New Zealand": "🇳🇿",
  // Group H
  Spain: "🇪🇸",
  "Cape Verde": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  Uruguay: "🇺🇾",
  // Group I
  France: "🇫🇷",
  Senegal: "🇸🇳",
  Iraq: "🇮🇶",
  Norway: "🇳🇴",
  // Group J
  Argentina: "🇦🇷",
  Algeria: "🇩🇿",
  Austria: "🇦🇹",
  Jordan: "🇯🇴",
  // Group K
  Portugal: "🇵🇹",
  "DR Congo": "🇨🇩",
  Uzbekistan: "🇺🇿",
  Colombia: "🇨🇴",
  // Group L
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  Croatia: "🇭🇷",
  Ghana: "🇬🇭",
  Panama: "🇵🇦",
};

/** Flag emoji for a team, or "" if the name is a placeholder/unknown. */
export function teamFlag(team: string): string {
  return TEAM_FLAGS[team] ?? "";
}
