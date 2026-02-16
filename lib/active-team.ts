import { cookies } from "next/headers"
import { MY_TEAM_ID, TOURNAMENT_ID } from "./constants"

export async function getActiveTeamId(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("active_team_id")?.value ?? MY_TEAM_ID
}

export async function getActiveTournamentId(): Promise<string> {
  const cookieStore = await cookies()
  return cookieStore.get("active_tournament_id")?.value ?? TOURNAMENT_ID
}
