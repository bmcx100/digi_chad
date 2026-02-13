import { createClient } from "@/lib/supabase/server"
import { TOURNAMENT_ID } from "@/lib/constants"
import { ScheduleWithScoreEntry } from "@/components/schedule/ScheduleWithScoreEntry"
import type { Game, Pool } from "@/lib/types"

export default async function SchedulePage() {
  const supabase = await createClient()

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("name, start_date, end_date")
    .eq("id", TOURNAMENT_ID)
    .single()

  const { data: pools } = await supabase
    .from("pools")
    .select("id, tournament_id, name, advancement_count")
    .eq("tournament_id", TOURNAMENT_ID)
    .order("name")

  const { data: games } = await supabase
    .from("games")
    .select(`
      *,
      home_team:teams!games_home_team_id_fkey(id, name, external_id, level, skill_level, division),
      away_team:teams!games_away_team_id_fkey(id, name, external_id, level, skill_level, division),
      pool:pools!games_pool_id_fkey(id, tournament_id, name, advancement_count)
    `)
    .eq("tournament_id", TOURNAMENT_ID)
    .order("start_datetime")

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h1 className="schedule-title">{tournament?.name}</h1>
        <p className="schedule-dates">
          {tournament?.start_date} to {tournament?.end_date}
        </p>
      </div>

      <ScheduleWithScoreEntry
        games={(games as Game[]) ?? []}
        pools={(pools as Pool[]) ?? []}
      />
    </div>
  )
}
