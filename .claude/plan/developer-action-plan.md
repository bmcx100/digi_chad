# Minor Hockey Team Tracking App — Developer Action Plan

## Document Purpose

This is a step-by-step implementation guide for a developer (or AI coding agent like Claude Code) to build the Minor Hockey Team Tracking App. Each task is concrete, sequenced by dependency, and includes acceptance criteria so you know when it's done.

**Read the companion documents first:**
- `full-project-plan.md` — Complete product specification (the "what" and "why")
- `requirements-checklist.md` — Verification checklist (~230 items)
- `phases2-5-build-order.md` — Detailed post-MVP build order

**Tech Stack:** Next.js (React) + Tailwind CSS + shadcn/ui + Supabase (PostgreSQL + Auth) + Vercel + Claude API

**Key Principle:** The database schema supports the FULL vision from day one. Features are built in phases — MVP first, then expand. Nothing should need to be thrown away or rebuilt.

---

## Phase 1: Tournament MVP

**Goal:** A working tournament tracker for the DWGHA Bolts & Hearts Annual Tournament (Feb 13–15, 2026). Single user, one team (Nepean Wildcats), one tournament. Must be usable on a phone at the rink.

**Timeline:** Before Friday Feb 13.

---

### Task 1.1: Project Scaffolding

**What to do:**
1. Initialize a Next.js project with the App Router (Next.js 14+).
2. Install and configure Tailwind CSS.
3. Install and configure shadcn/ui component library.
4. Create a Supabase project (cloud) and connect it to the Next.js app via environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
5. Set up Vercel deployment connected to the Git repo.
6. Configure the project for mobile-first responsive design (viewport meta tag, Tailwind breakpoints).

**Acceptance Criteria:**
- `npm run dev` serves the app locally.
- App is deployed to a Vercel URL.
- Supabase client can connect from the app (test with a simple query).
- Page renders correctly on mobile viewport (375px wide).

---

### Task 1.2: Database Schema — Full Vision

**What to do:** Create all tables in Supabase PostgreSQL. Even though MVP only uses a subset, design for the full product so nothing gets rebuilt later.

**Tables to create (with key columns):**

**`users`**
- `id` (UUID, PK, references Supabase auth.users)
- `email` (text)
- `display_name` (text)
- `is_platform_admin` (boolean, default false)
- `created_at` (timestamptz)

**`teams`**
- `id` (UUID, PK)
- `name` (text, NOT NULL)
- `external_id` (text, nullable — e.g., "#2859")
- `level` (text — U9, U11, U13, U15, U18)
- `skill_level` (text — AA, A, BB, B, C)
- `division` (text)
- `association` (text, nullable)
- `region` (text, nullable)
- `is_verified` (boolean, default false)
- `is_shell` (boolean, default false — for auto-created unowned teams)
- `shadow_of_team_id` (UUID, references teams, nullable — set when a verified team exists and this is a personal tracking copy; see Task 4.3)
- `created_by` (UUID, references users, nullable)
- `created_at` (timestamptz)

**`team_members`**
- `id` (UUID, PK)
- `user_id` (UUID, references users)
- `team_id` (UUID, references teams)
- `role` (text — 'admin', 'contributor', 'teammate', 'follower')
- `joined_at` (timestamptz)
- Unique constraint on (user_id, team_id)

**`followed_teams`**
- `id` (UUID, PK)
- `user_id` (UUID, references users)
- `team_id` (UUID, references teams)
- `followed_at` (timestamptz)
- Unique constraint on (user_id, team_id)

**`seasons`**
- `id` (UUID, PK)
- `team_id` (UUID, references teams)
- `name` (text — e.g., "2025-26")
- `start_date` (date)
- `end_date` (date)

**`tournaments`**
- `id` (UUID, PK)
- `name` (text, NOT NULL)
- `start_date` (date)
- `end_date` (date)
- `location` (text)
- `division` (text)
- `level` (text)
- `skill_level` (text)
- `ruleset_text` (text, nullable — full text of tournament rules)
- `goal_differential_cap` (integer, nullable — e.g., 5)
- `created_by` (UUID, references users, nullable)
- `created_at` (timestamptz)

**`tournament_point_structure`**
- `id` (UUID, PK)
- `tournament_id` (UUID, references tournaments)
- `win_points` (integer, default 2)
- `tie_points` (integer, default 1)
- `loss_points` (integer, default 0)
- `otl_points` (integer, default 0)
- Bonus point fields as needed (nullable)

**`pools`**
- `id` (UUID, PK)
- `tournament_id` (UUID, references tournaments)
- `name` (text — e.g., "A", "B")
- `advancement_count` (integer — how many advance from this pool)

**`pool_teams`**
- `id` (UUID, PK)
- `pool_id` (UUID, references pools)
- `team_id` (UUID, references teams)

**`tiebreaker_rules`**
- `id` (UUID, PK)
- `tournament_id` (UUID, references tournaments)
- `priority_order` (integer, NOT NULL — 1, 2, 3...)
- `rule_type` (text — 'simple' or 'formula')
- `simple_stat` (text, nullable — 'wins', 'head_to_head', 'goals_against', 'penalty_minutes', 'fastest_first_goal', 'coin_toss')
- `simple_direction` (text, nullable — 'higher_better' or 'lower_better')
- `formula_expression` (text, nullable — e.g., "GF / (GF + GA)")
- `formula_precision` (integer, nullable — decimal places, e.g., 5)
- `formula_direction` (text, nullable — 'higher_better' or 'lower_better')
- `head_to_head_max_teams` (integer, nullable — e.g., 2, meaning only applies when exactly 2 teams tied)
- `description` (text — human-readable label like "GF/(GF+GA) ratio")

**`games`**
- `id` (UUID, PK)
- `tournament_id` (UUID, references tournaments, nullable)
- `pool_id` (UUID, references pools, nullable)
- `season_id` (UUID, references seasons, nullable)
- `game_number` (text, nullable — tournament game number like "3", "48")
- `stage` (text — 'pool_play', 'quarterfinal', 'semifinal', 'final', 'consolation', 'regular_season', 'playoff')
- `start_datetime` (timestamptz, NOT NULL)
- `venue` (text)
- `home_team_id` (UUID, references teams, nullable — nullable for TBD bracket games)
- `away_team_id` (UUID, references teams, nullable)
- `home_placeholder` (text, nullable — e.g., "1st in Pool A" for bracket games before teams are known)
- `away_placeholder` (text, nullable — e.g., "2nd in Pool B")
- `bracket_source_game_1_id` (UUID, references games, nullable — for finals: "winner of this game")
- `bracket_source_game_2_id` (UUID, references games, nullable)
- `final_score_home` (integer, nullable)
- `final_score_away` (integer, nullable)
- `goals_by_period_home` (integer[], nullable — e.g., {2, 1, 0})
- `goals_by_period_away` (integer[], nullable)
- `penalty_minutes_home` (integer, nullable)
- `penalty_minutes_away` (integer, nullable)
- `fastest_goal_seconds_home` (integer, nullable — seconds into game of first goal)
- `fastest_goal_seconds_away` (integer, nullable)
- `result_type` (text, nullable — 'regulation', 'overtime', 'shootout', 'forfeit')
- `end_reason` (text, nullable — 'regulation', 'OT', 'shootout')
- `overtime_winner_team_id` (UUID, references teams, nullable)
- `shootout_winner_team_id` (UUID, references teams, nullable)
- `status` (text, default 'scheduled' — 'scheduled', 'in_progress', 'completed')
- `entered_by` (UUID, references users, nullable)
- `entered_at` (timestamptz, nullable)
- `updated_at` (timestamptz)

