const FAVOURITES_KEY = "favourite_teams"
const ACTIVE_TEAM_KEY = "active_team"

export function getFavouriteTeamIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function setFavouriteTeamIds(ids: string[]) {
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids))
}

export function addFavouriteTeamId(id: string) {
  const ids = getFavouriteTeamIds()
  if (!ids.includes(id)) {
    setFavouriteTeamIds([...ids, id])
  }
}

export function removeFavouriteTeamId(id: string) {
  setFavouriteTeamIds(getFavouriteTeamIds().filter((i) => i !== id))
}

export function getActiveTeamId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACTIVE_TEAM_KEY)
}

export function setActiveTeamId(id: string) {
  localStorage.setItem(ACTIVE_TEAM_KEY, id)
}
