# Phase 2 — Step 1: Team Picker as App Entry Point

## Context

The app currently hardcodes `MY_TEAM_ID` (Nepean Wildcats) and `TOURNAMENT_ID` in `lib/constants.ts`. Every page and component references these constants. To support multiple teams, users need to pick their team on first load, and the entire app should flow from that selection.

No auth exists yet, so favourite teams are stored in localStorage. The flat URL structure (`/standings`, `/schedule`, etc.) stays unchanged — team context is managed via a React context provider, not the URL.

## Data Structure Changes

**None required.** The `teams` table already has `level`, `skill_level`, `division`, `short_location`, `short_name` — all the fields needed for filtering and display. The tournament association is discoverable via `pool_teams → pools → tournaments`.

## What Gets Built

### 1. Team Context Provider

**New file: `components/team/TeamProvider.tsx`** (client component)

- React context that holds `activeTeamId` and `activeTournamentId`
- On mount, reads `activeTeamId` from `localStorage`
- When `activeTeamId` changes, looks up the team's active tournament via Supabase: `pool_teams → pools → tournament_id`
- Exposes `setActiveTeam(teamId)` to update context + localStorage
- Exposes `favouriteTeamIds` (array from localStorage) and `addFavourite(teamId)` / `removeFavourite(teamId)`

**New file: `lib/team-context.ts`** — localStorage helpers

- `getFavouriteTeamIds(): string[]` — reads from localStorage key `"favourite_teams"`
- `setFavouriteTeamIds(ids: string[]): void`
- `getActiveTeamId(): string | null` — reads from localStorage key `"active_team"`
- `setActiveTeamId(id: string): void`

### 2. Team Picker Page (App Entry Point)

**Modified file: `app/page.tsx`**

Currently redirects to `/standings`. Change to:
- If `activeTeamId` exists in localStorage → redirect to `/standings` (existing behavior)
- If no `activeTeamId` → render the team picker full-screen

Since this is a server component and can't read localStorage, the page renders a client component that checks localStorage and either redirects or shows the picker.

**New file: `components/team/TeamPickerGate.tsx`** (client component)

- On mount, checks localStorage for `activeTeamId`
- If found → `router.push("/standings")`
- If not found → renders `<TeamPicker />` full-screen

**New file: `components/team/TeamPicker.tsx`** (client component)

Two sections:

**Section A: "Your Teams" (favourites)**
- Shows cards for each favourite team (from localStorage)
- Each card shows: team name (short_location + short_name), division badge (e.g. "U13A"), provincial ranking if available
- Tapping a card sets it as active team and navigates to `/standings`
- If no favourites yet, shows a message like "Pick your teams to get started" and auto-shows the full team list

**Section B: "Add Teams" button (subtle, bottom of favourites)**
- When clicked, expands/opens a full team browser below or as a sheet
- Shows ALL teams from the database
- Filter controls at top:
  - Text search (team name)
  - Level dropdown (U9, U11, U13, U15, U18)
  - Skill level dropdown (AA, A, BB, B, C)
- Each team row shows: name, division, provincial ranking
- Tap a team → adds to favourites, card appears in "Your Teams" section above
- Heart/star toggle on each row to add/remove from favourites

**Data fetching:** TeamPicker fetches teams client-side via Supabase:
```
supabase.from("teams").select("id, name, short_location, short_name, level, skill_level, division").order("name")
```

For rankings, a separate query joins `provincial_rankings`.

### 3. Replace Hardcoded Constants

**Modified file: `lib/constants.ts`**

- Keep `MY_TEAM_ID` and `TOURNAMENT_ID` as fallback defaults only
- Add comment: "These are fallback values used when no team is selected via TeamProvider"

**New hook: `lib/hooks/use-active-team.ts`**

- `useActiveTeam()` — returns `{ teamId, tournamentId, setActiveTeam }` from TeamProvider context
- Components use this instead of importing from constants

**Key pattern change across all pages:**

Server components (page.tsx files) can't use React context. Two approaches:

**Approach A (recommended): Pass IDs via searchParams or cookies**
- The TeamPickerGate sets a cookie `active_team_id` when a team is selected
- Server components read the cookie: `cookies().get("active_team_id")`
- Also set `active_tournament_id` cookie when team is selected (looked up from pool_teams)
- Fallback to hardcoded constants if cookie is missing

**Why cookies over just context:** The page.tsx files are server components that fetch data from Supabase. They need the team/tournament ID *before* rendering. Cookies are readable server-side; React context is not.

### 4. Files to Modify (Replace TOURNAMENT_ID / MY_TEAM_ID)

Each of these files currently imports from `lib/constants.ts`. They need to read from cookies instead, with a fallback to the constants.

**Helper: `lib/active-team.ts`** (server-side)
```
import { cookies } from "next/headers"
import { TOURNAMENT_ID, MY_TEAM_ID } from "./constants"

export async function getActiveTeamId(): string {
  const cookieStore = await cookies()
  return cookieStore.get("active_team_id")?.value ?? MY_TEAM_ID
}

export async function getActiveTournamentId(): string {
  const cookieStore = await cookies()
  return cookieStore.get("active_tournament_id")?.value ?? TOURNAMENT_ID
}
```

**Pages using TOURNAMENT_ID (replace with `getActiveTournamentId()`):**
- `app/standings/page.tsx` — 5 usages
- `app/schedule/page.tsx` — 3 usages
- `app/bracket/page.tsx` — 6 usages
- `app/misc/page.tsx` — 6 usages
- `app/api/chat/route.ts` — 6 usages

**Components using MY_TEAM_ID (replace with teamId from context/props):**
- `components/standings/StandingsTable.tsx` — highlight row
- `components/schedule/GameCard.tsx` — highlight game
- `components/schedule/TeamGamesSheet.tsx` — color team name
- `components/bracket/BracketView.tsx` — highlight bracket game
- `components/import/CsvImport.tsx` — tournament ID for imports

For client components, pass `myTeamId` as a prop from the parent server component (which reads it from the cookie).

### 5. Navigation Updates

**Modified file: `components/layout/TopNav.tsx`**

- Add a small team indicator showing the active team's short name/logo
- Tapping it opens a quick-switch dropdown showing favourite teams
- "Change Team" option at the bottom navigates back to `/` (the picker)

**Modified file: `components/layout/BottomNav.tsx`**

- No changes needed — nav links stay the same (`/standings`, `/schedule`, etc.)

### 6. Wrap App with TeamProvider

**Modified file: `app/layout.tsx`**

- Wrap children with `<TeamProvider>` so all client components can access team context
- TeamProvider reads from localStorage on mount and sets cookies for server components

## Build Order

1. `lib/team-context.ts` — localStorage helpers (no dependencies)
2. `lib/active-team.ts` — server-side cookie reader (no dependencies)
3. `components/team/TeamProvider.tsx` — context provider
4. `components/team/TeamPicker.tsx` — the picker UI
5. `components/team/TeamPickerGate.tsx` — entry gate
6. `app/page.tsx` — render gate instead of redirect
7. `app/layout.tsx` — wrap with TeamProvider
8. Replace `TOURNAMENT_ID` in all 5 page files with `getActiveTournamentId()`
9. Replace `MY_TEAM_ID` in all 4 component files — pass as prop from pages
10. `components/layout/TopNav.tsx` — add team indicator + quick switch

## Verification

1. `npm run build` — no type errors
2. Clear localStorage, load app → should see team picker
3. Pick a team → navigates to standings, all data loads for that team's tournament
4. Refresh page → still on the same team (cookie persists)
5. Go back to `/` → picker shows with favourite teams
6. Switch team from TopNav → all pages update to new team's data
7. Add/remove favourites → persists across page loads

## Styling Notes

- Team picker should feel like a clean, focused landing page — not cluttered
- Team cards in "Your Teams" section: compact, tappable, with clear team identity
- "Add Teams" section: subtle button that expands into a searchable list
- Filter controls: small dropdowns, not overwhelming
- All styles via `@apply` in globals.css as per project conventions