**`provincial_rankings`**
- `id` (UUID, PK)
- `team_id` (UUID, references teams)
- `rank` (integer)
- `division` (text)
- `level` (text)
- `date_recorded` (date)
- `created_at` (timestamptz)

**`invite_links`**
- `id` (UUID, PK)
- `team_id` (UUID, references teams)
- `role` (text — 'teammate' or 'contributor')
- `token` (text, unique)
- `created_by` (UUID, references users)
- `expires_at` (timestamptz)
- `used_by` (UUID, references users, nullable)
- `used_at` (timestamptz, nullable)

**`notifications`**
- `id` (UUID, PK)
- `user_id` (UUID, references users)
- `type` (text)
- `title` (text)
- `body` (text)
- `data` (jsonb, nullable — structured metadata)
- `read` (boolean, default false)
- `created_at` (timestamptz)

**`source_of_truth_claims`**
- `id` (UUID, PK)
- `team_id` (UUID, references teams)
- `claimant_user_id` (UUID, references users)
- `claimant_info` (text)
- `status` (text — 'pending', 'approved', 'denied')
- `reviewed_by` (UUID, references users, nullable)
- `reviewed_at` (timestamptz, nullable)
- `created_at` (timestamptz)

**`team_events`** *(used in Phase 5 for practices, but create the table now)*
- `id` (UUID, PK)
- `team_id` (UUID, references teams)
- `season_id` (UUID, references seasons, nullable)
- `event_type` (text — 'practice', 'meeting', 'other')
- `title` (text, nullable)
- `start_datetime` (timestamptz)
- `end_datetime` (timestamptz, nullable)
- `venue` (text)
- `notes` (text, nullable)
- `created_by` (UUID, references users)
- `created_at` (timestamptz)

**`qualifier_loops`** *(used in Phase 5 for provincial qualifiers, but create the table now)*
- `id` (UUID, PK)
- `name` (text)
- `level` (text)
- `skill_level` (text)
- `qualification_spots` (integer)
- `format` (text — 'round_robin', 'series', 'tournament')
- `target_tournament_id` (UUID, references tournaments, nullable)
- `created_by` (UUID, references users)
- `created_at` (timestamptz)

**`qualifier_loop_teams`** *(used in Phase 5)*
- `id` (UUID, PK)
- `loop_id` (UUID, references qualifier_loops)
- `team_id` (UUID, references teams)
- `qualified` (boolean, default false)

**Indexes to create:**
- `games` — index on (tournament_id, pool_id), (home_team_id), (away_team_id), (start_datetime)
- `pool_teams` — index on (pool_id), (team_id)
- `team_members` — index on (user_id), (team_id)
- `tiebreaker_rules` — index on (tournament_id, priority_order)

**Acceptance Criteria:**
- All tables created in Supabase.
- Foreign key relationships enforced.
- Can insert and query test data.
- No tables need to be dropped or restructured when moving to Phase 2+.

---

### Task 1.3: Seed Tournament Data

**What to do:** Write a seed script (SQL or a Next.js API route/script) that populates the database with the complete DWGHA Bolts & Hearts tournament data.

**Data to seed:**

1. **Tournament:** "DWGHA Bolts & Hearts Annual Tournament", Feb 13–15, 2026. Goal differential cap = 5. Include full ruleset text in `ruleset_text` column.

2. **Point Structure:** Win = 2, Tie = 1, Loss = 0.

3. **Tiebreaker Rules (7 rules in order):**
   - Priority 1: Number of wins (simple, higher_better)
   - Priority 2: Head-to-head record (simple, higher_better, head_to_head_max_teams = 2)
   - Priority 3: GF / (GF + GA) ratio (formula, precision = 5, higher_better)
   - Priority 4: Fewest Goals Against (simple, lower_better)
   - Priority 5: Fewest Penalty Minutes (simple, lower_better)
   - Priority 6: Earliest first goal scored (simple, lower_better)
   - Priority 7: Coin Toss (simple)

4. **Teams (11 total):**
   - Pool A: Nepean Wildcats #2859, Southpoint Stars #6672, Peterborough Ice Kats #1484, Markham-Stouffville Stars #3582, Scarborough Sharks #845
   - Pool B: Toronto Leaside Wildcats #3792, Napanee Crunch #1878, North Bay Junior Lakers #6254, Cornwall Typhoons #2328, Durham West Lightning #310, Central York Panthers #3

5. **Pools:** Pool A (advancement_count = 2), Pool B (advancement_count = 2). Link teams to pools via pool_teams.

6. **Games (all from the schedule in full-project-plan.md Step 6):**
   - Friday Pool A: 5 games (game numbers 3, 3, 48, 52, 25)
   - Friday Pool B: 6 games (game numbers 2, 43, 30, 114, 142, 99)
   - Saturday Pool A: 6 games (game numbers 322, 171, 204, 221, 210, 226)
   - Saturday Pool B: 5 games (game numbers 218, 189, 208, 194, 179)
   - Sunday Elimination: 3 games (365 = Semi 1A vs 2B, 372 = Semi 1B vs 2A, 368 = Final)
   - For Sunday games: set `home_placeholder`/`away_placeholder` text (e.g., "1st Pool A"), leave team IDs null. Set `bracket_source_game_1_id` and `bracket_source_game_2_id` on the Final game.
   - **Note:** Game #204 (Saturday 11:15 AM, Central York Panthers vs Toronto Leaside Wildcats) is listed under Pool A schedule but both teams are Pool B. Seed it as a Pool B game.
   - Set all games to `status = 'scheduled'`.

7. **Your team marker:** The app needs to know which team is "yours." For MVP, this can be a config constant or environment variable: `MY_TEAM_ID = <Nepean Wildcats UUID>`. This will be replaced by proper auth in Phase 2.

**Acceptance Criteria:**
- All 11 teams exist in the database.
- Both pools configured with correct teams.
- All 25 games seeded with correct times, venues, team assignments.
- Tiebreaker rules stored in correct priority order (1–7).
- Each tiebreaker rule has correct type, stat, direction, and metadata (e.g., head_to_head_max_teams = 2 for Rule 2, formula_precision = 5 for Rule 3).
- The tiebreaker rules config is sufficient for the cascading engine in Task 1.6 to consume — verify by loading the rules and confirming the engine can iterate them.
- Point structure stored (2/1/0).
- Goal differential cap stored (5).
- Full ruleset text stored.
- Querying games by tournament + pool returns correct results.

---

### Task 1.4: Tournament Schedule View (UI)

**What to do:** Build the main tournament schedule page. This is the primary screen users will see.

**Layout (mobile-first):**

1. **Header:** Tournament name ("DWGHA Bolts & Hearts Tournament") and dates.

2. **Day Tabs:** Friday / Saturday / Sunday — tab-style navigation to filter games by day.

3. **Pool Filter:** "All" / "Pool A" / "Pool B" / "Elimination" — secondary filter within each day.

4. **Game Cards:** For each game, display a card showing:
   - Game number (small, secondary)
   - Time (prominent)
   - Venue/Rink
   - Home Team vs Away Team
   - Score (if completed) — shown prominently
   - Status indicator: Upcoming (default look), In Progress (highlighted, pulsing or accent color), Completed (score shown, slightly muted)

