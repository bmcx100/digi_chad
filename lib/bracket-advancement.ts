import { SupabaseClient } from "@supabase/supabase-js"
import { calculateStandings } from "@/lib/standings-engine"
import type { Game, TiebreakerRule } from "@/lib/types"

export async function advanceBracket(
  gameId: string,
  tournamentId: string,
  supabase: SupabaseClient
): Promise<void> {
  const { data: game } = await supabase
    .from("games")
    .select("id, stage, pool_id, home_team_id, away_team_id, final_score_home, final_score_away, overtime_winner_team_id, shootout_winner_team_id")
    .eq("id", gameId)
    .single()

  if (!game) return

  if (game.stage === "pool_play") {
    await advancePoolToSemifinals(tournamentId, supabase)
  } else if (game.stage === "semifinal") {
    await advanceSemifinalToFinal(game, tournamentId, supabase)
  }
}

async function advancePoolToSemifinals(
  tournamentId: string,
  supabase: SupabaseClient
): Promise<void> {
  const { data: poolGames } = await supabase
    .from("games")
    .select("*")
    .eq("tournament_id", tournamentId)
    .eq("stage", "pool_play")

  const allCompleted = (poolGames ?? []).every((g) => g.status === "completed")
  if (!allCompleted) return

  const { data: semis } = await supabase
    .from("games")
    .select("id, home_team_id, away_team_id, home_placeholder, away_placeholder")
    .eq("tournament_id", tournamentId)
    .eq("stage", "semifinal")

  const needsAdvancement = (semis ?? []).some(
    (g) => !g.home_team_id || !g.away_team_id
  )
  if (!needsAdvancement) return

  const { data: tournament } = await supabase
    .from("tournaments")
    .select("goal_differential_cap")
    .eq("id", tournamentId)
    .single()

  const { data: pools } = await supabase
    .from("pools")
    .select("id, name, advancement_count")
    .eq("tournament_id", tournamentId)

  const { data: poolTeamsData } = await supabase
    .from("pool_teams")
    .select("pool_id, team_id, teams(id, name)")
    .in("pool_id", (pools ?? []).map((p) => p.id))

  const { data: tiebreakerRules } = await supabase
    .from("tiebreaker_rules")
    .select("*")
    .eq("tournament_id", tournamentId)
    .order("priority_order")

  const { data: pointStructure } = await supabase
    .from("tournament_point_structure")
    .select("win_points, tie_points, loss_points")
    .eq("tournament_id", tournamentId)
    .single()

  const goalDiffCap = tournament?.goal_differential_cap ?? 5
  const pts = pointStructure ?? { win_points: 2, tie_points: 1, loss_points: 0 }

  const standingsMap = new Map<string, { teamId: string; teamName: string }[]>()
  for (const pool of pools ?? []) {
    const teamsInPool = (poolTeamsData ?? [])
      .filter((pt) => pt.pool_id === pool.id)
      .map((pt) => {
        const team = pt.teams as unknown as { id: string; name: string }
        return { teamId: team.id, teamName: team.name }
      })

    const standings = calculateStandings(
      teamsInPool,
      (poolGames ?? []).filter((g) => g.pool_id === pool.id) as Game[],
      (tiebreakerRules ?? []) as TiebreakerRule[],
      pts,
      goalDiffCap
    )

    standingsMap.set(
      `Pool ${pool.name}`,
      standings.map((s) => ({ teamId: s.teamId, teamName: s.teamName }))
    )
  }

  const placeholderPattern = /^(1st|2nd|3rd|4th)\s+(.+)$/i

  for (const semi of semis ?? []) {
    const update: Record<string, string> = {}

    if (!semi.home_team_id && semi.home_placeholder) {
      const match = semi.home_placeholder.match(placeholderPattern)
      if (match) {
        const rank = ["1st", "2nd", "3rd", "4th"].indexOf(match[1].toLowerCase())
        const poolTeams = standingsMap.get(match[2])
        if (poolTeams && rank >= 0 && rank < poolTeams.length) {
          update.home_team_id = poolTeams[rank].teamId
        }
      }
    }

    if (!semi.away_team_id && semi.away_placeholder) {
      const match = semi.away_placeholder.match(placeholderPattern)
      if (match) {
        const rank = ["1st", "2nd", "3rd", "4th"].indexOf(match[1].toLowerCase())
        const poolTeams = standingsMap.get(match[2])
        if (poolTeams && rank >= 0 && rank < poolTeams.length) {
          update.away_team_id = poolTeams[rank].teamId
        }
      }
    }

    if (Object.keys(update).length > 0) {
      await supabase.from("games").update(update).eq("id", semi.id)
    }
  }
}

async function advanceSemifinalToFinal(
  semi: { id: string; home_team_id: string | null; away_team_id: string | null; final_score_home: number | null; final_score_away: number | null; overtime_winner_team_id: string | null; shootout_winner_team_id: string | null },
  tournamentId: string,
  supabase: SupabaseClient
): Promise<void> {
  const winnerId = getWinnerId(semi)
  if (!winnerId) return

  const { data: finalGame } = await supabase
    .from("games")
    .select("id, home_team_id, away_team_id, bracket_source_game_1_id, bracket_source_game_2_id")
    .eq("tournament_id", tournamentId)
    .eq("stage", "final")
    .single()

  if (!finalGame) return

  const update: Record<string, string> = {}

  if (finalGame.bracket_source_game_1_id === semi.id && !finalGame.home_team_id) {
    update.home_team_id = winnerId
  }
  if (finalGame.bracket_source_game_2_id === semi.id && !finalGame.away_team_id) {
    update.away_team_id = winnerId
  }

  if (Object.keys(update).length > 0) {
    await supabase.from("games").update(update).eq("id", finalGame.id)
  }
}

function getWinnerId(game: {
  home_team_id: string | null
  away_team_id: string | null
  final_score_home: number | null
  final_score_away: number | null
  overtime_winner_team_id: string | null
  shootout_winner_team_id: string | null
}): string | null {
  if (game.overtime_winner_team_id) return game.overtime_winner_team_id
  if (game.shootout_winner_team_id) return game.shootout_winner_team_id
  if (
    game.final_score_home != null &&
    game.final_score_away != null &&
    game.home_team_id &&
    game.away_team_id
  ) {
    return game.final_score_home > game.final_score_away
      ? game.home_team_id
      : game.away_team_id
  }
  return null
}
