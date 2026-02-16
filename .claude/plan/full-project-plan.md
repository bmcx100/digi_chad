# Minor Hockey Team Tracking App — Complete Project Plan

## How to Use This Document

This is the complete planning specification for a minor hockey team tracking app. It contains everything needed to understand the full vision and build it in phases.

**The document covers:**

1. **Steps 1–3:** Core Idea, Target Users, Core Features (the what and why)
2. **Step 4:** 13 User Flows (what users actually do, screen by screen)
3. **Step 5:** Technical Decisions (tech stack and architecture)
4. **Step 6:** MVP Scope (the first thing to build — a tournament tracker for this weekend, with real tournament data, schedule, and full ruleset)
5. **Step 7:** Phased Roadmap (high-level timeline)
6. **Phases 2–5 Detailed Build Order:** Step-by-step build instructions for everything after the MVP, with dependency map

**Building approach:**

- The database schema and architecture should support the FULL vision from day one
- But features are built in phases — MVP first, then expand
- Phase 1 (MVP) is a tournament tracker for a specific tournament happening this Friday–Sunday
- Phases 2–5 add auth, roles, multi-team, dashboard, social features, advanced features

---

# Steps 1–3: Core Idea, Target Users, Core Features

## Step 1: The Core Idea

### Problem

As a minor hockey parent, your kid's season data is fragmented. You're checking the league website for schedules, a different site for tournament brackets, texting other parents for scores, and nobody's tracking individual player stats unless the coach happens to do it. There's no single place to see the full picture of your team's season.

### Concept

A team-focused app where parents, coaches, and team staff can see everything about their team's season in one place — and follow other teams they care about.

### What It Covers