5. **Your Team Highlighting:** Any game involving Nepean Wildcats #2859 should have a distinct visual treatment — colored left border, background tint, or similar. Make it immediately obvious which games are yours.

6. **For Sunday bracket games:** Show placeholder text (e.g., "1st Pool A vs 2nd Pool B") until pool play is complete and teams are determined.

7. **Tap a game → opens score entry modal/sheet** (built in Task 1.5).

**Data fetching:** Query the `games` table filtered by tournament_id, join with teams to get names. Sort by start_datetime within each day.

**Acceptance Criteria:**
- All 25 games displayed across 3 day tabs.
- Pool filter works correctly.
- Nepean Wildcats games are visually distinct.
- Games show correct time, venue, teams.
- Completed games show scores.
- Sunday bracket games show placeholder text.
- Looks good on a phone screen (375px–430px wide).
- Games are ordered chronologically within each day.

---

### Task 1.5: Score Entry

**What to do:** Build a modal or bottom sheet that opens when you tap a game card. Allows entering game results.

**Fields:**

1. **Final Score (required):**
   - Home team score (number input, large tap target)
   - Away team score (number input, large tap target)
   - Team names shown as labels above the inputs

2. **Period Scores (optional, collapsible section):**
   - Period 1: Home / Away
   - Period 2: Home / Away
   - Period 3: Home / Away
   - Validation: period scores should sum to final score (warn if they don't, but don't block save)

3. **Penalty Minutes (optional):**
   - Home team PIMs (number input)
   - Away team PIMs (number input)

4. **Fastest First Goal (optional):**
   - Home team: minutes and seconds into the game (or total seconds)
   - Away team: minutes and seconds into the game

5. **Result Type:**
   - Regulation (default)
   - Forfeit
   - For elimination games only: Overtime / Shootout

6. **Game Status Controls:**
   - **"Mark In Progress" button** — visible on scheduled games. Sets `status = 'in_progress'` without requiring a score. This is how a game transitions from "upcoming" to "in progress" in the UI. Can be a quick-tap button directly on the game card OR a toggle at the top of the score entry modal.
   - **"Save Score" button** — writes to the `games` table, sets `status = 'completed'`, stores `entered_at = now()`.
   - **Auto-detection (optional enhancement):** If the current time is within the game's scheduled start window (±20 minutes per Rule 3), auto-suggest marking it as in progress.

7. **Edit capability** — if a game already has scores, pre-populate the form for editing.

**Acceptance Criteria:**
- Tapping a game opens the score entry form.
- Can mark a game as "In Progress" without entering a score.
- Game card shows "In Progress" state visually (pulsing accent, highlighted border, or similar).
- Final score is required for completion; form won't save as "completed" without it.
- Period scores, PIMs, and first goal time are optional.
- Saving a score updates the game record and sets status to 'completed'.
- Game card on the schedule view immediately reflects the new score and status.
- Editing a previously entered score works.
- All three game states render distinctly: Scheduled (default), In Progress (highlighted/accent), Completed (score shown, muted).
- Form is easy to use on a phone with one hand (large inputs, clear labels).

---

### Task 1.6: Pool Standings Engine (Core Business Logic)

**What to do:** Build the standings calculation engine. This is the most complex piece of the MVP.

**Standings Calculation:**

1. **Base standings per pool:** For each team in the pool, calculate from completed games:
   - GP (games played)
   - W (wins)
   - L (losses)
   - T (ties)
   - PTS (points: W×2 + T×1)
   - GF (goals for — total goals scored)
   - GA (goals against — total goals allowed)
   - GD (goal differential — capped at +5 per game, can be negative uncapped)
     - For each game: `min(GF_game - GA_game, 5)` if positive, actual value if negative
     - Sum across all games
   - PIMs (total penalty minutes, from games where entered)

2. **Sort by points first** (descending).

3. **Tiebreaker Engine:** When two or more teams have the same points, apply tiebreakers in order. **Critical cascading rule:** once a tiebreaker separates any team(s) from a tied group, that tiebreaker CANNOT be reused for the remaining tied teams. They skip to the next tiebreaker.

**Tiebreaker Implementation (in priority order):**

- **Rule 1 — Number of wins:** Sort by W descending. If this separates some teams, they are placed; remaining tied teams skip to Rule 3 (not back to Rule 1).

- **Rule 2 — Head-to-head:** ONLY applies when EXACTLY 2 teams are tied. Look at games between just those two teams. Team with more wins in those games ranks higher. If they split, skip to Rule 3. If more than 2 teams are tied, skip this rule entirely.

- **Rule 3 — GF/(GF+GA) ratio:** Calculate `goals_for / (goals_for + goals_against)` to 5 decimal places. Higher is better. Handle edge case: if both GF and GA are 0, ratio is 0.50000 (or handle as equal).

- **Rule 4 — Fewest Goals Against:** Lower GA is better.

- **Rule 5 — Fewest Penalty Minutes:** Lower PIMs is better. Only uses games where PIMs were recorded.

- **Rule 6 — Earliest first goal:** Look at `fastest_goal_seconds` across ALL pool play games for each team. The team whose earliest first goal (across any game) came soonest wins. Lower is better.

- **Rule 7 — Coin toss:** Cannot be resolved automatically. If it gets here, flag it for manual resolution (show a "Coin Toss Needed" indicator in the UI).

**Algorithm sketch for cascading tiebreaker:**
```
function rankTeams(teams, tiebreakerRules):
  groups = groupByPoints(teams)  // [{points: 6, teams: [A, B, C]}, ...]
  rankedList = []
  for each group:
    if group has 1 team:
      rankedList.append(team)
    else:
      resolveGroup(group.teams, tiebreakerRules, startingRuleIndex=0, rankedList)

function resolveGroup(tiedTeams, rules, ruleIndex, rankedList):
  if tiedTeams.length == 1:
    rankedList.append(tiedTeams[0])
    return
  if ruleIndex >= rules.length:
    // unresolvable — coin toss needed
    rankedList.append(tiedTeams with coin_toss_flag)
    return

  rule = rules[ruleIndex]
  if rule is head_to_head and tiedTeams.length != 2:
    // skip head-to-head when more than 2 teams
    resolveGroup(tiedTeams, rules, ruleIndex + 1, rankedList)
    return

  subgroups = applyRule(tiedTeams, rule)
  // subgroups is ordered list of groups, e.g., [{team A}, {team B, team C}]

  for each subgroup:
    if subgroup has 1 team:
      rankedList.append(team)
    else:
      // CRITICAL: skip to NEXT rule, do NOT reuse current rule
      resolveGroup(subgroup, rules, ruleIndex + 1, rankedList)
```

**Acceptance Criteria:**
- Pool standings calculated correctly from game results.
- Points, GF, GA, GD all correct (GD capped at +5 per game).
- Tiebreakers apply in correct order.
- Head-to-head only triggers for exactly 2 tied teams.
- GF/(GF+GA) calculated to 5 decimal places.
- Cascading rule works: once a tiebreaker separates teams, it's not reused.
- Standings update immediately when a new score is entered.
- **Real-time approach:** Use one of the following (in preference order):
  1. **Supabase Realtime subscriptions** — subscribe to changes on the `games` table. When a game's score is updated, re-run the standings calculation client-side. This gives live updates without page refresh.
  2. **Optimistic UI update** — after saving a score, immediately recalculate standings on the client using the new data before the server confirms. This feels instant.
  3. **Polling fallback** — if Supabase Realtime is too complex for MVP, poll every 30 seconds on the standings page. Acceptable for MVP but not ideal.
  - At minimum, entering a score from the score entry modal must refresh the standings view when the user navigates to it (no stale data).
