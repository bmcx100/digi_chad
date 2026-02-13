import type { Game, TiebreakerRule } from "./types"

export interface TeamStanding {
  teamId: string
  teamName: string
  gp: number
  w: number
  l: number
  t: number
  pts: number
  gf: number
  ga: number
  gd: number
  pims: number
  fastestFirstGoal: number | null
  rank: number
  tiebreakerUsed: string | null
  coinTossNeeded: boolean
}

interface PointStructure {
  win_points: number
  tie_points: number
  loss_points: number
}

interface TeamStats {
  teamId: string
  teamName: string
  gp: number
  w: number
  l: number
  t: number
  pts: number
  gf: number
  ga: number
  gd: number
  pims: number
  fastestFirstGoal: number | null
  gameResults: GameResult[]
}

interface GameResult {
  gameId: string
  opponentId: string
  goalsFor: number
  goalsAgainst: number
  gdCapped: number
}

/**
 * Calculate pool standings from completed games.
 */
export function calculateStandings(
  poolTeams: { teamId: string; teamName: string }[],
  games: Game[],
  tiebreakerRules: TiebreakerRule[],
  pointStructure: PointStructure,
  goalDiffCap: number
): TeamStanding[] {
  const completedGames = games.filter((g) => g.status === "completed")

  // Build stats for each team
  const statsMap = new Map<string, TeamStats>()
  for (const pt of poolTeams) {
    statsMap.set(pt.teamId, {
      teamId: pt.teamId,
      teamName: pt.teamName,
      gp: 0,
      w: 0,
      l: 0,
      t: 0,
      pts: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pims: 0,
      fastestFirstGoal: null,
      gameResults: [],
    })
  }

  for (const game of completedGames) {
    if (
      game.final_score_home == null ||
      game.final_score_away == null ||
      !game.home_team_id ||
      !game.away_team_id
    )
      continue

    const homeStats = statsMap.get(game.home_team_id)
    const awayStats = statsMap.get(game.away_team_id)

    const homeGoals = game.final_score_home
    const awayGoals = game.final_score_away
    const homeDiffRaw = homeGoals - awayGoals
    const awayDiffRaw = awayGoals - homeGoals
    const homeGdCapped = homeDiffRaw > 0 ? Math.min(homeDiffRaw, goalDiffCap) : homeDiffRaw
    const awayGdCapped = awayDiffRaw > 0 ? Math.min(awayDiffRaw, goalDiffCap) : awayDiffRaw

    if (homeStats) {
      homeStats.gp++
      homeStats.gf += homeGoals
      homeStats.ga += awayGoals
      homeStats.gd += homeGdCapped
      if (game.penalty_minutes_home != null)
        homeStats.pims += game.penalty_minutes_home
      if (game.fastest_goal_seconds_home != null) {
        if (
          homeStats.fastestFirstGoal === null ||
          game.fastest_goal_seconds_home < homeStats.fastestFirstGoal
        ) {
          homeStats.fastestFirstGoal = game.fastest_goal_seconds_home
        }
      }
      homeStats.gameResults.push({
        gameId: game.id,
        opponentId: game.away_team_id,
        goalsFor: homeGoals,
        goalsAgainst: awayGoals,
        gdCapped: homeGdCapped,
      })

      if (homeGoals > awayGoals) {
        homeStats.w++
        homeStats.pts += pointStructure.win_points
      } else if (homeGoals < awayGoals) {
        homeStats.l++
        homeStats.pts += pointStructure.loss_points
      } else {
        homeStats.t++
        homeStats.pts += pointStructure.tie_points
      }
    }

    if (awayStats) {
      awayStats.gp++
      awayStats.gf += awayGoals
      awayStats.ga += homeGoals
      awayStats.gd += awayGdCapped
      if (game.penalty_minutes_away != null)
        awayStats.pims += game.penalty_minutes_away
      if (game.fastest_goal_seconds_away != null) {
        if (
          awayStats.fastestFirstGoal === null ||
          game.fastest_goal_seconds_away < awayStats.fastestFirstGoal
        ) {
          awayStats.fastestFirstGoal = game.fastest_goal_seconds_away
        }
      }
      awayStats.gameResults.push({
        gameId: game.id,
        opponentId: game.home_team_id,
        goalsFor: awayGoals,
        goalsAgainst: homeGoals,
        gdCapped: awayGdCapped,
      })

      if (awayGoals > homeGoals) {
        awayStats.w++
        awayStats.pts += pointStructure.win_points
      } else if (awayGoals < homeGoals) {
        awayStats.l++
        awayStats.pts += pointStructure.loss_points
      } else {
        awayStats.t++
        awayStats.pts += pointStructure.tie_points
      }
    }
  }

  const allStats = Array.from(statsMap.values())
  const sortedRules = [...tiebreakerRules].sort(
    (a, b) => a.priority_order - b.priority_order
  )

  return rankTeams(allStats, sortedRules)
}

