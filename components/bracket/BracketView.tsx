"use client"

import { cn } from "@/lib/utils"
import { MY_TEAM_ID } from "@/lib/constants"
import type { Game } from "@/lib/types"

interface BracketViewProps {
  semi1: Game | null
  semi2: Game | null
  final: Game | null
}

function BracketGame({ game }: { game: Game | null }) {
  if (!game) return null

  const homeName =
    game.home_team?.name ?? game.home_placeholder ?? "TBD"
  const awayName =
    game.away_team?.name ?? game.away_placeholder ?? "TBD"
  const isCompleted = game.status === "completed"
  const homeIsMyTeam = game.home_team_id === MY_TEAM_ID
  const awayIsMyTeam = game.away_team_id === MY_TEAM_ID
  const hasMyTeam = homeIsMyTeam || awayIsMyTeam

  const homeWon =
    isCompleted &&
    game.final_score_home != null &&
    game.final_score_away != null &&
    game.final_score_home > game.final_score_away
  const awayWon =
    isCompleted &&
    game.final_score_home != null &&
    game.final_score_away != null &&
    game.final_score_away > game.final_score_home

  return (
    <div
      className={cn(
        "bracket-game",
        hasMyTeam && "bracket-game--my-team"
      )}
    >
      <div
        className={cn(
          "bracket-team-row",
          homeWon && "bracket-team-row--winner",
          homeIsMyTeam && "bracket-team-row--my-team"
        )}
      >
        <span
          className={cn(
            "bracket-team-name",
            !game.home_team_id && "bracket-tbd"
          )}
        >
          {homeName}
        </span>
        {isCompleted && (
          <span className="bracket-team-score">
            {game.final_score_home}
          </span>
        )}
      </div>
      <div
        className={cn(
          "bracket-team-row",
          awayWon && "bracket-team-row--winner",
          awayIsMyTeam && "bracket-team-row--my-team"
        )}
      >
        <span
          className={cn(
            "bracket-team-name",
            !game.away_team_id && "bracket-tbd"
          )}
        >
          {awayName}
        </span>
        {isCompleted && (
          <span className="bracket-team-score">
            {game.final_score_away}
          </span>
        )}
      </div>
    </div>
  )
}

export function BracketView({ semi1, semi2, final: finalGame }: BracketViewProps) {
  return (
    <div className="bracket-container">
      <div className="bracket-round">
        <h3 className="bracket-round__title">Semi-Finals</h3>
        <div className="flex flex-col gap-4">
          <BracketGame game={semi1} />
          <BracketGame game={semi2} />
        </div>
      </div>

      <div className="bracket-connector">
        <div className="bracket-connector__line" />
      </div>

      <div className="bracket-round">
        <h3 className="bracket-round__title">Final</h3>
        <BracketGame game={finalGame} />
      </div>
    </div>
  )
}