- Write unit tests for the tiebreaker engine with at least these scenarios:
  - No ties (simple points sort)
  - 2-team tie resolved by head-to-head
  - 3-team tie where head-to-head is skipped
  - 3-team tie resolved partially by wins, remainder by GF/(GF+GA)
  - Cascading: a rule used to break part of a group is skipped for the remainder

---

### Task 1.7: Pool Standings View (UI)

**What to do:** Display pool standings tables.

**Layout:**

1. **Two sections:** Pool A standings, Pool B standings.
2. **Table columns:** Rank, Team, GP, W, L, T, PTS, GF, GA, GD.
3. **Visual highlighting:**
   - Top 2 teams in each pool have a green/advancing indicator (border, background, badge).
   - Nepean Wildcats row is visually distinct (same treatment as schedule highlighting).
   - If a coin toss is needed, show an indicator on the affected teams.
4. **Tiebreaker indicator:** When teams are tied on points, show a small indicator of which tiebreaker resolved the ordering (e.g., "TB: H2H" or "TB: GF ratio").

**Data source:** Use the standings engine from Task 1.6. Recalculate on every page load (or use a computed view/function in Supabase).

**Acceptance Criteria:**
- Both pools display with correct standings.
- Top 2 advancing teams highlighted.
- Your team highlighted.
- Standings are correct based on entered scores.
- Table is readable on mobile (may need horizontal scroll or condensed column labels).

---

### Task 1.8: Bracket View (UI)

**What to do:** Build a visual bracket for the elimination round.

**Bracket Structure:**
```
Semi-Final 1: 1st Pool A vs 2nd Pool B  ─┐
                                           ├─ Final
Semi-Final 2: 1st Pool B vs 2nd Pool A  ─┘
```

**Behavior:**

1. **Before pool play is complete:** Show placeholder text ("1st Pool A", "2nd Pool B", etc.). Bracket is visible but teams are TBD.

2. **After pool play is complete (all pool games have scores):**
   - Auto-populate bracket with actual team names based on final pool standings.
   - Update the `games` table: set `home_team_id` and `away_team_id` on the semi-final and final games.

3. **After elimination games are played:** Show scores on the bracket.

4. **Highlight your team** in the bracket if Nepean Wildcats advances.

**Visual design:** Classic bracket layout with lines connecting semis to final. Can be simpler on mobile (stacked cards with connecting visual) as long as the bracket flow is clear.

**Acceptance Criteria:**
- Bracket displays with placeholder text when pool play is incomplete.
- Once all pool games are scored, bracket shows actual team names.
- Semi-final and final scores display after entry.
- Winner is visually indicated.
- Nepean Wildcats highlighted if present.

---

### Task 1.9: Navigation & App Shell

**What to do:** Build the overall app structure that ties together schedule, standings, and bracket.

**Navigation (bottom tab bar for mobile):**
1. **Schedule** — Tournament schedule view (Task 1.4)
2. **Standings** — Pool standings (Task 1.7)
3. **Bracket** — Elimination bracket (Task 1.8)
4. **Import** — CSV import (Task 1.10)
5. **AI Chat** — Stretch goal (Task 1.11)

**Header:** Tournament name. In future phases, this becomes the team switcher.

**Acceptance Criteria:**
- Bottom navigation with clear icons and labels.
- All tabs navigate to correct views.
- Active tab is visually indicated.
- Navigation works smoothly on mobile.

---

### Task 1.10: Simple CSV Bulk Import

**What to do:** Build an admin page for importing CSV data. MVP version is simple — no smart merge, just clean insert.

**Flow:**
1. User selects data type: "Schedule", "Results", or "Standings".
2. User uploads a CSV file.
3. App parses CSV using PapaParse (install: `npm install papaparse`).
4. App shows a preview table of parsed data.
5. User clicks "Confirm Import" to insert into database.
6. Success/error feedback.

**CSV schemas:**

**Schedule CSV:**
| Column | Type | Required |
|--------|------|----------|
| game_number | text | no |
| date | date (YYYY-MM-DD) | yes |
| time | time (HH:MM) | yes |
| venue | text | yes |
| home_team | text | yes |
| away_team | text | yes |
| pool | text | no |

**Results CSV:**
| Column | Type | Required |
|--------|------|----------|
| game_number | text | no |
| date | date | yes |
| home_team | text | yes |
| away_team | text | yes |
| home_score | integer | yes |
| away_score | integer | yes |
| home_period_scores | text (comma-separated) | no |
| away_period_scores | text (comma-separated) | no |

**Standings CSV:**
| Column | Type | Required |
|--------|------|----------|
| team_name | text | yes |
| wins | integer | yes |
| losses | integer | yes |
| ties | integer | yes |
| otl | integer | no |
| points | integer | yes |
| gp | integer | yes |

**Error handling:** Show clear error messages for malformed CSV (wrong columns, unparseable values). Don't crash — show the user what's wrong.

**Team matching:** When importing, match team names to existing teams in the database by name. If a team doesn't exist, auto-create it as a shell team (`is_shell = true`).

**Acceptance Criteria:**
- Can select data type and upload CSV.
- Parsed data previewed before insert.
- Data correctly inserted into database.
- Malformed CSV shows helpful error messages.
- New teams auto-created as shells if they don't exist.
- After importing results, standings update accordingly.

---

### Task 1.11: AI Chat with Ruleset (STRETCH — cut if time is short)

**What to do:** Build a chat interface connected to Claude API that can answer questions about the tournament.

**Architecture:**
1. Chat UI: simple message list with text input at bottom.
2. Audio input: use browser `SpeechRecognition` API to convert speech to text before sending.
3. Next.js API route `/api/chat`:
   - Receives the user's question.
   - Queries Supabase for current tournament data (standings, schedule, scores, tiebreaker rules).
   - Builds a system prompt containing:
     - Full ruleset text (from `tournaments.ruleset_text`)
     - Current pool standings (calculated)
     - Current schedule with scores
     - Tiebreaker configuration
     - Instruction to cite rule numbers when referencing rules
   - Sends to Claude API (model: `claude-sonnet-4-5-20250929`).
   - Returns response to client.

**Environment variable needed:** `ANTHROPIC_API_KEY`

**System prompt template (include in the API route):**
```
You are a tournament assistant for the DWGHA Bolts & Hearts Annual Tournament (Feb 13-15, 2026).
You know the complete tournament rules, schedule, standings, and results.
When referencing rules, always cite the specific rule number (e.g., "Per Rule 12c...").
The user's team is the Nepean Wildcats #2859 in Pool A.

TOURNAMENT RULES:
[insert full ruleset_text]

CURRENT STANDINGS:
[insert calculated standings]

SCHEDULE AND RESULTS:
[insert game data]

TIEBREAKER RULES:
[insert tiebreaker configuration]
```