/**
 * Rank teams by points, then apply tiebreakers to groups with equal points.
 */
function rankTeams(
  teams: TeamStats[],
  rules: TiebreakerRule[]
): TeamStanding[] {
  // Group by points (descending)
  const groups = groupBy(teams, (t) => t.pts)
  const sortedPointGroups = [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([, g]) => g)

  const ranked: TeamStanding[] = []
  let currentRank = 1

  for (const group of sortedPointGroups) {
    if (group.length === 1) {
      ranked.push(toStanding(group[0], currentRank, null, false))
      currentRank++
    } else {
      const resolved = resolveGroup(group, rules, 0)
      for (const entry of resolved) {
        ranked.push(
          toStanding(entry.team, currentRank, entry.tiebreakerUsed, entry.coinTossNeeded)
        )
        currentRank++
      }
    }
  }

  return ranked
}

interface ResolvedEntry {
  team: TeamStats
  tiebreakerUsed: string | null
  coinTossNeeded: boolean
}

/**
 * Recursively resolve a group of tied teams using tiebreaker rules.
 * Critical: once a rule separates teams, it cannot be reused for remaining tied teams.
 */
function resolveGroup(
  tiedTeams: TeamStats[],
  rules: TiebreakerRule[],
  ruleIndex: number
): ResolvedEntry[] {
  if (tiedTeams.length <= 1) {
    return tiedTeams.map((t) => ({
      team: t,
      tiebreakerUsed: null,
      coinTossNeeded: false,
    }))
  }

  if (ruleIndex >= rules.length) {
    // Unresolvable — coin toss needed
    return tiedTeams.map((t) => ({
      team: t,
      tiebreakerUsed: "Coin Toss",
      coinTossNeeded: true,
    }))
  }

  const rule = rules[ruleIndex]

  // Head-to-head only applies when exactly 2 teams tied
  if (
    rule.rule_type === "simple" &&
    rule.simple_stat === "head_to_head" &&
    rule.head_to_head_max_teams != null &&
    tiedTeams.length > rule.head_to_head_max_teams
  ) {
    return resolveGroup(tiedTeams, rules, ruleIndex + 1)
  }

  const subgroups = applyRule(tiedTeams, rule)

  // Check if the rule actually separated anyone
  if (subgroups.length === 1 && subgroups[0].length === tiedTeams.length) {
    // No separation — skip to next rule
    return resolveGroup(tiedTeams, rules, ruleIndex + 1)
  }

  const result: ResolvedEntry[] = []
  for (const subgroup of subgroups) {
    if (subgroup.length === 1) {
      result.push({
        team: subgroup[0],
        tiebreakerUsed: rule.description ?? null,
        coinTossNeeded: false,
      })
    } else {
      // CRITICAL: skip to NEXT rule, do NOT reuse current rule
      result.push(...resolveGroup(subgroup, rules, ruleIndex + 1))
    }
  }

  return result
}

/**
 * Apply a single tiebreaker rule to a group of teams.
 * Returns ordered subgroups (best first).
 */
function applyRule(
  teams: TeamStats[],
  rule: TiebreakerRule
): TeamStats[][] {
  if (rule.rule_type === "formula") {
    return applyFormulaRule(teams, rule)
  }

  switch (rule.simple_stat) {
    case "wins":
      return sortAndGroup(teams, (t) => t.w, rule.simple_direction === "higher_better")
    case "head_to_head":
      return applyHeadToHead(teams)
    case "goals_against":
      return sortAndGroup(teams, (t) => t.ga, rule.simple_direction !== "higher_better")
    case "penalty_minutes":
      return sortAndGroup(teams, (t) => t.pims, rule.simple_direction !== "higher_better")
    case "fastest_first_goal":
      return applyFastestFirstGoal(teams)
    case "coin_toss":
      // Cannot resolve automatically — return all as one group
      return [teams]
    default:
      return [teams]
  }
}

