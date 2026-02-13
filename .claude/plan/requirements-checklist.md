# Minor Hockey Team Tracking App — Requirements Checklist

Use this to verify all requirements have been met. Check off each item as it's built and tested.

---

## Phase 1: Tournament MVP

### 1.1 Database Schema
- [ ] Teams table (supports any number of teams, not hardcoded)
- [ ] Tournaments table (supports multiple tournaments with different configs)
- [ ] Pools table (linked to tournaments)
- [ ] Games table (linked to tournaments, pools, teams)
- [ ] Tournament config table (point structure, tiebreaker rules as ordered list with formula support)
- [ ] Users table (exists even if only one user now, ready for roles and invites)
- [ ] Team membership table (exists, unused in MVP — ready for roles)
- [ ] Followed teams table (exists, unused in MVP)
- [ ] Game data schema supports all required fields: game_id, division, stage, pool_id, start_datetime, venue/rink, home_team_id, away_team_id, final_score_home, final_score_away, result_type
- [ ] Game data schema supports optional fields: goals_by_period_home[], goals_by_period_away[], penalty_minutes_home, penalty_minutes_away, fastest_goal_seconds_home, fastest_goal_seconds_away
- [ ] Game data schema supports overtime/shootout: end_reason, overtime_winner_team_id, shootout_winner_team_id
- [ ] Schema designed to support full vision (multi-team, multi-user, seasons, regular season, playoffs)