**Acceptance Criteria:**
- Chat UI accessible from navigation.
- Text input works.
- Audio input works (or gracefully degrades if browser doesn't support it).
- Claude answers questions about standings, schedule, rules.
- Claude cites rule numbers (e.g., "Per Rule 12c, the tiebreaker ratio is...").
- Response time is reasonable (<5 seconds).

---

## Phase 2: Post-Tournament Foundation (Weeks 2–4)

**Goal:** Add authentication, roles, multi-team support, and regular season tracking. The app transitions from a single-user tournament tool to a multi-user platform.

**Dependencies:** All of Phase 1 complete.

---

### Task 2.1: Authentication System

**What to do:**
1. Enable Supabase Auth providers: email/password, Google, Apple.
2. Build sign-up page with email/password form and social sign-in buttons.
3. Build login page.
4. Build password reset flow (Supabase handles email sending).
5. Create auth middleware: protect all routes except landing page and public team profiles.
6. On successful auth, create/update the `users` table record.
7. Remove the hardcoded `MY_TEAM_ID` approach from MVP — replace with auth-based team association.
8. Build a landing page with brief app description and sign-up/login CTA.

**Acceptance Criteria:**
- Users can sign up with email/password.
- Users can sign in with Google.
- Users can sign in with Apple.
- Password reset works.
- Unauthenticated users are redirected to login.
- User record created in `users` table on first sign-in.

---

### Task 2.2: Roles & Row-Level Security

**What to do:**
1. Implement Row Level Security (RLS) policies on ALL tables:
   - **Public data** (games schedule/scores, pool standings, tournament brackets, provincial rankings): SELECT allowed for all authenticated users.
   - **Private data** (future: player roster, contact details): SELECT only for users with role ≥ 'teammate' on that team.
   - **Write access** (game scores, data input): INSERT/UPDATE only for 'contributor' or 'admin' role.
   - **Team management** (team settings, member management, imports): only 'admin' role.
2. Create helper functions in Supabase (PostgreSQL functions) to check user role for a given team.
3. AI chat API route: when assembling data for Claude, cap data access at 'teammate' level regardless of the user's actual role.
4. **Multiple admins and contributors per team are explicitly supported.** The `team_members` table has a unique constraint on (user_id, team_id) but NOT on (team_id, role). Any number of users can hold the 'admin' or 'contributor' role on the same team.

**Acceptance Criteria:**
- RLS policies active on all tables.
- A follower can see schedule and scores but not player roster.
- A contributor can enter scores but not manage members.
- An admin has full access.
- Multiple users can be admins of the same team simultaneously.
- Multiple users can be contributors of the same team simultaneously.
- AI chat never exposes admin-level data.

---

### Task 2.3: Invite System

**What to do:**
1. Admin UI: button to generate invite links.
2. Link generation: create a record in `invite_links` with role, unique token, 1-month expiry.
3. Two link types: Teammate link, Contributor link.
4. Invite acceptance flow: user clicks link → if logged in, added to team with the link's role; if not logged in, redirected to sign-up, then added to team.
5. Public follow link: any team member can share a link that lets someone follow (not join) the team. This is just a link to the team's public profile with a "Follow" button.

**Acceptance Criteria:**
- Admin can generate role-specific invite links.
- Links expire after 1 month.
- Clicking an invite link adds the user to the team with the correct role.
- Expired links show a friendly error.
- Public follow links work separately from invite links.

---

### Task 2.4: Member Management

**What to do:**
1. Admin-only page: "Team Members" showing all members and their roles.
2. Admin can change any member's role (promote/demote).
3. Admin can promote a member to Admin.
4. Admin can remove a member → deletes their `team_members` record (they silently become a follower if they have a `followed_teams` record, otherwise they lose access).
5. Member list is only visible to Admins — hide the link/page from other roles.

**Acceptance Criteria:**
- Admin sees full member list with roles.
- Role changes work.
- Removing a member works silently (no notification).
- Non-admins cannot see the member list.

---

### Task 2.5: Multi-Team Support

**What to do:**
1. Users can be members of multiple teams.
2. Build a team switcher in the app header/navigation. Dropdown or horizontal scroll of team names.
3. Switching teams changes all displayed data (schedule, standings, bracket, dashboard).
4. If a user has no teams, prompt them to create one or find one to follow.
5. "Create Team" flow: enter team name, level, skill level, division, association. Creator becomes Admin.

**Acceptance Criteria:**
- User can belong to multiple teams.
- Team switcher shows all teams.
- Switching teams updates all views.
- Can create a new team and become Admin.

---

### Task 2.6: Regular Season Schedule & Results

**What to do:**
1. Extend the schedule view to support regular season games (not just tournament).
2. Use the `stage` field on games: 'regular_season'.
3. Games linked to a `season` instead of (or in addition to) a tournament.
4. Manual game creation form: date, time, location, opponent (create team if needed), score.
5. Season record tracker: auto-calculated W-L-T-OTL from regular season games.
6. League standings view: a simple table showing team records. Initially manual entry or CSV import (the import tool from Phase 1 works here).

**Acceptance Criteria:**
- Can add regular season games.
- Season record auto-calculates.
- Schedule view can show both regular season and tournament games.
- League standings displayable.

---

## Phase 3: Dashboard & Intelligence (Weeks 4–6)

**Goal:** Build the team dashboard, provincial rankings, and upgrade CSV import with smart merge.

**Dependencies:** Phase 2 complete.

---

### Task 3.1: Provincial Rankings — Manual Entry & History

**What to do:**
1. Rankings entry screen: input your team's current provincial rank (number), select division/level.
2. Each entry saved as a snapshot with timestamp in `provincial_rankings` table.
3. Display current ranking on team profile/dashboard.
4. Build trend visualization: line chart showing rank over time (rank on Y-axis inverted so #1 is at top).
5. Implement a monthly reminder (in-app notification in `notifications` table): "Time to update your provincial rankings."
6. **Rankings-to-game context linking:** When displaying game results, show what each team's provincial ranking was at the time of the game. Implementation:
   - When rendering a past game, look up the most recent `provincial_rankings` entry for each team with `date_recorded <= game.start_datetime`.
   - Display as: "Ranked 11th when we beat Team A on Oct 15 (they were ranked 19th)".
   - This requires no schema change — the `provincial_rankings.date_recorded` field combined with the game's `start_datetime` provides the temporal join.
   - Surface this context in: game detail views, head-to-head history on the dashboard, and AI chat responses.

**Acceptance Criteria:**
- Can enter a ranking.
- Historical snapshots accumulate.
- Trend chart shows rank movement over season.
- Monthly reminder triggers.
- Game results display the ranking context for both teams at the time the game was played.
- If no ranking snapshot exists for a team at a given game date, show "Unranked" or omit gracefully.

---

### Task 3.2: CSV Import — Smart Merge Upgrade

**What to do:** Upgrade the Phase 1 CSV import with templates, validation, and smart merge.

1. **Templates:** Build downloadable CSV templates for 7 categories: League Schedule, League Results, League Standings, Provincial Rankings, Tournament Schedule, Tournament Results, Tournament Standings. Each has correct headers and one example row.

2. **Validation:** After parsing, validate each row against the expected schema. Show clear errors for: wrong columns, wrong data types, missing required fields.

3. **Smart Merge Logic (server-side):**
   - For each row in the import, find matching records in the database (match by: team names + date for games, team name for standings).
   - **Same data:** Auto-confirm, show as "✓ Matched".
   - **Import has more data, no conflict:** Import wins and fills in gaps (e.g., import has period scores that we don't have). Show as "↑ Enhanced".
   - **Conflict:** Flag for review. Show side-by-side comparison (e.g., "Existing: 3-2, Import: 4-2"). Admin picks which to keep.
   - **New data:** Show as "NEW" for admin review before inserting.
   - Admin reviews all flagged items, then confirms the import.

**Acceptance Criteria:**
- Templates downloadable for all 7 categories.
- Validation catches malformed data with helpful messages.
- Smart merge correctly identifies matches, enhancements, conflicts, and new data.
- Side-by-side comparison for conflicts.
- Admin can review and confirm before data is committed.

---

### Task 3.3: Team Dashboard

**What to do:** Build the main dashboard view that replaces the simple schedule view as the home screen.

**Components (top to bottom):**

1. **Next Game Block:**
   - Shows the next upcoming game: date, time, location, opponent.
   - Your season record vs. opponent's season record.
   - Your provincial ranking vs. their provincial ranking (if available).
   - Head-to-head record (if you've played them before).
   - Context-aware: regular season shows league standings comparison, tournament shows historical record, playoff shows series record.

2. **Schedule Lookahead:**
   - Next 2–3 games after the next game.
   - Compact: date, time, opponent.
   - Tap any game → game detail.

3. **Recent Results:**
   - Last 3 games by default.
   - If on a win or loss streak, extend to show the full streak length.
   - Shows: opponent, score, W/L indicator.
   - Streak label: "5 game win streak" or "Last 3: 2W 1L".

4. **Marquee/Ticker (infrastructure only):**
   - Build the notifications/events table and the scrolling ticker UI component.
   - For now, populate from your own teams' data only (followed teams come in Phase 4).
   - Content: big wins (win by 4+), streak milestones (5+ game streak), ranking changes (moved 3+ spots).

**Acceptance Criteria:**
- Dashboard loads with correct next game and context.
- Schedule lookahead shows next 2–3 games.
- Recent results with streak detection works.
- Marquee scrolls with relevant items (even if limited content in early use).

---

## Phase 4: Social & Discovery (Weeks 6–8)

**Goal:** Add the ability to find, follow, and get intelligence about other teams.

**Dependencies:** Phase 3 complete.

---

### Task 4.1: Team Discovery & Following

**What to do:**
1. **Search page:** Search teams by name, level, skill level, association, region. Browse by division.
2. **Team public profile:** Any team has a public view showing schedule, results, record, ranking, tournament brackets. Does NOT show player roster, stats, members.
3. **Follow button:** Creates entry in `followed_teams`. Followed teams appear in Friends section.
4. **Unfollow** option.

**Acceptance Criteria:**
- Can search and find teams.
- Public profile shows correct public data.
- Following and unfollowing works.
- Followed teams appear in Friends view.
- **Multiple versions of the same real-world team:** If multiple users independently created "Nepean Wildcats U13A", search results show ALL versions. Each result shows: team name, level, division, who created it, whether it has a verified badge. Users can follow or join whichever version they want. No deduplication — all coexist.

---

### Task 4.2: Friends View & Cross-Team Intelligence

**What to do:**
1. **Friends section** (accessible from dashboard or navigation):
   - List of followed teams with record and ranking.
   - Blended upcoming schedule across all followed teams.
   - Tap any team for their public profile.

2. **Schedule overlap detection:**
   - Compare schedules across your teams + followed teams.
   - Flag games at the same venue within a 2-hour window.
   - Surface in Friends view and marquee ticker.

3. **In-app alerts** for overlaps: create notifications in `notifications` table.

**Acceptance Criteria:**
- Friends view shows all followed teams.
- Blended schedule works.
- Overlaps detected and surfaced.
- Notifications created for overlaps.

---

### Task 4.3: Team Creation & Source of Truth Claims

**What to do:**
1. **Any user can create a team.** Creating does NOT make you source of truth — just admin of that instance.
2. **"Claim This Team" button** on unclaimed/unverified teams.
3. Claim flow: user submits info about who they are → creates `source_of_truth_claims` record with status 'pending'.
4. **Platform admin review:** build a simple admin page (only visible to users with `is_platform_admin = true`) showing pending claims. Approve or deny. On approval, claimant becomes admin, team gets `is_verified = true`.
5. **Previous creator handling:** When a claim is approved:
   - If the previous creator is the current admin, the platform admin can choose to: (a) keep them as admin alongside the new verified admin, (b) demote them to contributor or teammate, or (c) remove them (they drop to Public Follower). Default: demote to teammate.
   - The previous creator is NOT notified of the ownership change (silent transition).
   - The previous creator can keep their own separate copy of the team if they created one — this is a "shadow copy."
6. **Shadow copies:** When a team becomes verified (source of truth), any other unverified versions of the same team created by other users become shadow copies. Shadow copies:
   - Are invisible to the verified team's admin (they don't show up in search for the verified admin).
   - Continue to function normally for the users who created them (personal tracking).
   - Are NOT deleted — they just don't surface in the verified team's context.
   - Implementation: add a `shadow_of_team_id` (UUID, nullable, references teams) column to the `teams` table. When a team is verified, mark other matching teams as shadows. Exclude `shadow_of_team_id IS NOT NULL` from search results shown to the verified team's admin.

**Acceptance Criteria:**
- Anyone can create a team.
- Claims can be submitted.
- Platform admin can review and approve/deny.
- Verified badge displays on approved teams.
- Previous creator's role is handled (kept, demoted, or removed) during claim approval.
- Shadow copies continue to work for their owners but are hidden from the verified admin.
- Shadow copy owners can still see and use their personal tracking version.

---

### Task 4.4: Master Admin Panel

**What to do:** Build a platform admin panel (separate from team admin) for bulk data operations.

1. **League standings import** by age/skill group: upload CSV covering multiple teams. Auto-creates shell teams for unknown teams. **For teams that already exist on the platform:** apply the smart merge logic from Task 3.2 — match by team name, auto-confirm identical data, flag conflicts for review, fill in gaps where the import has more data.
2. **Full tournament setup:** name, dates, locations, schedule CSV upload, rules/tiebreaker config, advancement rules. Preview before confirm. When the schedule CSV references teams: match existing teams by name, auto-create shells for unknown teams, apply smart merge if games already exist.
3. **Provincial qualifier loop setup:** define teams in loop, qualification spots, format, link to Provincials tournament.

**Acceptance Criteria:**
- Only platform admins can access.
- Bulk standings import works across divisions.
- Full tournament setup creates tournament with all games and rules.
- Shell teams auto-created for unknown teams.
- Existing teams get smart merge treatment (not blind overwrite) — conflicts flagged, gaps filled, matches confirmed.
- Import preview shows merge results before committing.

---

## Phase 5: Advanced Features (Weeks 8+)

**Goal:** Scenario engine, tournament mode, player stats, and advanced features. Each task below is independent and can be built in any order (respecting the dependency map in the project plan).

---

### Task 5.1: Tournament Mode

**What to do:**
1. Per-team toggle to activate tournament mode.
2. When active, dashboard shifts: pool/bracket standings replace league standings, next tournament game is primary focus, tournament schedule for your games, recent tournament results.
3. Auto-detection: "You have a tournament this weekend — switch to Tournament Mode?"
4. Friends view reprioritizes: followed teams at same tournament float to top.
5. Full tournament schedule (all teams, all games) available as tap-in option.
6. Exit prompt after tournament's last game.
7. **Simultaneous tournament mode:** Both kids' teams can be in tournament mode at the same time (same or different tournaments). Each team's tournament mode is independent. Switching teams via the team switcher shows that team's tournament context.

**Acceptance Criteria:**
- Per-team toggle works.
- Dashboard shifts to tournament context when active.
- Auto-detection suggests activating tournament mode.
- Friends at same tournament float to top.
- Full tournament schedule available.
- Exit prompt after last game.
- Team A in tournament mode and Team B in tournament mode simultaneously — each shows its own tournament dashboard when selected.

---

### Task 5.2: Scenario Engine

**What to do:**
1. **Core logic:** Given current standings, remaining games, and tiebreaker rules, generate all possible outcome permutations. For each, calculate final standings. Determine: guaranteed advance, eliminated, conditional scenarios.
2. **Output:** Natural language: "You're guaranteed to advance if you win your next game," "You need to win by 2+ goals AND Team C needs to lose."
3. **AI integration:** AI chat can trigger scenario calculations. "What do we need to advance?" runs the engine and returns a natural language answer with rule citations.
4. Accessible from standings view and AI chat.

**Computational note:** Pool play typically has 5–6 teams with 4 games each. Remaining games might be 2–8. Each game has 3 meaningful outcomes (win, loss, tie) plus score variations. The permutation space is manageable — brute force is fine.

---

### Task 5.3: Offline Score Entry

**What to do:**
1. Service worker that caches the score entry form.
2. When offline, score entry saves to localStorage.
3. When connection returns, sync queued entries to Supabase.
4. If conflict (someone else entered while offline), flag for smart merge resolution.
5. Visual indicator: "Offline — will sync when connected."

---

### Task 5.4: Player Stats System

**What to do (sequential sub-tasks):**
1. **Roster setup:** Admin creates player roster: name, jersey number, position. Private — only Teammates+.
2. **Live entry UI:** Tap-based, large jersey number buttons. Quick actions: Goal, Assist, Penalty. Timestamped events. Goal prompts for assists. Penalty prompts for type/duration. Active scorer lock.
3. **Multi-submission merge:** If two people enter stats for same game, smart merge logic applies.
4. **Views:** Player stat leaders, individual player cards, game-by-game logs.
5. **Goalie stats:** Saves, GA, GAA, shutouts, save percentage.
6. **Team shot tracking:** Shots on goal per team per period.

---

### Task 5.5: In-App Notification Center

**What to do:**
1. Build a notification center accessible from a bell icon in the app header.
2. Unread count badge on the icon (red dot or number).
3. Notification list view: scrollable list of all notifications, newest first.
4. Each notification shows: icon by type, title, body text, timestamp, read/unread indicator.
5. Tap a notification → mark as read + navigate to relevant content (e.g., tap a schedule overlap alert → goes to the schedule view).
6. "Mark all as read" and "Dismiss" (delete) actions.
7. Notification types and their triggers:

| Type | Trigger | Example |
|------|---------|---------|
| `schedule_overlap` | Cross-team overlap detected (Task 4.2) | "Both teams at ACC on Saturday" |
| `ranking_reminder` | Monthly cron or date check | "Time to update your provincial rankings" |
| `tournament_result` | Followed team completes a tournament | "Toronto Leaside Wildcats won the DWGHA tournament" |
| `claim_request` | Source of truth claim submitted (platform admin only) | "New claim for Nepean Wildcats U13A" |
| `streak_milestone` | Team reaches 5+ game win/loss streak | "Nepean Wildcats: 5 game win streak!" |

8. **Notification creation:** Build a server-side utility function `createNotification(userId, type, title, body, data)` that inserts into the `notifications` table. Call this function from the relevant business logic (score entry for streaks, schedule comparison for overlaps, etc.).

**Acceptance Criteria:**
- Notification icon in header with unread badge.
- Notification list shows all notifications.
- Tapping a notification marks it as read and navigates appropriately.
- Mark all as read works.
- Dismiss/delete works.
- At least 3 notification types are wired up and triggering correctly.

---

### Task 5.6: Practice Scheduling

**What to do:**
1. Add a "Practice" event type to the schedule system. Practices use the existing `games` table with `stage = 'practice'` OR create a separate `events` table if you prefer cleaner separation. Recommended: use a separate `team_events` table:

**`team_events`**
- `id` (UUID, PK)
- `team_id` (UUID, references teams)
- `season_id` (UUID, references seasons, nullable)
- `event_type` (text — 'practice', 'meeting', 'other')
- `title` (text, nullable — e.g., "Power play practice")
- `start_datetime` (timestamptz)
- `end_datetime` (timestamptz, nullable)
- `venue` (text)
- `notes` (text, nullable)
- `created_by` (UUID, references users)
- `created_at` (timestamptz)

2. Build a "Add Practice" form: date, time, end time (optional), location, optional notes.
3. Display practices in the schedule view with distinct visual treatment — different color (e.g., blue vs. the default game color) and a practice icon. Clearly distinguishable from games at a glance.
4. Practices appear in the schedule lookahead on the dashboard.
5. Optional per team — teams that don't use this feature simply don't add practices.

**Acceptance Criteria:**
- Can add a practice with date, time, location.
- Practices appear in the schedule view with distinct visual treatment (color + icon different from games).
- Practices appear in the dashboard schedule lookahead.
- Practices don't interfere with standings or game calculations.
- Admin and Contributor can add practices; Teammates and Followers can view them.

---

### Task 5.7: Voice-to-Stats Input

**Dependencies:** Task 5.4 (Player Stats system) must be complete.

**What to do:**
1. Add a microphone button to the player stats live entry UI (Task 5.4).
2. Use the browser `SpeechRecognition` API (Web Speech API) or integrate Whisper API for transcription.
3. Parse spoken input into structured stat events:
   - "Number 12 goal, assisted by number 7 and number 15" → Goal event for #12, Primary Assist #7, Secondary Assist #15
   - "Number 3, two minutes, tripping" → Penalty event for #3, 2 min minor, tripping
   - "Number 22 goal, unassisted" → Goal event for #22, no assists
4. Build a hockey terminology dictionary for the parser: common stat terms (goal, assist, penalty, minor, major, misconduct, tripping, hooking, slashing, etc.) and jersey number recognition (handle "twelve" vs "12").
5. **Review/correction screen:** After the game (or after each voice entry), show the parsed events for review. User can edit, delete, or confirm each event before it commits to the database. Never auto-commit voice-parsed stats — always require human review.
6. Handle common speech-to-text errors gracefully (e.g., "number to" → "number 2").

**Acceptance Criteria:**
- Microphone button activates speech recognition.
- Spoken "Number 12 goal assisted by 7" correctly parses into a goal event with assist.
- Spoken penalties parse correctly with type and duration.
- Jersey numbers recognized from speech (both "twelve" and "12").
- Review screen shows all parsed events before committing.
- User can edit or delete individual parsed events.
- Graceful degradation if browser doesn't support SpeechRecognition (hide the mic button, show message).

---

### Task 5.8: Provincial Qualifier / Loop Configuration

**Dependencies:** Tournament config from Phase 1, CSV Import from Task 3.2.

**What to do:**
1. **Schema additions:**

**`qualifier_loops`**
- `id` (UUID, PK)
- `name` (text — e.g., "Eastern Ontario U13A Loop")
- `level` (text — U9, U11, U13, U15, U18)
- `skill_level` (text — AA, A, BB, B, C)
- `qualification_spots` (integer — how many teams qualify for Provincials)
- `format` (text — 'round_robin', 'series', 'tournament')
- `target_tournament_id` (UUID, references tournaments, nullable — the Provincials tournament this loop feeds into)
- `created_by` (UUID, references users)
- `created_at` (timestamptz)

**`qualifier_loop_teams`**
- `id` (UUID, PK)
- `loop_id` (UUID, references qualifier_loops)
- `team_id` (UUID, references teams)
- `qualified` (boolean, default false)

2. **Admin setup flow:**
   - Select age/skill level.
   - Name the loop.
   - Add teams to the loop (search existing teams or create shells).
   - Set number of qualifying spots.
   - Set format (round robin, series, etc.).
   - Configure rules and tiebreakers (reuse the tiebreaker config system from tournaments).
   - Link to the Provincials tournament (select from existing tournaments or create later).

3. **Tracking:**
   - Loop standings calculated the same way as tournament pool standings (reuse the standings engine).
   - Show which teams have qualified and which are still in contention.
   - When a team qualifies, mark them in `qualifier_loop_teams.qualified = true`.

4. **Linked tournaments:** When a qualifier loop is linked to a Provincials tournament, qualifying teams are automatically added to the Provincials tournament's team list.

**Acceptance Criteria:**
- Can create a qualifier loop with teams, rules, and qualification spots.
- Standings calculated correctly using the existing tiebreaker engine.
- Qualifying teams highlighted.
- Linked tournament receives qualifying teams.
- Works for multiple age/skill levels independently.

---

### Task 5.9: Historical Data Onboarding Flow

**Dependencies:** CSV Import (Task 3.2), Regular Season (Task 2.6).

**What to do:**
1. After creating a new team, display a guided onboarding wizard: "Want to add your season so far?"
2. **Step-by-step wizard (5 steps):**

   **Step 1: Schedule**
   - "Import or enter your season schedule"
   - Options: Upload CSV (with downloadable template), or "Add games manually" (link to manual game entry form)
   - Skip button always available

   **Step 2: Results**
   - "Enter results for games already played"
   - If schedule was imported in Step 1, show the games and let user fill in scores inline
   - Or upload a Results CSV
   - Skip button

   **Step 3: League Standings**
   - "Set your current league standings"
   - Upload standings CSV or enter manually (team records)
   - Skip button

   **Step 4: Provincial Ranking**
   - "What's your current provincial ranking?"
   - Simple number input + division/level selector
   - Skip button

   **Step 5: Tournaments**
   - "Any active or upcoming tournaments?"
   - Link to tournament setup flow (from Phase 1 or master admin)
   - Skip button

3. **Progress indicator:** Show which steps are complete (green check), which are skipped (gray), and which are pending. Always visible at the top of the wizard.
4. **Resume later:** If the user exits the wizard partway through, remember their progress. Show the wizard again on next login with a "Continue setup" prompt (or "Dismiss" to skip entirely).
5. Each step uses the existing import/entry tools — the wizard is just a guided wrapper around functionality that already exists.

**Acceptance Criteria:**
- Wizard appears after creating a new team.
- All 5 steps work and connect to the correct existing functionality.
- Each step is independently skippable.
- Progress indicator shows completion state.
- Can resume later if exited mid-wizard.
- Wizard can be dismissed permanently.
- Data entered through the wizard is identical to data entered through the normal tools (same tables, same validation).

---

## Dependencies Quick Reference

```
Phase 1: All tasks are sequential (1.1 → 1.2 → 1.3 → ... → 1.11)
Phase 2: 2.1 → 2.2 → 2.3, 2.4 (parallel after 2.2)
         2.1 → 2.5 (after auth)
         2.6 can start after 2.1
Phase 3: 3.1 can start immediately
         3.2 depends on Phase 1 import existing
         3.3 depends on 2.6 (regular season data needed for dashboard)
Phase 4: 4.1 → 4.2 → 4.3 (sequential)
         4.4 can start after 4.1 + 3.2 (needs smart merge)
Phase 5: 5.1 depends on Phase 1 tournament features
         5.2 depends on Phase 1 standings engine
         5.3 is independent (just needs score entry from Phase 1)
         5.4 is independent (just needs auth from 2.1)
         5.5 is independent (notification table exists from 1.2, wire up triggers as features land)
         5.6 is independent (just needs schedule view from Phase 1)
         5.7 depends on 5.4 (player stats system)
         5.8 depends on Phase 1 tournament config + 3.2 (CSV import)
         5.9 depends on 3.2 (CSV import) + 2.6 (regular season)
```

---

## Environment Variables Needed

| Variable | Purpose | When Needed |
|----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Phase 1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public API key | Phase 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server-side only) | Phase 1 |
| `ANTHROPIC_API_KEY` | Claude API for AI chat | Phase 1 (stretch) |
| `MY_TEAM_ID` | Nepean Wildcats UUID (temporary) | Phase 1 only — removed in Phase 2 |

---

## Testing Strategy

1. **Unit tests** for the tiebreaker engine (Task 1.6) — this is the most critical business logic.
2. **Manual testing** with real tournament data — enter scores for games and verify standings match expected results.
3. **Mobile testing** — test on actual phone browsers (iOS Safari, Android Chrome) at each phase.
4. **CSV import testing** — test with well-formed and malformed CSVs.

---

## File Structure (Suggested)

```
/app
  /page.tsx                    — Landing / Dashboard
  /schedule/page.tsx           — Tournament schedule view
  /standings/page.tsx          — Pool standings
  /bracket/page.tsx            — Bracket view
  /import/page.tsx             — CSV import
  /chat/page.tsx               — AI chat (stretch)
  /admin/page.tsx              — Master admin panel (Phase 4)
  /team/[id]/page.tsx          — Team public profile (Phase 4)
  /auth/login/page.tsx         — Login (Phase 2)
  /auth/signup/page.tsx        — Sign up (Phase 2)
  /settings/members/page.tsx   — Member management (Phase 2)
  /notifications/page.tsx      — Notification center (Phase 5)
  /onboarding/page.tsx         — Historical data wizard (Phase 5)
  /qualifiers/page.tsx         — Provincial qualifier loops (Phase 5)
/components
  /schedule/GameCard.tsx
  /schedule/PracticeCard.tsx
  /standings/StandingsTable.tsx
  /bracket/BracketView.tsx
  /score-entry/ScoreEntryModal.tsx
  /chat/ChatInterface.tsx
  /layout/Navigation.tsx
  /layout/TeamSwitcher.tsx
  /notifications/NotificationBell.tsx
  /notifications/NotificationList.tsx
  /onboarding/OnboardingWizard.tsx
  /stats/LiveEntryPanel.tsx
  /stats/VoiceInput.tsx
  /stats/PlayerCard.tsx
/lib
  /supabase.ts                 — Supabase client setup
  /standings-engine.ts         — Standings + tiebreaker calculation
  /scenario-engine.ts          — "What do we need" calculations
  /notifications.ts            — createNotification() utility
  /voice-parser.ts             — Speech-to-stats parsing logic
  /types.ts                    — TypeScript types for all entities
/api
  /chat/route.ts               — AI chat endpoint
  /import/route.ts             — CSV import endpoint
  /notifications/route.ts      — Notification CRUD
```

---

*This action plan covers the complete project. Start with Phase 1, Task 1.1, and work sequentially. Each task has clear inputs, outputs, and acceptance criteria. Reference `full-project-plan.md` for detailed business rules and `requirements-checklist.md` to verify completeness at each phase.*