/**
 * GF/(GF+GA) formula rule
 */
function applyFormulaRule(
  teams: TeamStats[],
  rule: TiebreakerRule
): TeamStats[][] {
  const precision = rule.formula_precision ?? 5
  const higherBetter = rule.formula_direction === "higher_better"

  const withRatio = teams.map((t) => {
    const total = t.gf + t.ga
    const ratio = total === 0 ? 0.5 : t.gf / total
    const rounded = parseFloat(ratio.toFixed(precision))
    return { team: t, ratio: rounded }
  })

  withRatio.sort((a, b) =>
    higherBetter ? b.ratio - a.ratio : a.ratio - b.ratio
  )

  // Group by equal ratio
  const groups: TeamStats[][] = []
  let currentGroup: TeamStats[] = [withRatio[0].team]
  for (let i = 1; i < withRatio.length; i++) {
    if (withRatio[i].ratio === withRatio[i - 1].ratio) {
      currentGroup.push(withRatio[i].team)
    } else {
      groups.push(currentGroup)
      currentGroup = [withRatio[i].team]
    }
  }
  groups.push(currentGroup)

  return groups
}

/**
 * Head-to-head: look at games between exactly 2 tied teams.
 */
function applyHeadToHead(teams: TeamStats[]): TeamStats[][] {
  if (teams.length !== 2) return [teams]

  const [teamA, teamB] = teams
  let aWins = 0
  let bWins = 0

  for (const result of teamA.gameResults) {
    if (result.opponentId === teamB.teamId) {
      if (result.goalsFor > result.goalsAgainst) aWins++
      else if (result.goalsFor < result.goalsAgainst) bWins++
    }
  }

  if (aWins > bWins) return [[teamA], [teamB]]
  if (bWins > aWins) return [[teamB], [teamA]]
  return [teams] // Split — no separation
}

/**
 * Fastest first goal across all pool play games. Lower is better.
 * Teams with null (no first goal recorded) sort last.
 */
function applyFastestFirstGoal(teams: TeamStats[]): TeamStats[][] {
  return sortAndGroup(
    teams,
    (t) => t.fastestFirstGoal ?? Infinity,
    false // lower is better
  )
}

/**
 * Sort teams by a numeric value and group equal values together.
 * Returns ordered subgroups (best first).
 */
function sortAndGroup(
  teams: TeamStats[],
  getValue: (t: TeamStats) => number,
  higherBetter: boolean
): TeamStats[][] {
  const withValues = teams.map((t) => ({ team: t, value: getValue(t) }))
  withValues.sort((a, b) =>
    higherBetter ? b.value - a.value : a.value - b.value
  )

  const groups: TeamStats[][] = []
  let currentGroup: TeamStats[] = [withValues[0].team]
  for (let i = 1; i < withValues.length; i++) {
    if (withValues[i].value === withValues[i - 1].value) {
      currentGroup.push(withValues[i].team)
    } else {
      groups.push(currentGroup)
      currentGroup = [withValues[i].team]
    }
  }
  groups.push(currentGroup)

  return groups
}

function groupBy<T>(items: T[], keyFn: (item: T) => number): Map<number, T[]> {
  const map = new Map<number, T[]>()
  for (const item of items) {
    const key = keyFn(item)
    const group = map.get(key) ?? []
    group.push(item)
    map.set(key, group)
  }
  return map
}

function toStanding(
  stats: TeamStats,
  rank: number,
  tiebreakerUsed: string | null,
  coinTossNeeded: boolean
): TeamStanding {
  return {
    teamId: stats.teamId,
    teamName: stats.teamName,
    gp: stats.gp,
    w: stats.w,
    l: stats.l,
    t: stats.t,
    pts: stats.pts,
    gf: stats.gf,
    ga: stats.ga,
    gd: stats.gd,
    pims: stats.pims,
    fastestFirstGoal: stats.fastestFirstGoal,
    rank,
    tiebreakerUsed,
    coinTossNeeded,
  }
}