### 1.2 Tournament Data Seeded
- [ ] Tournament name: DWGHA Bolts & Hearts Annual Tournament, Feb 13–15 2026
- [ ] Pool A: 5 teams seeded (Nepean Wildcats #2859, Southpoint Stars #6672, Peterborough Ice Kats #1484, Markham-Stouffville Stars #3582, Scarborough Sharks #845)
- [ ] Pool B: 6 teams seeded (Toronto Leaside Wildcats #3792, Napanee Crunch #1878, North Bay Junior Lakers #6254, Cornwall Typhoons #2328, Durham West Lightning #310, Central York Panthers #3)
- [ ] Point structure configured: 2 pts win, 1 pt tie, 0 pts loss
- [ ] Goal differential cap configured: max +5 per game
- [ ] Tiebreaker rules configured in correct priority order (7 rules)
- [ ] Tiebreaker cascading rule implemented: once used, cannot be reused
- [ ] Custom formula configured: GF / (GF + GA) to 5 decimal places
- [ ] All Friday Pool A games seeded (5 games)
- [ ] All Friday Pool B games seeded (6 games)
- [ ] All Saturday Pool A games seeded (6 games)
- [ ] All Saturday Pool B games seeded (5 games)
- [ ] Sunday elimination games seeded (3 games: 2 semis + final)
- [ ] Semi-final matchups configured: 1A vs 2B, 1B vs 2A
- [ ] Final configured: Winner of semi 1 vs Winner of semi 2
- [ ] Full tournament ruleset stored and accessible

### 1.3 Tournament Schedule View
- [ ] All games displayed organized by day (Friday, Saturday, Sunday)
- [ ] Filterable by pool (Pool A, Pool B, Elimination)
- [ ] Each game shows: time, rink, home team, away team
- [ ] Nepean Wildcats visually highlighted/distinct in schedule
- [ ] Games show state: upcoming → in progress → completed
- [ ] Mobile-first responsive layout

### 1.4 Score Entry
- [ ] Tap a game to open score entry
- [ ] Required field: final score (home and away)
- [ ] Optional field: period-by-period scores (3 periods)
- [ ] Optional field: penalty minutes per team
- [ ] Optional field: fastest first goal time (game clock) per team
- [ ] Result type: regulation or forfeit
- [ ] Score saves to database and updates standings immediately
- [ ] Can edit a previously entered score

### 1.5 Pool Standings
- [ ] Auto-calculated from entered game results
- [ ] Displays for Pool A and Pool B separately
- [ ] Shows: team name, GP, W, L, T, PTS, GF, GA, GD
- [ ] Points calculated correctly: 2 for win, 1 for tie, 0 for loss
- [ ] Goal differential capped at +5 per game
- [ ] Teams sorted by points first
- [ ] Tiebreaker 1: Number of wins (higher is better)
- [ ] Tiebreaker 2: Head-to-head record (only applies if exactly 2 teams tied)
- [ ] Tiebreaker 3: GF / (GF + GA) ratio calculated to 5 decimal places (higher is better)
- [ ] Tiebreaker 4: Fewest Goals Against (lower is better)
- [ ] Tiebreaker 5: Fewest Penalty Minutes (lower is better)
- [ ] Tiebreaker 6: Earliest first goal scored across all preliminary games (lower time is better)
- [ ] Tiebreaker 7: Coin Toss (manual resolution)
- [ ] Cascading rule works: once a tiebreaker separates teams from a group, it cannot be reused for remaining tied teams
- [ ] Top 2 teams in each pool visually highlighted as advancing
- [ ] Nepean Wildcats visually highlighted/distinct in standings
- [ ] Standings update in real time as scores are entered

### 1.6 Bracket View
- [ ] Shows semi-final matchups: 1A vs 2B, 1B vs 2A
- [ ] Shows final: winners of semi-finals
- [ ] Auto-populated from pool standings once round robin is complete
- [ ] Shows scores once elimination games are played
- [ ] Nepean Wildcats visually highlighted in brackets
- [ ] Visual bracket format (not just a list)

### 1.7 Simple Bulk Import
- [ ] Admin page to access import function
- [ ] Select data type: standings, schedule, results
- [ ] Upload CSV file
- [ ] Preview parsed data before inserting
- [ ] Confirm and insert into database
- [ ] No smart merge needed — clean insert only
- [ ] Handles malformed CSV gracefully (error message, not crash)

### 1.8 AI Chat with Ruleset (Stretch)
- [ ] Claude API connected to tournament data
- [ ] Full ruleset included in AI system prompt
- [ ] AI can answer questions about standings
- [ ] AI can answer questions about schedule
- [ ] AI can answer questions about tiebreaker rules
- [ ] AI cites specific rule numbers in answers (e.g., "Per Rule 12c...")
- [ ] Text input supported
- [ ] Audio/voice input supported
- [ ] Accessible from anywhere in the app via navigation icon

### 1.9 General MVP Requirements
- [ ] Mobile-first responsive design
- [ ] Works on phone browsers
- [ ] Scales up to desktop
- [ ] React + Next.js + Tailwind CSS + shadcn/ui
- [ ] Supabase PostgreSQL database
- [ ] Deployed on Vercel
- [ ] Your team (Nepean Wildcats) always visually distinct everywhere it appears

---

## Phase 2: Post-Tournament Foundation

### 2.1 Authentication
- [ ] Supabase Auth set up
- [ ] Email/password sign-up and login
- [ ] Google sign-in
- [ ] Apple sign-in
- [ ] Password reset flow
- [ ] Users table linked to Supabase Auth
- [ ] Migrated from hardcoded single-user to real auth

### 2.2 Roles & Permissions
- [ ] Team members table: user_id, team_id, role
- [ ] Four roles defined: Admin, Contributor, Teammate, Public Follower
- [ ] RLS: Public data (schedule, results, rankings, brackets) visible to everyone
- [ ] RLS: Private data (player roster, contact details) visible only to Teammate and above
- [ ] RLS: Write access (score entry, data input) restricted to Contributor and Admin
- [ ] RLS: Team management (settings, members, imports) restricted to Admin only
- [ ] AI chat data access capped at Teammate level regardless of user role
- [ ] Multiple admins allowed per team
- [ ] Multiple contributors allowed per team

### 2.3 Invite System
- [ ] Admin can generate invite links
- [ ] Links are role-specific (Teammate link vs. Contributor link)
- [ ] Links expire after 1 month
- [ ] Clicking link with existing account → added to team with assigned role
- [ ] Clicking link without account → create account → added to team
- [ ] Anyone on the team can share a public follow link (no private access)
- [ ] Public links do not grant team membership

### 2.4 Member Management
- [ ] Admin can view all members and their roles
- [ ] Admin can change roles (promote/demote)
- [ ] Admin can promote members to Admin
- [ ] Admin can remove members
- [ ] Removed members silently drop to Public Follower (no notification)
- [ ] Member list visible to Admins only (not Teammates or Contributors)

### 2.5 Multi-Team Support
- [ ] User interface supports multiple teams per user
- [ ] Team switcher in header/navigation
- [ ] Each team has independent data, dashboard, and context
- [ ] Can create and manage second kid's team
- [ ] Switching teams changes all displayed data

### 2.6 Regular Season Schedule & Results
- [ ] Schedule view supports regular season games (not just tournament)
- [ ] Stage field distinction: regular season vs. tournament vs. playoff
- [ ] Game entry: date, time, location, opponent, score
- [ ] Season record auto-calculated: W-L-T-OTL
- [ ] League standings view (manual entry or CSV import)

---

## Phase 3: Dashboard & Intelligence

### 3.1 Provincial Rankings — Manual Entry
- [ ] Rankings table: team_id, rank, division, level, date_recorded
- [ ] Manual entry screen to input current ranking
- [ ] Each entry stored as snapshot with timestamp
- [ ] Current ranking displayed on team profile

### 3.2 Provincial Rankings — Historical Tracking
- [ ] Trend visualization showing ranking movement over season
- [ ] Chart/graph: rank over time
- [ ] Rankings logged against game context ("Ranked 11th when we beat Team A on Oct 15, they were ranked 19th")
- [ ] Monthly reminder notification to update rankings

### 3.3 CSV Import — Templates
- [ ] Downloadable CSV template for each category
- [ ] Template: League schedule
- [ ] Template: League results
- [ ] Template: League standings
- [ ] Template: Provincial rankings
- [ ] Template: Tournament schedule
- [ ] Template: Tournament results
- [ ] Template: Tournament standings
- [ ] Each template has correct column headers and example row

### 3.4 CSV Import — Parser & Validation
- [ ] CSV parsed using PapaParse
- [ ] Validated against expected schema per category
- [ ] Clear error messages for malformed data (wrong columns, bad types, missing required fields)
- [ ] Preview parsed data before import

### 3.5 CSV Import — Smart Merge
- [ ] Incoming data compared against existing database records
- [ ] Match logic identifies same game/team/date
- [ ] Same data → auto-confirmed
- [ ] Import has more data, no conflicts → import wins, fills gaps automatically
- [ ] Conflicts exist → flagged for review with side-by-side comparison
- [ ] New data → staged for review before inserting
- [ ] Admin reviews and confirms all flagged items

### 3.6 Dashboard — Next Game Block
- [ ] Identifies next upcoming game for active team
- [ ] Shows: date, time, location, opponent
- [ ] Shows your season record vs. opponent's record
- [ ] Shows your provincial ranking vs. opponent's ranking
- [ ] Shows head-to-head history if played before
- [ ] Regular season context → league standings comparison
- [ ] Tournament context → historical record against opponent
- [ ] Playoff context → playoff standings / series record
- [ ] Provincial rankings always visible regardless of game type

### 3.7 Dashboard — Schedule Lookahead
- [ ] Shows next 2–3 upcoming games below main next game block
- [ ] Compact view: date, time, opponent
- [ ] Tapping any game goes to full game detail

### 3.8 Dashboard — Recent Results
- [ ] Shows last 3 games by default
- [ ] If on a streak, extends to show full streak length
- [ ] Shows: opponent, score, W/L indicator
- [ ] Streak messaging (e.g., "Last 5 games are wins")

### 3.9 Dashboard — Marquee / Ticker
- [ ] Scrolling bar of interesting information
- [ ] Sources: your teams + followed teams
- [ ] Content: big wins, ranking jumps, tournament results, schedule overlaps, streak milestones
- [ ] Pulls from notifications/events table populated as data changes

---

## Phase 4: Social & Discovery

### 4.1 Team Discovery
- [ ] Team search page
- [ ] Search by: team name, level (U9–U18), skill level (AA, A, BB, B, C), association, region
- [ ] Browse by division/level
- [ ] Results show: team name, level, division, verified badge
- [ ] Multiple versions of same real-world team all listed

### 4.2 Follow a Team
- [ ] "Follow" button on any team's public profile
- [ ] Creates entry in followed_teams table
- [ ] Followed teams appear in Friends section
- [ ] Unfollow option available

### 4.3 Team Public Profile
- [ ] Shows: schedule, results, season record, provincial ranking, tournament brackets
- [ ] Does NOT show: player roster, individual stats, member list, contact details
- [ ] Tap any game for score details

### 4.4 Friends View
- [ ] Accessible from home screen
- [ ] List of all followed teams
- [ ] Each shows: team name, record to date, provincial ranking
- [ ] Blended upcoming schedule across all followed teams
- [ ] Tap any team for full public profile

### 4.5 Cross-Team Schedule Overlap Detection
- [ ] Compares schedules across your teams + all followed teams
- [ ] Identifies same rink within configurable time window (e.g., 2 hours)
- [ ] Surfaces overlaps in Friends view
- [ ] Surfaces overlaps in marquee

### 4.6 Cross-Team Alerts
- [ ] In-app notifications for schedule overlaps
- [ ] Notification center where unread items accumulate

### 4.7 Team Creation by Anyone
- [ ] Any user can create a team
- [ ] Creating does NOT make you source of truth
- [ ] Creator becomes Admin of that team instance
- [ ] Team is searchable and followable immediately
- [ ] Unowned team shells from bulk import are searchable and followable

### 4.8 Source of Truth — Claim & Verification
- [ ] "Claim this team" button on unclaimed teams
- [ ] Submitter provides info about who they are and role
- [ ] Request goes to platform admin for manual review
- [ ] If approved: claimant becomes Admin, can keep or discard existing data, team gets Verified badge
- [ ] Previous creator: stays in role or drops to Public Follower
- [ ] Shadow copies invisible to source of truth admin

### 4.9 Master Admin Panel
- [ ] Separate from team admin — platform-level access only
- [ ] League standings import by age/skill group
- [ ] Full tournament setup: name, dates, locations, schedule CSV, rules, tiebreakers, advancement
- [ ] Provincial qualifier loop setup
- [ ] Auto-creates unowned team shells for teams not on platform
- [ ] Existing teams get smart merge treatment

---

## Phase 5: Advanced Features

### 5.1–5.3 Tournament Mode
- [ ] Per-team activation toggle
- [ ] Auto-detection from schedule ("You have a tournament this weekend")
- [ ] Dashboard shifts to tournament context when active
- [ ] Pool/bracket standings replace league standings
- [ ] Next tournament game as primary focus
- [ ] Tournament schedule for your games
- [ ] Recent tournament results
- [ ] Friends view reprioritizes: followed teams at same tournament float to top
- [ ] Full tournament schedule (all teams) available as tap-in option
- [ ] After last game, prompt to exit Tournament Mode
- [ ] Both kids' teams can be in tournament mode simultaneously

### 5.4–5.6 Scenario Engine
- [ ] Takes input: current pool standings, remaining games, tiebreaker rules
- [ ] Generates all possible outcome permutations
- [ ] Calculates final standings for each permutation using full tiebreaker logic
- [ ] Determines: guaranteed advance, eliminated, conditional scenarios
- [ ] Simple language output ("You're guaranteed to advance if...")
- [ ] Accessible from tournament standings view
- [ ] AI chat can trigger scenario calculations
- [ ] AI returns natural language answer with rule citations

### 5.7 Offline Score Entry
- [ ] Score entry works without internet connection
- [ ] Uses local storage / service worker to queue entries
- [ ] Syncs to Supabase when connection returns
- [ ] Conflict resolution if someone else entered while offline
- [ ] Visual indicator showing offline status

### 5.8 In-App Notification Center
- [ ] Central location for all notifications
- [ ] Unread count badge on notification icon
- [ ] Types: schedule overlap alerts, ranking reminders, tournament results, claim requests, streak milestones
- [ ] Mark as read / dismiss

### 5.9 Player Stats — Roster Setup
- [ ] Create roster: player name, jersey number, position
- [ ] Roster is private — only Teammates and above
- [ ] Never exposed to Public Followers
- [ ] Players linked to team and season

### 5.10 Player Stats — Live Entry
- [ ] Tap-based interface designed for speed during games
- [ ] Select player by jersey number (large tap targets)
- [ ] Quick actions: Goal, Assist, Penalty
- [ ] Each event timestamped
- [ ] Goal entry prompts for assists (primary, secondary)
- [ ] Penalty entry prompts for type and duration
- [ ] Active scorer lock: one person claims scoring per game

### 5.11 Player Stats — Multi-Submission Merge
- [ ] If two people submit stats for same game: matches auto-confirm
- [ ] Conflicts flagged side-by-side for resolution
- [ ] Same smart merge logic as CSV import

### 5.12 Player Stats — Views & Queries
- [ ] Player stat leaders (goals, assists, points, PIMs)
- [ ] Individual player cards with season totals
- [ ] Game-by-game stat log per player
- [ ] AI can answer player stat questions

### 5.13 Goalie Stats
- [ ] Saves, goals against, GAA, shutouts
- [ ] Per-game and season totals
- [ ] Save percentage calculation

### 5.14 Team Shot Tracking
- [ ] Shots on goal per team (not per player)
- [ ] Per period and game total
- [ ] Shot differential tracking

### 5.15 Practice Scheduling
- [ ] Add practices to schedule view
- [ ] Date, time, location
- [ ] Distinct visual treatment from games (different color/icon)
- [ ] Optional — teams choose to use or not

### 5.16 Voice-to-Stats
- [ ] Speak events during game ("Number 12 goal, assisted by 7 and 15")
- [ ] Browser speech-to-text or Whisper API transcription
- [ ] App parses transcription into structured stat events
- [ ] Review/correction screen after game before committing
- [ ] Handles hockey terminology and jersey number recognition

### 5.17 Provincial Qualifier / Loop Configuration
- [ ] Set up per age/skill level
- [ ] Define loop: which teams, how many qualify
- [ ] Set format (round robin, series)
- [ ] Set rules and tiebreakers
- [ ] Link qualifier to Provincials tournament
- [ ] Track progress through qualifier stages
- [ ] Support linked tournaments

### 5.18 Historical Data Onboarding
- [ ] Guided setup wizard when creating team mid-season
- [ ] Step 1: Import/enter schedule
- [ ] Step 2: Import/enter results
- [ ] Step 3: Set league standings
- [ ] Step 4: Set provincial ranking
- [ ] Step 5: Configure tournaments
- [ ] Each step skippable
- [ ] Progress indicator shows completion

---

## Cross-Cutting Requirements (All Phases)

### Data Privacy
- [ ] Public data (schedule, results, rankings, brackets) visible to followers
- [ ] Private data (player names, jersey numbers, stats) NEVER exposed publicly
- [ ] AI never sees email addresses, contact info, or admin-level data
- [ ] Member list visible to Admins only

### Smart Merge System (applies to CSV import and multi-submission)
- [ ] Same data → auto-confirmed
- [ ] Import has more data, no conflicts → import wins
- [ ] Conflicts → flagged with side-by-side comparison
- [ ] New data → staged for review
- [ ] More complete data wins automatically

### AI Conversational Layer
- [ ] Max access level is Teammate regardless of user role
- [ ] Read-only — cannot take actions
- [ ] Works across multiple teams and followed teams
- [ ] Cites rule numbers when referencing tournament rules
- [ ] Supports text and audio input

### Platform & Design
- [ ] Mobile-first responsive web app
- [ ] React + Next.js + Tailwind CSS + shadcn/ui
- [ ] Supabase PostgreSQL + Auth
- [ ] Deployed on Vercel
- [ ] No native mobile app at launch
- [ ] Your team always visually highlighted/distinct

---

*Total requirements: ~230 individual items across all phases.*