- **Game schedule** — regular season + tournament games (date, time, location, opponent)
- **Scores & results** — game-by-game outcomes, season record, period-by-period scoring (optional)
- **Tournament brackets & results** — visual brackets, pool play standings
- **Provincial rankings** — current ranking, historical movement, rankings logged against game context
- **Cross-team tracking** — follow other teams (friends' kids, upcoming opponents)
- **AI-powered queries** — ask natural language questions about any of the above

### Who It's For

Minor hockey parents (U9–U18, competitive level primarily) who want to follow their kid's team — and other teams they care about — without piecing it together from five different sources.

---

## Data Input Strategy

### Path 1: Schedules, Results, Brackets, Rankings — Web Connector

- A feature within the app that connects to external league/tournament/ranking websites
- Reads how those sites structure their data
- Parses it into a predefined schema by category (schedules formatted one way, results another, etc.)
- Runs smart merge: confirms matches, flags conflicts side-by-side, stages new data for review
- The app controls the export format on both ends — the connector outputs in the format the app expects based on data category

### Path 2: Player Stats — Live Game Entry (Later Phase)

- Tap-based UI for real-time stat input during games
- Quick buttons (goal, assist, penalty, etc.) tied to player jersey numbers
- Voice-to-stats input planned as a future enhancement
- Active scorer lock — one person claims the scoring role per game
- If two people submit stats for the same game, the same smart merge/conflict resolution kicks in

### Smart Merge System

1. Data comes in (via web connector or manual entry)
2. App compares incoming data against existing data
3. **Matches** — auto-confirmed
4. **Conflicts** — flagged with side-by-side comparison for user resolution
5. **New data** — staged for review before going live

---

## Step 2: Target Users & Problem Validation

### Users

| Role                                | Who                                    | Permissions                                                                                   |
| ----------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Admin** (multiple per team)       | Team manager, coach, designated parent | Full control: manage team data, configure team, invite users, run imports, input stats        |
| **Contributor** (multiple per team) | Stats parent, volunteer                | Input data: live game stats, scores, schedule additions. Cannot manage team settings or users |
| **Viewer**                          | Any invited team member                | Read-only: sees schedules, stats, results, rankings. Can ask questions via AI layer           |

### User Scope

- **Primary (now):** Parent with two kids on different teams, acting as admin for both
- **Secondary (now):** Other parents/coaches on those teams — log in, view data, interact
- **Future:** Any minor hockey team that wants to sign up and use the platform

### Multi-Team Support

- One login, see both (or all) kids' teams
- Follow friends' teams — see their schedules, results, rankings
- Cross-team schedule overlap alerts (same rink, same timeframe)

### Current Landscape (What People Use Today)

- **TeamSnap / RAMP** — used by teams for communication/logistics, not for the tracking this app provides
- **League websites** — have schedules and results
- **Tournament websites** — each has their own site with schedules, brackets, results
- **Provincial ranking websites** — standalone sites for rankings
- **No single source has everything**

### Problem Validation

The pain is real and widespread across competitive minor hockey (U9–U18). Parents actively seek this information and currently piece it together from multiple disconnected sources. Common questions like "what's our record?" or "when do we play next?" require awkward lookups across multiple sites.

---

## Step 3: Core Features

### Must-Have (Launch)

#### Team Management

- Create/manage a team (name, level, division, season)
- User roles: Admin, Contributor, Viewer (multiple admins and contributors allowed)
- Invite/share system for adding people to a team
- Multi-team support (one login, multiple teams)

#### Team Discovery & Ownership

- Browse/search teams already on the platform
- Follow any team to see their public data
- Anyone can create a team — creating it does NOT make you source of truth
- Source of truth is a separate claim/verification process for verified team officials
- If someone already created a team, the verified official can request to take it over and optionally copy existing public data
- Multiple versions of the same real-world team can coexist (official + personal tracking copies)
- Shadow copies are invisible to the source of truth admin

#### Following Other Teams

- Follow friends' kids' teams, upcoming opponents, any team of interest
- See their schedule, results, rankings
- Get alerts when followed teams' schedules overlap with yours
- Know in advance when you could catch a friend's game at a tournament
- Useful for scouting upcoming opponents

#### Data Privacy

- **Public data:** schedule, results, rankings, tournament brackets — visible to followers
- **Private data:** player names, jersey numbers, individual stats — NEVER exposed publicly, only visible to invited team members

#### Scheduling

- Full season schedule (date, time, location, opponent)
- Tournament schedules as distinct events
- Regular season vs. tournament distinction

#### Game Results

- Final score per game
- Period-by-period scoring (optional — supports tournament point structures that award per-period wins)
- Win/loss/tie/OTL record
- Season record tracking

#### Live Game Entry (Simplified for Launch)

- Score entry (final and optional per-period)
- Active scorer lock (one person claims the game)
- Multi-submission merge/conflict resolution if two people submit for the same game

#### Tournament Brackets & Results

- Visual bracket display
- Pool play standings
- Results flowing into brackets

#### Provincial Rankings

- Current ranking display
- Historical ranking movement over the season (trend visualization)
- Rankings logged against game context — e.g., "Beat Team A on Oct 15 when we were ranked 11th and they were ranked 19th"

#### Data Import — Web Connector

- Built-in feature that connects to external league/tournament/ranking websites
- Parses data into predefined schema by category
- Smart merge: confirm matches, flag conflicts, stage new data for review
- Category-specific formatting controlled by the app

#### AI Conversational Layer

- LLM (e.g., Claude API) connected to all team data
- Natural language questions about schedule, results, rankings, records
- Works across multiple teams (your teams and followed teams)
- Example queries:
  - "When's our next game?"
  - "What's our record in tournament play this season?"
  - "How did we do last time we played the Wolves?"
  - "Do any of our followed teams play at the same rink this weekend?"

#### Cross-Team Intelligence

- Schedule overlap detection across your teams AND followed teams
- Same rink / same time window alerts
- Especially valuable at tournaments
- "Your son's team plays at 10am at Rink A, and his friend's team plays at 11:15am at the same rink"

---

### Later Phases

#### Player Stats (Phase 2)

- Tap-based live stat entry UI (goals, assists, PIMs per player)
- Player roster with jersey numbers for quick selection
- Goalie stats (saves, GAA, shutouts)
- Team shot tracking (shots on goal per team, not per player)

#### Enhanced Scheduling

- Practice scheduling option added to the schedule feature

#### Voice Input (Phase 3)

- Voice-to-stats transcription during games
- App parses spoken input into structured stats
- Reviewed/corrected after the game

---

### Key Differentiators

1. **Source-agnostic** — works with any league platform through the web connector; not locked to one ecosystem
2. **AI-powered queries** — no other minor hockey app lets you ask questions in plain English
3. **Cross-team intelligence** — schedule overlap detection for multi-kid families and tournament weekends
4. **Rankings in context** — not just current ranking, but historical movement tied to actual game results
5. **Smart merge system** — data import that validates, compares, and resolves conflicts rather than blindly overwriting
6. **Follow any team** — social awareness layer without being a social network; know when friends have big wins or games you could catch
7. **Flexible ownership model** — anyone can track any team; verified officials can claim source of truth; no one is locked out

---

## _Steps 4–7 to be completed._

# Step 4: User Flows

## Flow 1: New User — First Time Setup

1. **Landing screen** — brief pitch of what the app does, sign up or log in
2. **Create account** — email + password, or sign in with Google/Apple
3. **"What would you like to do?"** — two paths:
   - **"Set up my team"** → team creation flow
   - **"Find a team to follow"** → team search/browse
4. **If setting up a team:**
   - Enter team name, level (U9–U18), division, association/league
   - User becomes Admin by default
   - Prompted to invite others (share link or enter emails) — skippable
   - Lands on empty team dashboard, ready to add data
5. **If finding a team:**
   - Search/browse existing teams on platform
   - Follow one or more teams
   - Lands on feed/dashboard showing followed teams
   - Option always available to create own team later

---

## Flow 2: Home Screen / Team Dashboard

### Top Level

- Toggle/switch between your main teams (e.g., Kid A's team ↔ Kid B's team)

### Marquee / Ticker

- Scrolling interesting information from across your world (your teams + followed teams)
- Content TBD — big wins, ranking jumps, tournament results, schedule overlaps, etc.

### Next Game Block (Primary Focus)

- Date, time, location, opponent
- Your season record vs. their season record
- Your provincial ranking vs. their provincial ranking
- Head-to-head history (if you've played them before)
- **Context shifts based on game type:**

| If next game is... | Dashboard emphasizes...                                  |
| ------------------ | -------------------------------------------------------- |
| Regular season     | League standings + provincial rankings                   |
| Tournament game    | Historical record against opponent + provincial rankings |
| Playoff game       | Playoff standings / series record + provincial rankings  |

Provincial rankings are **always** visible regardless of game type.

### Schedule Lookahead

- Preview of the game after next (and possibly one more)
- Enough to see what's coming without navigating to full schedule

### Recent Results

- Last 3 games by default
- If on a streak (win or loss), extends to show full streak length
  - e.g., "Last 5 games are wins" or "7 game losing streak"
- Shows score and opponent for each game

### Friends Section

- Quick switch to see followed teams
- List of followed teams, each showing:
  - Record to date
  - Provincial ranking
- Blended upcoming schedule across all followed teams
- Tap any team for full details

---

## Flow 3: Tournament Mode

### Activation

- Per-team, NOT global — Team A can be in tournament mode while Team B is in regular season
- Both teams can be in tournament mode simultaneously (same or different tournaments)
- Activated when team enters a tournament (manual toggle or detected from schedule)

### What Changes in Tournament Mode

- **Dashboard** shifts to tournament context:
  - Pool/bracket standings for your team
  - Next tournament game with opponent context (historical record + provincial rankings)
  - Tournament schedule for YOUR games
  - Recent tournament results
- **Friends view reprioritizes:**
  - Followed teams at the same tournament float to the top
  - Other followed teams still visible, just deprioritized
- **Full tournament schedule** (all teams, all games) available as a tap-in option
  - Not the default view
  - Useful for planning your day — see what games are on which rinks and when
  - Helps find gaps to watch other games

### Per-Team Context

- Switch to Team A → tournament dashboard for their tournament
- Switch to Team B → regular season dashboard (or their own tournament if applicable)

### Exit

- After tournament's last game, prompt to exit Tournament Mode
- Returns to normal dashboard view

---

## Flow 4: Game Day — Score Entry

1. **Who:** Admin or Contributor (with permission)
2. **Where:** Tap the game on the dashboard (showing as current/recent)
3. **What they enter:**
   - Final score (required minimum)
   - Period-by-period scores (optional)
   - Additional game data fields (full list TBD — to be provided later)
4. **Confirmation:** One person's entry is sufficient — no verification required for manual entry
5. **Later conflict resolution:** If import data arrives later (e.g., tournament results CSV):
   - No conflicts + import has more data → import wins, fills in gaps
   - No conflicts + same data → auto-confirmed
   - Conflicts → flagged for side-by-side review

---

## Flow 5: Data Import via CSV

### Import Flow

1. Admin goes to import section of the app
2. Selects data category
3. Optionally downloads the CSV template for that category
4. Uploads filled-in CSV
5. App parses based on expected schema for that category
6. Shows preview: "Here's what we found"
7. Smart merge runs — confirms matches, flags conflicts, highlights gaps
8. Admin reviews and confirms

### Import Categories

**1. League Schedule**

- Fields: date, time, location/rink, home team, away team
- Updates: adds new games, flags conflicts if game exists with different details (time/location change)

**2. League Results**

- Fields: date, home team, away team, home score, away score
- Optional: period scores, additional game data
- Updates: fills in scores for existing scheduled games, flags conflicts if score differs

**3. League Standings**

- Fields: team name, wins, losses, ties, OTL, points, games played
- Updates: overwrites or flags if tracked record doesn't match official standings

**4. Provincial Rankings**

- Fields: team name, rank, division/level
- Optional: date/timestamp for when ranking was published
- Updates: adds new ranking snapshot, builds historical trend over time

**5. Tournament Schedule**

- Fields: tournament name, date, time, rink, home team, away team, pool/bracket identifier
- Updates: same as league schedule but scoped to a specific tournament

**6. Tournament Results**

- Fields: tournament name, date, home team, away team, home score, away score
- Optional: period scores
- Updates: same merge logic as league results

**7. Tournament Standings**

- Fields: tournament name, pool/bracket, team name, wins, losses, ties, points
- Updates: reflects current tournament pool/bracket standings

### CSV Templates

- Downloadable from the app for each category
- Pre-formatted with correct column headers
- Admin fills in data, uploads — no guessing about format

---

## Flow 6: Game Data Schema

### Core (Required)

- game_id
- division
- stage (regular season, tournament pool play, tournament bracket, playoff)
- pool_id (for tournament pool play)
- start_datetime
- venue/rink
- home_team_id, away_team_id
- final_score_home, final_score_away
- result_type (regulation / forfeit)

### Period Detail (Optional)

- goals_by_period_home[], goals_by_period_away[]
- Supports per-period win point structures some tournaments use
- Also captures shutout periods

### Tiebreaker Data (Optional)

- fastest_goal_seconds_home, fastest_goal_seconds_away
- penalty_minutes_home, penalty_minutes_away
- Head-to-head derived from team IDs (no separate field needed)

### Overtime/Shootout (Optional)

- end_reason (regulation / OT / shootout)
- overtime_winner_team_id
- shootout_winner_team_id

---

## Flow 7: Tournament Configuration

### Tournament Structure (Flexible per Tournament)

Tournaments are built from phases — the app supports mixing and matching:

| Phase                       | Variations                                                                        |
| --------------------------- | --------------------------------------------------------------------------------- |
| **Round Robin / Pool Play** | Single pool or multiple pools. Variable pool sizes.                               |
| **Advancement**             | Top 1, 2, or more from each pool advance. Bottom teams may go to consolation.     |
| **Elimination**             | Quarter-finals, semi-finals, finals. Single elimination typically.                |
| **Consolation**             | Optional bracket/games for non-advancing teams to guarantee minimum games played. |

Example config: "3 pools of 4 teams, top 2 from each pool advance to quarter-finals, bottom teams play consolation round."

### Point Structure

- Default standard (e.g., 2 pts win, 1 pt tie, 0 pts loss) but configurable per tournament
- Support for bonus points (period wins, shutouts, etc.)

### Tiebreaker Configuration

Admin sets tiebreaker rules per tournament using two types:

**Type 1: Simple Sort**

- Head-to-head record
- Goal differential
- Goals for
- Goals against
- Fewest penalty minutes
- Fastest first goal
- Shutout periods

**Type 2: Custom Formula (almost always one per tournament)**

- Uses a formula combining multiple stats
- Example: GF / (GF + GA) calculated to 5 decimal places
- Admin picks stats, defines formula, sets decimal precision, sets whether higher or lower wins
- Placed into the priority order alongside simple sort items

**Example tiebreaker configuration:**

1. Head-to-head record (simple)
2. GF / (GF + GA) ratio to 5 decimals (custom formula)
3. Goal differential (simple)
4. Fewest PIMs (simple)
5. Fastest first goal (simple)

In practice, almost every tournament uses at least one custom formula (typically a goals ratio). Rarely if ever two, but almost never zero.

### Scenario Engine ("What Do We Need")

Based on:

- Current pool standings
- Remaining games in the pool
- The specific tiebreaker rules for this tournament
- Possible outcomes of remaining games

The app calculates scenarios:

- "You're guaranteed to advance if you win your next game"
- "You need to win by 2+ goals AND Team C needs to lose"
- "You're currently 3rd on goal differential — a shutout win puts you 2nd"

This is computationally feasible — finite set of remaining games with finite outcomes. The app runs through permutations against the configured tiebreaker rules.

### Provincial Qualifiers

Multi-stage tournament system:

1. Teams are in a **loop** (geographic or divisional grouping)
2. Each loop has a different number of teams
3. A set number of teams from each loop qualify
4. The loop plays out like a tournament (round robin or series of games)
5. Qualifying teams advance to the **actual Provincials tournament**
6. Provincials itself is another tournament with its own format and rules

The app supports **linked tournaments** — a qualifier that feeds into a main event, where standing in one determines entry into the next.

---

## Flow 8: Inviting People / Team Access

### Access Levels

| Level               | How you get it                                | What you see                                                          |
| ------------------- | --------------------------------------------- | --------------------------------------------------------------------- |
| **Public Follower** | Follow the team or click a shared link        | Schedule, results, rankings, tournament brackets                      |
| **Teammate**        | Invited by Admin                              | Everything public + player roster (names/numbers, no contact details) |
| **Contributor**     | Invited by Admin                              | Everything Teammate sees + can input scores and data                  |
| **Admin**           | Created the team or promoted by another Admin | Everything + manage members, configure team, run imports              |

### Sharing

- Anyone on the team (Admin, Contributor, Teammate) can share a link to the team
- The shared link is a **public link** — lets someone follow/view the team's public data
- Same as following the team — no private access granted

### Granting Team Membership (Private Access)

- **Only an Admin** can approve someone into the inner circle
- Admin goes to team settings → Members
- Invites via role-specific link (Teammate link or Contributor link) or email
- Admin can change roles after someone joins
- Admin can promote members to Admin

### Invite Links

- Expire in one month
- Role-specific (Teammate link vs. Contributor link)
- Admin controls role changes after joining

### Member List Visibility

- Admin-only — Teammates and Contributors cannot see who else is on the team

### Removing Members

- Admin removes someone → they silently drop to Public Follower status
- They can still see public data
- No notification sent

---

## Flow 9: Following a Team

1. User taps "Find a team" from home screen or navigation
2. **Search/browse:**
   - Search by team name, level, division, association
   - Browse by region or level
3. **Results show:**
   - Team name, level, division
   - Whether it's a source-of-truth verified team (badge)
   - If multiple versions exist, they're all listed
4. **Tap a team → team preview:**
   - Their record, provincial ranking, upcoming schedule
   - "Follow" button
5. **Follow → team appears in your Friends section**
   - Their schedule feeds into cross-team overlap detection
   - Their results show in your marquee if noteworthy

---

## Flow 10: AI Chat

### Access

- Available via icon in the main navigation — accessible from anywhere in the app
- Every role can use it: Public Followers, Teammates, Contributors, Admins
- Supports text input and audio/voice input

### Data Access Rules

The AI's maximum access level is **Teammate** — it is the team's all-knowing teammate, not an admin tool.

| User Role       | AI Can Access                                            |
| --------------- | -------------------------------------------------------- |
| Public Follower | Public data only (schedule, results, rankings, brackets) |
| Teammate        | Public data + roster (names/numbers, no contact details) |
| Contributor     | Same as Teammate (AI caps at Teammate level)             |
| Admin           | Same as Teammate (AI caps at Teammate level)             |

The AI **never** sees member lists, email addresses, contact info, or any admin-level data.

### Capabilities

- Answer questions about any data the user has access to
- Cross-team queries (compare your team to followed teams)
- Tournament scenario engine ("what do we need to advance")
- Historical context ("how were we ranked when we beat them")
- Schedule intelligence ("who plays at the same rink this weekend")

### Limitations

- **Read-only** — cannot take actions like entering scores. Input stays manual.
- No access to contact details regardless of role
- Only sees what the user's role allows

### Example Interactions

- "What's our record this season?"
- "When do we play the Wolves next?"
- "What's our record against them all time?"
- "How were we ranked when we beat them in October?"
- "Do any of my followed teams play at the same rink this weekend?"
- "What do we need to advance in this tournament?"
- "How has our ranking changed since September?"
- "Which team in our pool has the most penalty minutes?"
- "Compare our record to Jake's team's record"

---

## Flow 11: Claiming Source of Truth

1. Team official discovers the team already exists on the platform (someone else created it)
2. Taps "Claim this team" or "Request ownership"
3. Submits a request with basic info about who they are and their role with the team
4. **Manual review** — platform admin (you) reviews and approves/denies
5. If approved:
   - They become Admin of that team
   - Can choose to keep existing data or start fresh
   - Team gets a "Verified" badge
6. Previous creator:
   - Could stay on in a role if new admin allows
   - Could drop to Public Follower
   - Could keep their own shadow copy and track independently

---

## Flow 12: Historical Data Entry & Onboarding

### Scope

Current season only — no multi-year history.

### First-Time Setup Guided Onboarding

After creating a team, app prompts: "Want to add your season so far?"

Walks admin through step by step:

1. **Step 1:** Import or enter your schedule (download CSV template, fill in, upload — or enter manually)
2. **Step 2:** Import or enter results for games already played
3. **Step 3:** Set your current league standings
4. **Step 4:** Set your current provincial ranking
5. **Step 5:** Any active or upcoming tournaments? Configure them now

Each step is skippable — come back to it later. Progress indicator shows what's been set up and what's still missing.

### Provincial Rankings Reminder

- Monthly reminder/notification: "Time to update your provincial rankings"
- Quick flow: upload new ranking CSV or manually update position
- New snapshot gets added to the historical trend automatically

---

## Flow 13: Master Admin — Bulk Data Import

### Context

The platform-level super admin (distinct from team-level admin) can seed the entire system with data that benefits all users.

### Skill Levels

AA, A, BB, B, C

### Age Groups

U9, U11, U13, U15, U18

### Master Admin Panel

Separate from normal team admin — only platform admins can access.

### Import Actions

| Action                     | Frequency                                           | Input                                                       |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| League standings update    | Periodic (monthly with provincial ranking reminder) | CSV per age/skill group or single CSV with age/rank columns |
| Tournament setup           | 1–2x per month                                      | Schedule CSV + manual rules/tiebreaker config               |
| Provincial qualifier loops | Once per season per age/skill level                 | Manual setup                                                |

### League Standings Import

- Grouped by age + skill level (e.g., U13 AA, U11 A)
- Single CSV per group, or one CSV covering multiple groups with age/rank columns
- Too many teams to do individually — bulk is the only realistic approach
- Auto-creates unowned team shells for any team not yet on the platform
- Existing teams get smart merge treatment

### Tournament Setup

- Frequency: 1–2 tournaments per month when kids are playing
- Fresh rules input each time — no templating from previous tournaments
- Full setup process:
  1. Enter tournament name, dates, location(s)
  2. Upload schedule CSV (all games, all teams)
  3. Configure rules: point structure, tiebreakers (including custom formula), advancement
  4. Preview: shows pools, teams, schedule
  5. Confirm — tournament created, all teams populated

### Provincial Qualifier Loops

- Set up per age/skill level
- Define the loop: which teams are in it, how many qualify
- Set format of the qualifier (round robin, series, etc.)
- Set rules and tiebreakers
- Link the qualifier to the Provincials tournament it feeds into

### Auto-Created Teams

When bulk import references teams that don't exist on the platform, they are created as **unowned public shells** — they have schedule and results data but no admin, no private data, no source of truth. Anyone can later claim them or follow them. This is how the platform gets seeded with useful data before users sign up.

---

## _Step 4 Complete. Step 5: Technical Decisions to follow in separate document._

# Step 5: Technical Decisions

## Tech Stack

### Frontend

- React + Next.js
- Tailwind CSS + shadcn/ui
- Mobile-first responsive design — built for phone screens first, scales up to desktop
- Deployed on Vercel

### Backend / Database

- Supabase (PostgreSQL + built-in auth + real-time subscriptions + storage)
- Next.js API routes for business logic (smart merge, scenario engine, CSV parsing)

### Authentication

- Supabase Auth (email/password, Google, Apple sign-in)
- Row Level Security (RLS) to enforce role-based access at the database level
- Roles: Public Follower, Teammate, Contributor, Admin

### AI Integration

- Claude API for conversational layer
- Next.js API route as middleware: user question → assemble relevant data from Supabase based on user's role → send to Claude with context → return answer
- Audio input via browser speech-to-text API before sending to Claude

### CSV Import

- Parsed in Next.js API routes using PapaParse
- Validated against schema per category
- Smart merge logic runs server-side comparing against existing Supabase data

### Real-time

- Supabase real-time subscriptions available but **NOT required for launch**
- Live score updates deferred to a later phase
- Standard page refresh / polling is sufficient initially

### Notifications

- In-app notifications (not push, not email)
- Schedule overlap alerts, tournament updates, ranking reminders
- Notification center in the app where unread items accumulate

### Offline Score Entry

- Score entry works offline using local storage / service worker
- Queues the entry locally
- Syncs to Supabase when connection returns
- If a conflict exists when syncing (someone else entered while you were offline), smart merge flags it

### Hosting

- Vercel for the Next.js app
- Supabase cloud for database / auth / storage

## Platform Strategy

- Web app with mobile-first layout and functionality as the priority
- Responsive design scales up to desktop
- No native mobile app at launch — responsive web app covers both phone and desktop use cases
- Native apps (App Store / Google Play) can be considered later if demand warrants it

---

## _Step 5 Complete. Step 6: MVP Scope to follow in separate document._

# Step 6: MVP Scope

## MVP Focus: Tournament Tracker

The MVP is built for one immediate use case: tracking the upcoming U13A tournament this weekend (Friday–Sunday). Single user (you), one team (Nepean Wildcats), one tournament. Architecture supports future expansion to multi-team, multi-user, full season tracking.

## Your Team

- **Nepean Wildcats #2859**
- **Division:** U13A
- **Pool:** A

---

## Tournament Structure

### Format

- 2 Pools (A and B), 5 teams each
- Round robin within pools
- Top 2 from each pool advance to semi-finals
- Semi-finals: 1A vs 2B, 1B vs 2A
- Final: Winners of semi-finals
- No consolation/bronze medal game

### Point Structure

- Win: 2 points
- Tie: 1 point
- Loss: 0 points

### Goal Differential Cap

- Maximum +5 per game for differential calculations
- If you win 8-0, it counts as +5 not +8

### Tiebreaker Rules (in priority order)

1. **Number of wins** (simple sort, higher is better)
2. **Head-to-head record** between tied teams (only applies if exactly 2 teams tied)
3. **GF / (GF + GA) ratio** (custom formula, calculated to 5 decimal places, higher is better)
4. **Fewest Goals Against** (simple sort, lower is better)
5. **Fewest Penalty Minutes** (simple sort, lower is better)
6. **Earliest first goal scored across all preliminary games** (by game clock, lower time is better)
7. **Coin Toss**

**Important rule:** Once a tiebreaker rule has been used to separate teams from a group, it cannot be reused. If head-to-head breaks a 3-way tie to 2 teams, the remaining 2 teams skip head-to-head and go to the next applicable rule.

---

## Pool A Teams

| Team                      | ID    |
| ------------------------- | ----- |
| Nepean Wildcats           | #2859 |
| Southpoint Stars          | #6672 |
| Peterborough Ice Kats     | #1484 |
| Markham-Stouffville Stars | #3582 |
| Scarborough Sharks        | #845  |

## Pool B Teams

| Team                     | ID    |
| ------------------------ | ----- |
| Toronto Leaside Wildcats | #3792 |
| Napanee Crunch           | #1878 |
| North Bay Junior Lakers  | #6254 |
| Cornwall Typhoons        | #2328 |
| Durham West Lightning    | #310  |
| Central York Panthers    | #3    |

**Note:** Pool B has 6 teams, Pool A has 5 teams.

---

## Schedule

### Friday — Pool A Games

| Game # | Time    | Rink  | Home                            | Away                            |
| ------ | ------- | ----- | ------------------------------- | ------------------------------- |
| 3      | 9:00 AM | ACC 2 | Nepean Wildcats #2859           | Southpoint Stars #6672          |
| 3      | 9:15 AM | ACC 1 | Peterborough Ice Kats #1484     | Markham-Stouffville Stars #3582 |
| 48     | 2:00 PM | ACC 4 | Scarborough Sharks #845         | Nepean Wildcats #2859           |
| 52     | 6:00 PM | ACC 4 | Peterborough Ice Kats #1484     | Southpoint Stars #6672          |
| 25     | 7:00 PM | ACC 2 | Markham-Stouffville Stars #3582 | Scarborough Sharks #845         |

### Friday — Pool B Games

| Game # | Time    | Rink       | Home                           | Away                           |
| ------ | ------- | ---------- | ------------------------------ | ------------------------------ |
| 2      | 8:15 AM | ACC 1      | Toronto Leaside Wildcats #3792 | Cornwall Typhoons #2328        |
| 43     | 8:20 AM | ACC 4      | Napanee Crunch #1878           | North Bay Junior Lakers #6254  |
| 30     | 8:30 AM | ACC 3      | Central York Panthers #3       | Durham West Lightning #310     |
| 114    | 2:00 PM | Don Beer 2 | Napanee Crunch #1878           | Central York Panthers #3       |
| 142    | 2:00 PM | O'Brien    | North Bay Junior Lakers #6254  | Cornwall Typhoons #2328        |
| 99     | 2:15 PM | Don Beer 1 | Durham West Lightning #310     | Toronto Leaside Wildcats #3792 |

### Saturday — Pool A Games

| Game # | Time     | Rink            | Home                            | Away                            |
| ------ | -------- | --------------- | ------------------------------- | ------------------------------- |
| 322    | 7:00 AM  | Oshawa Canlan 1 | Nepean Wildcats #2859           | Peterborough Ice Kats #1484     |
| 171    | 7:15 AM  | ACC 1           | Southpoint Stars #6672          | Scarborough Sharks #845         |
| 204    | 11:15 AM | ACC 3           | Central York Panthers #3        | Toronto Leaside Wildcats #3792  |
| 221    | 1:00 PM  | ACC 4           | Markham-Stouffville Stars #3582 | Nepean Wildcats #2859           |
| 210    | 5:55 PM  | ACC 3           | Southpoint Stars #6672          | Markham-Stouffville Stars #3582 |
| 226    | 6:00 PM  | ACC 4           | Scarborough Sharks #845         | Peterborough Ice Kats #1484     |

### Saturday — Pool B Games

| Game # | Time     | Rink  | Home                           | Away                          |
| ------ | -------- | ----- | ------------------------------ | ----------------------------- |
| 218    | 10:00 AM | ACC 4 | Durham West Lightning #310     | North Bay Junior Lakers #6254 |
| 189    | 11:00 AM | ACC 2 | Cornwall Typhoons #2328        | Napanee Crunch #1878          |
| 208    | 3:55 PM  | ACC 3 | North Bay Junior Lakers #6254  | Central York Panthers #3      |
| 194    | 4:00 PM  | ACC 2 | Toronto Leaside Wildcats #3792 | Napanee Crunch #1878          |
| 179    | 5:15 PM  | ACC 1 | Cornwall Typhoons #2328        | Durham West Lightning #310    |

**Note:** Game #204 (Saturday 11:15 AM) appears to be a cross-pool game — Central York Panthers (Pool B) vs Toronto Leaside Wildcats (Pool B) but listed under Pool A schedule. May need clarification.

### Sunday — Elimination Round

| Game # | Time    | Rink       | Matchup                                      |
| ------ | ------- | ---------- | -------------------------------------------- |
| 365    | 8:15 AM | Don Beer 1 | 1st in Pool A vs 2nd in Pool B               |
| 372    | 8:30 AM | Don Beer 2 | 1st in Pool B vs 2nd in Pool A               |
| 368    | 1:00 PM | Don Beer 1 | Winner Game #365 vs Winner Game #372 (Final) |

---

## Game Data to Record Per Game

### Required

- game_id
- final_score_home, final_score_away
- result_type (regulation / forfeit)

### Optional (but needed for tiebreakers)

- goals_by_period_home[], goals_by_period_away[]
- penalty_minutes_home, penalty_minutes_away
- fastest_goal_seconds_home, fastest_goal_seconds_away (earliest first goal by game clock)

---

## MVP Features to Build

### Must Have (for this tournament)

1. **Tournament view** — see both pools, all teams, full schedule
2. **Score entry** — tap a game, enter final score + optional period scores, PIMs, first goal time
3. **Pool standings** — auto-calculated from entered results using the point structure
4. **Tiebreaker engine** — applies tiebreaker rules in correct priority order with the custom GF/(GF+GA) formula
5. **Bracket view** — semi-finals and final, populated from pool results
6. **Your team highlighted** — Nepean Wildcats always visually distinct in standings, schedule, brackets

### Stretch Goal (if time allows)

7. **Scenario engine** — "what do we need to advance" calculations based on remaining games and tiebreaker rules

### Deferred (build after tournament)

- Authentication / user accounts
- Roles (Admin, Contributor, Teammate, Public Follower)
- Invite links and team sharing
- Following other teams / Friends view
- Regular season dashboard with contextual next game
- CSV import with smart merge and templates
- AI conversational layer
- Cross-team schedule overlap detection
- Provincial rankings tracking
- Master admin bulk import
- Tournament mode toggle (right now the whole app IS tournament mode)
- Offline score entry with sync
- In-app notifications
- Marquee / ticker
- Historical data onboarding flow
- Source of truth claiming
- Provincial qualifier / loop configuration

---

## Architecture Notes

Even though MVP is a single-tournament tracker, the database schema and component structure should be designed to support the full vision:

- **Teams table** — not hardcoded, supports any number of teams
- **Tournaments table** — supports multiple tournaments with different configs
- **Games table** — linked to tournaments, pools, teams
- **Tournament config** — point structure, tiebreaker rules stored as ordered list with formula support
- **Users table** — exists even if only you use it now, ready for roles and invites
- **Followed teams / team membership** — tables exist, just unused in MVP

This ensures nothing gets thrown away or rebuilt when expanding after the tournament.

---

## Tournament Name

**DWGHA Bolts & Hearts Annual Tournament**
February 13–15, 2026

---

## Full Tournament Ruleset

The following is the complete official ruleset. The AI conversational layer should be able to reference these rules by number when answering questions.

```
DWGHA Bolts & Hearts Annual Tournament
February 13-15, 2026
Tournament Rules (4 Game Guarantee)

1. All current Hockey Canada and OWHA Rules shall govern Tournament play except as amended below.
   The decisions of the Tournament Officials are final with no appeals.

2. All U9 A/B, U11 AA/A/BB/B/DS, U13 A/B/C/DS, U15BB/B/C/DS and U18 B/C/DS round-robin games will
   consist of a 3-minute warm-up and 10-10-12 minute stop time periods. All U13 AA, U15A, U18A and
   U18BB round-robin, Elimination, Semi-Final and Final Games shall be 15-12-15 minute stop time
   periods with a flood between either the 1st/2nd period or the 2nd/3rd periods.

3. All Teams MUST be available to play 20 minutes prior to scheduled start time as Tournament officials
   reserve the right to start any game up to 20 minutes prior to its scheduled start time. The clock will
   start in warm-up at 13 minutes for 10-10-12 Games and 18 minutes for 15-12-15 Games. The referee
   will blow the whistle at 12 and 16 minutes respectively to warn the teams warm-up is ending. The time
   will continue to run until the first (whistle) stoppage of play in the game.

4. Tournament officials reserve the right to waive the flood between periods if the tournament is running
   behind; or between games if the tournament is running behind AND the ice is deemed safe to play by
   the tournament officials in consultation with the referees.

5. The OWHA minimum suspension guidelines will be strictly enforced. All suspensions will be enforced
   according to the 2025-26 OWHA Minimum Suspension List.

6. Home teams shall wear dark jerseys and Visitors shall wear light jerseys. DS teams bring their own
   Pinnies. If jerseys are deemed too similar by officials, the Home team is required to change jerseys or
   wear pinnies.

7. To be eligible to participate in the tournament, the participant's name must appear on the OWHA team
   roster, Canadian Provincial Roster or USA Hockey Official Roster.

8. Each team is permitted a maximum of 20 rostered players including goaltenders. Players must be
   rostered with the registered team on the team's OWHA (or other applicable governing body) approved
   roster or be approved for pick up using RAMP. A player is only eligible to play for one team in the
   tournament. There will be NO exceptions to this rule regardless of injuries, suspensions, and/or for
   goaltenders. In order to qualify for post round-robin play, a player must have played a minimum of one
   round-robin game.

9. If there is a goal spread in the third period of 5 goals or more, there shall be running time until the goal
   spread is reduced to less than 3, then stop time will resume.

10. There will be no time-outs permitted in round-robin play, elimination games or quarter-final games.
    There will be one, 30 second time-out per team permitted in semi-final and championship games.

11. In round-robin play, teams will be awarded two points for a win, one point for a tie, and zero points for
    a loss.

12. Standings after the round-robin play will be based on each team's points total. In the event of a tie, the
    following tie-breakers will be applied:
    In the event of a tie, the following criteria will be used to break the tie:
    a) Number of wins
    b) Winner between the tied teams when they played head to head (does not apply if more than two
       teams tied)
    c) Percentage as calculated by dividing team's total "Goals For" by the SUM of the team's "Goals For
       and Goals Against". TGF / (GF+GA) = % (See Chart)
    d) Fewest Goals Against.
    e) Fewest Penalty Minutes.
    f) First goal scored in preliminary games.
    g) Coin Toss.
    Note: Highest goal differential (goals for minus goals against). (max +5 for all games)
    Note: Follow Tie breaking rules in Order. Once a Tie Breaking Rule has been used or is not applicable
    and it cannot be used again.

13. All post round-robin games shall be played to a winner. Regulation games lengths shall be 10-10-12
    minute stop time periods, except for the 15-12-15 minute stop time games as noted in Rule #2 above.
    Any post round-robin games (Elimination, Quarter-Finals, Semi-Finals and Finals) tied after regulation
    time shall be played to a winner in the following format, with goaltenders. Teams do not change ends
    for Overtime or Shoot Outs.
    i.   3 minutes, 4 on 4 (plus goalies), stop time, sudden victory overtime period.
    ii.  3 player shoot-out, simultaneous shots from center ice line, on each goal.
    iii. Sudden victory shoot-out, simultaneous shots from center ice line, on each goal.

    Notes to Overtime Rules:
    a) At the start of the overtime period (i), and any time during the overtime period (i), any team that
       has a player serving a minor penalty shall play short-handed, teams play 4 on 3. If a second penalty
       is called on the SAME TEAM and the first penalty has not expired, then it will be treated as a
       delayed penalty and will commence when the first penalty expires. The Maximum a Team may be
       at a disadvantage is 4 on 3 during the overtime period. Note: This does not apply to offsetting
       minor penalties.
    b) Goaltenders may be removed for an extra attacker at any time in the overtime period (i).

    Notes to Shoot Out Rules:
    Each team must designate 3 shooters (S1, S2, S3) directly at the sign-in prior to the start of any post
    round-robin games (all elimination games).
    a) Any player serving a penalty at the end of overtime will not be eligible to participate in the shoot
       out. The coach must designate a shooter(s) to take her place(s) immediately at the end of
       regulation time.
    b) All players except shooter and goalies will be on the bench. Once a player has shot, they will go to
       the penalty box.
    c) All 3 designated shooters from each team will shoot. If still tied, each team will designate one
       shooter at a time until there is a winner. A player may not shoot for a second time until all players
       on the game sheet (except goalies) have shot.

14. It is the team's responsibility to ensure a clean dressing room is left upon completion of their game. All
    teams are requested to vacate the dressing room 30 minutes or less after their game is completed.

15. The Tournament Committee reserves itself the final word on the interpretation of the rules.

16. Championship awards and medals MAY be presented off-ice if deemed by Tournament Officials due to
    time constraints and will be presented at a determined location as required.

17. Spectators are not allowed to go on the ice to take pictures after games. We thank you for your
    anticipated support.
```

### AI Ruleset Integration

- Full ruleset text is included in the AI's system prompt as context
- When the AI answers questions about tiebreakers, overtime, scheduling rules, etc., it cites the specific rule number
- Example: "Per Rule 12c, the tiebreaker ratio is calculated as GF / (GF + GA)..."
- Example: "Per Rule 9, running time kicks in when the goal spread reaches 5+ in the third period"
- Example: "Per Rule 13i, overtime is 3 minutes of 4-on-4 sudden victory"
- Users can also browse the full ruleset document within the app

### Key Rules That Affect App Logic

- **Rule 2:** U13A games are 10-10-12 stop time (affects period tracking)
- **Rule 9:** Mercy rule — running time at 5+ goal spread in 3rd, stops at less than 3
- **Rule 11:** Points — 2 for win, 1 for tie, 0 for loss
- **Rule 12:** Full tiebreaker order with custom formula and cascading rule (used rules can't be reused)
- **Rule 12 Note:** Goal differential capped at +5 per game
- **Rule 13:** Overtime and shootout format for post round-robin games

---

## _Step 6 Complete. Step 7: Roadmap & Next Steps to follow in separate document._

# Step 7: Phased Roadmap

## Phase 1: Tournament MVP (This Week — Before Friday)

Build order, in priority sequence:

### 1. Database Schema

- Teams, tournaments, pools, games, tiebreaker config
- Design for the full vision (users, roles, followed teams, seasons) even though only a slice is used now
- Supabase PostgreSQL

### 2. Seed Tournament Data

- Hardcode DWGHA Bolts & Hearts tournament: pools, teams, schedule, tiebreaker rules
- All data from Step 6 MVP Scope document

### 3. Tournament Schedule View

- See all games by day (Friday, Saturday, Sunday)
- Filterable by pool (Pool A, Pool B, Elimination)
- Your team (Nepean Wildcats) always visually highlighted
- Show time, rink, home team, away team
- Games transition from upcoming → in progress → completed

### 4. Score Entry

- Tap a game to enter results
- Required: final score
- Optional: period-by-period scores, penalty minutes (per team), first goal time (game clock)
- Single user entry — no conflict handling needed yet

### 5. Pool Standings with Tiebreakers

- Auto-calculated from entered results
- Point structure: 2 for win, 1 for tie, 0 for loss
- Goal differential capped at +5 per game
- Full tiebreaker engine per Rule 12:
  1. Number of wins
  2. Head-to-head (only if exactly 2 teams tied)
  3. GF / (GF + GA) ratio to 5 decimal places
  4. Fewest Goals Against
  5. Fewest Penalty Minutes
  6. Earliest first goal scored across all preliminary games
  7. Coin Toss
- Cascading rule: once a tiebreaker is used to separate teams, it cannot be reused for remaining tied teams
- Top 2 from each pool highlighted as advancing

### 6. Bracket View

- Semi-finals: 1A vs 2B, 1B vs 2A
- Final: winners of semis
- Auto-populated from pool standings once round robin is complete
- Show scores once elimination games are played

### 7. Simple Bulk Import (CSV → Database)

- Admin page: pick data type (standings, schedule, results)
- Upload CSV
- Preview what will be inserted
- Confirm and insert
- No smart merge, no conflict resolution — just clean insert
- Enables quick loading of second kid's team, league standings, playoff schedules after tournament

### 8. AI Chat with Ruleset

- Claude API connected to tournament data + full ruleset document
- Can answer questions about standings, schedule, tiebreakers, rules
- Cites specific rule numbers (e.g., "Per Rule 12c, the ratio is calculated as...")
- Text and audio input
- Cut this if time runs short — everything above is higher priority

---

## Phase 2: Post-Tournament Foundation (Weeks 2–4)

### Auth & Roles

- Supabase Auth (email/password, Google, Apple)
- User roles: Admin, Contributor, Teammate, Public Follower
- Row Level Security on all tables
- Invite links (role-specific, 1-month expiry)
- Member management (add, remove, change roles)
- Removed members silently drop to Public Follower

### Multi-Team Support

- Second kid's team added
- Toggle between teams from home screen
- Each team has its own dashboard context

### Regular Season Tracking

- Season schedule (date, time, location, opponent)
- Game results entry
- Season record (W-L-T-OTL)
- League standings

---

## Phase 3: Dashboard & Intelligence (Weeks 4–6)

### Team Dashboard

- Contextual next game block (adapts based on regular season / tournament / playoff)
- Opponent record and provincial ranking comparison
- Head-to-head history
- Schedule lookahead (next 2–3 games)
- Recent results (last 3 games, extends for streaks)
- Marquee/ticker with interesting info

### Provincial Rankings

- Manual entry or CSV import
- Historical tracking over season
- Rankings logged against game context
- Monthly reminder to update

### CSV Import with Smart Merge

- Downloadable templates per category
- Schema validation per category
- Smart merge: confirm matches, flag conflicts, stage new data
- Import categories: league schedule, league results, league standings, provincial rankings, tournament schedule, tournament results, tournament standings

---

## Phase 4: Social & Discovery (Weeks 6–8)

### Following Teams

- Browse/search teams on platform
- Follow any team — see their public data
- Friends view: list of followed teams with records, rankings, blended schedule

### Cross-Team Intelligence

- Schedule overlap detection across your teams and followed teams
- Same rink / same time window alerts
- Tournament overlap prioritization

### Team Discovery & Ownership

- Anyone can create a team (does not grant source of truth)
- Source of truth claim with manual review
- Verified badge for official teams
- Unowned team shells from bulk import are claimable

---

## Phase 5: Advanced Features (Weeks 8+)

### Scenario Engine

- "What do we need to advance" calculations
- Based on remaining games, current standings, tiebreaker rules
- Runs permutations of possible outcomes
- Works for tournaments, playoffs, playdowns

### Tournament Mode

- Per-team activation
- Dashboard shifts to tournament context
- Friends at same tournament prioritized
- Full tournament schedule available as tap-in option

### Player Stats (Phase 2 of app features)

- Tap-based live stat entry (goals, assists, PIMs per player)
- Player roster with jersey numbers
- Active scorer lock + multi-submission merge
- Goalie stats (saves, GAA, shutouts)
- Team shot tracking

### Enhanced Features

- Practice scheduling
- Voice-to-stats input
- Offline score entry with sync
- Provincial qualifier / loop configuration
- In-app notification center
- Historical data onboarding flow
- Master admin panel refinements (multi-division bulk operations)

---

## Summary

| Phase       | Focus                                                    | Timeline  |
| ----------- | -------------------------------------------------------- | --------- |
| **Phase 1** | Tournament MVP — this tournament, this weekend           | This week |
| **Phase 2** | Auth, roles, multi-team, regular season                  | Weeks 2–4 |
| **Phase 3** | Dashboard, rankings, CSV import with smart merge         | Weeks 4–6 |
| **Phase 4** | Following teams, cross-team intelligence, discovery      | Weeks 6–8 |
| **Phase 5** | Scenario engine, tournament mode, player stats, advanced | Weeks 8+  |

---

## All Project Documents

| Document                     | Contents                                              |
| ---------------------------- | ----------------------------------------------------- |
| minor-hockey-app-spec.md     | Steps 1–3: Core Idea, Target Users, Core Features     |
| step4-user-flows.md          | Step 4: All 13 User Flows                             |
| step5-technical-decisions.md | Step 5: Tech Stack & Platform Decisions               |
| step6-mvp-scope.md           | Step 6: MVP Scope, Tournament Data, Schedule, Ruleset |
| step7-roadmap.md             | Step 7: Phased Roadmap & Build Order                  |

---

## _Planning complete. Ready to build._

# Phases 2–5: Detailed Build Order

## Phase 2: Post-Tournament Foundation (Weeks 2–4)

### Build Order

#### 2.1 Authentication System

- Set up Supabase Auth (email/password, Google, Apple sign-in)
- Create users table linked to Supabase Auth
- Build sign-up and login pages
- Build password reset flow
- Migrate current hardcoded single-user setup to use real auth

#### 2.2 Roles & Permissions

- Create team_members table (user_id, team_id, role)
- Define roles: Admin, Contributor, Teammate, Public Follower
- Implement Row Level Security (RLS) policies on all existing tables:
  - Public data (schedule, results, rankings, brackets) → visible to everyone
  - Private data (player roster, contact details) → visible only to Teammate and above
  - Write access (score entry, data input) → Contributor and Admin only
  - Team management (settings, members, imports) → Admin only
- AI chat data access capped at Teammate level regardless of user role

#### 2.3 Invite System

- Build invite link generation (Admin only)
- Links are role-specific (Teammate link vs. Contributor link)
- Links expire after 1 month
- Recipient flow: click link → create account or log in → added to team with assigned role
- Anyone on the team can share a public follow link (no private access)

#### 2.4 Member Management

- Admin view: see all members and their roles
- Admin can change roles (promote/demote)
- Admin can promote members to Admin
- Admin can remove members → silently drops to Public Follower, no notification
- Member list visible to Admins only

#### 2.5 Multi-Team Support

- Update user interface to support multiple teams per user
- Build team switcher in header/navigation
- Each team has independent data, dashboard, and context
- Add second kid's team — create team, seed with data via bulk import (already built in Phase 1)

#### 2.6 Regular Season Schedule & Results

- Extend existing schedule view to support regular season games (not just tournament)
- Add stage field distinction: regular season vs. tournament vs. playoff
- Regular season game entry: date, time, location, opponent, score
- Season record tracking: W-L-T-OTL auto-calculated from results
- League standings view (manual entry or CSV import)

---

## Phase 3: Dashboard & Intelligence (Weeks 4–6)

### Build Order

#### 3.1 Provincial Rankings — Manual Entry

- Create rankings table (team_id, rank, division, level, date_recorded)
- Build manual entry screen: input your team's current ranking
- Store each entry as a snapshot with timestamp
- Display current ranking on team profile

#### 3.2 Provincial Rankings — Historical Tracking

- Build trend visualization showing ranking movement over the season
- Chart or graph: rank over time
- Log rankings against game context: "Ranked 11th when we beat Team A on Oct 15, they were ranked 19th"
- Monthly reminder notification: "Time to update your provincial rankings"

#### 3.3 CSV Import with Smart Merge — Templates

- Build downloadable CSV template system
- Templates for each category:
  - League schedule
  - League results
  - League standings
  - Provincial rankings
  - Tournament schedule
  - Tournament results
  - Tournament standings
- Each template has correct column headers and example row

#### 3.4 CSV Import with Smart Merge — Parser & Validation

- Upgrade Phase 1 bulk import to include validation
- Parse uploaded CSV using PapaParse
- Validate against expected schema per category
- Show clear error messages for malformed data (wrong columns, bad data types, missing required fields)
- Preview parsed data before import

#### 3.5 CSV Import with Smart Merge — Merge Logic

- Compare incoming data against existing database records
- Match logic: identify same game/team/date across import and existing data
- **Same data** → auto-confirm, no action needed
- **Import has more data, no conflicts** → import wins, fills in gaps automatically
- **Conflicts exist** → flag for review, show side-by-side comparison
- **New data** → stage for review before inserting
- Admin reviews and confirms all flagged items
- Core principle: more complete data wins automatically, conflicting data gets flagged

#### 3.6 Dashboard — Next Game Block

- Identify next upcoming game for the active team
- Display: date, time, location, opponent
- Show your season record vs. opponent's season record
- Show your provincial ranking vs. opponent's provincial ranking
- Show head-to-head history if you've played them before
- Context shifts based on game type:
  - Regular season → league standings comparison
  - Tournament → historical record against opponent
  - Playoff → playoff standings / series record
- Provincial rankings always visible regardless of game type

#### 3.7 Dashboard — Schedule Lookahead

- Show the next 2–3 upcoming games below the main next game block
- Compact view: date, time, opponent
- Tapping any game goes to full game detail

#### 3.8 Dashboard — Recent Results

- Show last 3 games by default
- If on a streak (win or loss), extend to show full streak length
- Display: opponent, score, W/L indicator
- Example: "Last 5 games are wins" or "4 game losing streak"

#### 3.9 Dashboard — Marquee / Ticker

- Scrolling bar of interesting information across your world
- Sources: your teams + followed teams (followed teams built in Phase 4, but build the marquee infrastructure now)
- Content types (define what's "interesting"):
  - Big wins (win by 4+ goals?)
  - Ranking jumps (moved up 3+ spots)
  - Tournament results (won a tournament, made finals)
  - Schedule overlaps with followed teams (Phase 4)
  - Streak milestones (5+ game win streak)
- Marquee pulls from a notifications/events table that gets populated as data changes

---

## Phase 4: Social & Discovery (Weeks 6–8)

### Build Order

#### 4.1 Team Discovery — Search & Browse

- Build team search page
- Search by: team name, level (U9–U18), skill level (AA, A, BB, B, C), association, region
- Browse by division/level
- Results show: team name, level, division, verified badge (if source of truth)
- If multiple versions of the same real-world team exist, all are listed

#### 4.2 Follow a Team

- "Follow" button on any team's public profile
- Creates entry in followed_teams table (user_id, team_id)
- Followed teams appear in Friends section
- Unfollow option available

#### 4.3 Team Public Profile

- Any team on the platform has a public profile visible to followers
- Shows: schedule, results, season record, provincial ranking, tournament brackets
- Does NOT show: player roster, individual stats, member list, contact details
- Tap into any game for score details

#### 4.4 Friends View

- Accessible from home screen
- List of all followed teams
- Each shows: team name, record to date, provincial ranking
- Blended upcoming schedule across all followed teams
- Tap any team to see their full public profile

#### 4.5 Cross-Team Schedule Overlap Detection

- Compare schedules across: your teams + all followed teams
- Identify overlaps: same rink within a configurable time window (e.g., within 2 hours)
- Especially valuable at tournaments — "Your son's team plays at 10am at Rink A, friend's team plays at 11:15am same rink"
- Surface overlaps in the Friends view and in the marquee

#### 4.6 Cross-Team Alerts

- In-app notifications when schedule overlaps are detected
- "Both teams at the same rink on Saturday"
- "Followed team has a game 30 minutes after yours at the same venue"
- Notification center in the app where unread items accumulate

#### 4.7 Team Creation by Anyone

- Any user can create a team on the platform
- Creating a team does NOT make you source of truth
- You become Admin of that team instance
- Team is searchable and followable immediately
- Unowned team shells from bulk import are also searchable and followable

#### 4.8 Source of Truth — Claim & Verification

- "Claim this team" button on any unclaimed team
- Submitter provides info about who they are and their role with the team
- Request goes to platform admin (you) for manual review
- If approved:
  - Claimant becomes Admin
  - Can keep existing data or start fresh
  - Can copy public data from existing version
  - Team gets "Verified" badge
- Previous creator: stays in assigned role if new admin allows, or drops to Public Follower
- Shadow copies (personal tracking versions) are invisible to source of truth admin

#### 4.9 Master Admin Panel Refinements

- Upgrade Phase 1 simple bulk import into full Master Admin panel
- Separate from normal team admin — platform-level access only
- Actions:
  - League standings import by age/skill group (CSV with age/rank columns)
  - Full tournament setup: name, dates, locations, schedule CSV, rules config, tiebreaker config, advancement rules
  - Provincial qualifier loop setup: teams in loop, qualification spots, format, rules, link to Provincials
- Auto-creates unowned team shells for teams not yet on the platform
- Existing teams get smart merge treatment

---

## Phase 5: Advanced Features (Weeks 8+)

### Build Order

#### 5.1 Tournament Mode — Per-Team Activation

- Toggle to activate tournament mode for a specific team
- Can be manually activated or auto-detected from schedule ("You have a tournament this weekend — switch to Tournament Mode?")
- Per-team, not global — Team A in tournament mode, Team B in regular season
- Both teams can be in tournament mode simultaneously

#### 5.2 Tournament Mode — Dashboard Shift

- When active, dashboard shifts to tournament context:
  - Pool/bracket standings replace league standings
  - Next tournament game as primary focus
  - Tournament schedule for your games
  - Recent tournament results
- Friends view reprioritizes: followed teams at same tournament float to top
- Full tournament schedule (all teams, all games) available as tap-in option

#### 5.3 Tournament Mode — Exit

- After tournament's last game, prompt to exit Tournament Mode
- Returns to normal dashboard view
- Tournament data remains accessible in historical views

#### 5.4 Scenario Engine — Core Logic

- Takes as input: current pool standings, remaining games, tiebreaker rules
- Generates all possible outcome permutations for remaining games
- For each permutation, calculates final standings using full tiebreaker logic
- Determines: guaranteed advance, eliminated, and conditional scenarios

#### 5.5 Scenario Engine — User-Facing Output

- Simple language output:
  - "You're guaranteed to advance if you win your next game"
  - "You need to win by 2+ goals AND Team C needs to lose"
  - "You're currently 3rd on goal differential — a shutout win puts you 2nd"
  - "You've been eliminated from advancing"
  - "You're guaranteed to advance regardless of remaining results"
- Accessible from tournament standings view and via AI chat

#### 5.6 Scenario Engine — AI Integration

- AI chat can trigger scenario calculations
- "What do we need to advance?" → runs engine, returns natural language answer with rule citations
- "What happens if we win 3-0 and Team C loses?" → runs specific scenario

#### 5.7 Offline Score Entry

- Score entry form works without internet connection
- Uses local storage / service worker to queue entries
- Syncs to Supabase when connection returns
- If conflict exists when syncing (someone else entered while offline), smart merge flags it
- Visual indicator showing "offline — will sync when connected"

#### 5.8 In-App Notification Center

- Central location for all notifications
- Unread count badge on notification icon
- Notification types:
  - Schedule overlap alerts
  - Monthly provincial ranking reminder
  - Tournament results for followed teams
  - Source of truth claim requests (platform admin)
  - Streak milestones
- Mark as read / dismiss

#### 5.9 Player Stats — Roster Setup

- Create roster for your team: player name, jersey number, position
- Roster is private — only visible to Teammates and above
- Never exposed to Public Followers
- Players linked to team and season

#### 5.10 Player Stats — Live Entry UI

- Tap-based interface designed for speed during a game
- Select player by jersey number (large tap targets)
- Quick actions: Goal, Assist, Penalty
- Each event timestamped
- Goal entry prompts for assists (primary, secondary)
- Penalty entry prompts for type and duration (minor, major, misconduct)
- Active scorer lock: one person claims scoring for a game, others see it's being handled

#### 5.11 Player Stats — Multi-Submission Merge

- If two people submit stats for the same game:
  - Matches auto-confirm
  - Conflicts flagged side-by-side for resolution
  - Same smart merge logic as CSV import

#### 5.12 Player Stats — Views & Queries

- Player stat leaders (goals, assists, points, PIMs)
- Individual player cards with season totals
- Game-by-game stat log per player
- AI chat can answer player stat questions: "Who has the most goals this month?" "How many assists does #12 have?"

#### 5.13 Goalie Stats

- Saves, goals against, goals against average (GAA), shutouts
- Per-game and season totals
- Save percentage calculation

#### 5.14 Team Shot Tracking

- Shots on goal per team (not per player)
- Per period and game total
- Shot differential tracking

#### 5.15 Practice Scheduling

- Add practices to the schedule view
- Date, time, location
- Distinct visual treatment from games (different color/icon)
- Optional — teams can choose to use it or not

#### 5.16 Voice-to-Stats Input

- Speak events during a game: "Number 12 goal, assisted by number 7 and number 15"
- Browser speech-to-text or Whisper API transcribes audio
- App parses transcription into structured stat events
- Review/correction screen after the game before committing to database
- Handles common hockey terminology and jersey number recognition

#### 5.17 Provincial Qualifier / Loop Configuration

- Set up per age/skill level
- Define the loop: which teams, how many qualify
- Set format (round robin, series)
- Set rules and tiebreakers
- Link qualifier to the Provincials tournament it feeds into
- Track progress through qualifier stages
- Support linked tournaments: standing in qualifier determines entry into Provincials

#### 5.18 Historical Data Onboarding Flow

- Guided setup when creating a new team mid-season
- Step-by-step wizard:
  1. Import or enter your schedule
  2. Import or enter results for games already played
  3. Set current league standings
  4. Set current provincial ranking
  5. Configure active or upcoming tournaments
- Each step skippable, progress indicator shows completion
- Uses CSV import system built in Phase 3

---

## Dependencies Map

Some features depend on others being built first:

| Feature                      | Depends On                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Roles & Permissions (2.2)    | Auth (2.1)                                                                    |
| Invite System (2.3)          | Auth (2.1), Roles (2.2)                                                       |
| Member Management (2.4)      | Auth (2.1), Roles (2.2)                                                       |
| Multi-Team Support (2.5)     | Auth (2.1)                                                                    |
| CSV Smart Merge (3.5)        | CSV Parser (3.4), CSV Templates (3.3)                                         |
| Dashboard Next Game (3.6)    | Regular Season (2.6)                                                          |
| Dashboard Marquee (3.9)      | Following Teams (4.2) for full value, but infrastructure can be built earlier |
| Follow a Team (4.2)          | Team Discovery (4.1)                                                          |
| Friends View (4.4)           | Follow a Team (4.2)                                                           |
| Cross-Team Overlaps (4.5)    | Follow a Team (4.2), Friends View (4.4)                                       |
| Source of Truth (4.8)        | Team Discovery (4.1), Team Creation (4.7)                                     |
| Tournament Mode (5.1–5.3)    | Tournament features from Phase 1                                              |
| Scenario Engine (5.4–5.6)    | Pool Standings with Tiebreakers from Phase 1                                  |
| Player Stats Entry (5.10)    | Roster Setup (5.9)                                                            |
| Player Stats Merge (5.11)    | Player Stats Entry (5.10), Smart Merge (3.5)                                  |
| Player Stats Views (5.12)    | Player Stats Entry (5.10)                                                     |
| Goalie Stats (5.13)          | Roster Setup (5.9), Player Stats Entry (5.10)                                 |
| Voice-to-Stats (5.16)        | Player Stats Entry (5.10)                                                     |
| Provincial Qualifier (5.17)  | Tournament Configuration from Phase 1, CSV Import (3.3–3.5)                   |
| Historical Onboarding (5.18) | CSV Import (3.3–3.5), Regular Season (2.6)                                    |

---

_Detailed build order complete. Each phase can be handed to Claude Code as a sequential task list._
