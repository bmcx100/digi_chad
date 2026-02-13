import { createClient } from "@/lib/supabase/server"
import { TOURNAMENT_ID } from "@/lib/constants"
import { BracketView } from "@/components/bracket/BracketView"
import type { Game } from "@/lib/types"

export default async function BracketPage() {
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("name")
    .eq("id", TOURNAMENT_ID)
    .single()

  const { data: bracketGames } = await supabase
    .from("games")
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name, external_id),
      away_team:teams!games_away_team_id_fkey(id, name, external_id)
    `)
    .eq("tournament_id", TOURNAMENT_ID)
    .in("stage", ["semifinal", "final"])
    .order("start_datetime")

  const games = (bracketGames ?? []) as Game[]
  const semi1 = games.find((g) => g.stage === "semifinal" && g.game_number === "365") ?? null
  const semi2 = games.find((g) => g.stage === "semifinal" && g.game_number === "372") ?? null
  const finalGame = games.find((g) => g.stage === "final") ?? null

  return (
    <div className="bracket-page">
      <div className="bracket-header">
        <h1 className="bracket-title">{tournament?.name} — Bracket</h1>
      </div>

      <BracketView semi1={semi1} semi2={semi2} final={finalGame} />
    </div>
  )
}
