# Phase 2 — Full Plan (Steps 2–6)

## Overview

Phase 2 builds on the team picker (Step 1) to add authentication, roles, permissions, invites, member management, and regular season support. Each step depends on the previous one.

| Step | Name | Depends On |
|------|------|------------|
| 1 | Team Picker (separate doc) | — |
| 2 | Authentication System | Step 1 |
| 3 | Roles & RLS Policies | Step 2 |
| 4 | Invite System | Steps 2, 3 |
| 5 | Member Management | Steps 2, 3 |
| 6 | Regular Season Support | Step 1 |

---

## Step 2: Authentication System

### What Gets Built

**Auth pages** inside an `(auth)` route group with its own layout (no TopNav/BottomNav):

- `app/(auth)/layout.tsx` — centered card layout, redirects to `/` if already logged in
- `app/(auth)/login/page.tsx` — email + password login form
- `app/(auth)/signup/page.tsx` — email + password + confirm password
- `app/(auth)/reset-password/page.tsx` — new password form (target of reset email link)
- `app/auth/callback/route.ts` — handles Supabase email confirmation + reset redirects

**Auth components:**

- `components/auth/LoginForm.tsx` — client component, calls `supabase.auth.signInWithPassword`
- `components/auth/SignupForm.tsx` — client component, calls `supabase.auth.signUp`
- `components/auth/UserMenu.tsx` — client component in TopNav, shows user email/name + sign out

**Auth helpers:**

- `lib/auth/helpers.ts` — server-side: `getCurrentUser()`, `getTeamRole(teamId)`, `hasMinRole(current, required)`
- `lib/auth/client-helpers.ts` — browser-side: `signInWithEmail()`, `signUp()`, `signOut()`, `resetPassword()`
- `lib/auth/use-user.ts` — client hook: `useUser()` returns `{ user, loading }`, listens to `onAuthStateChange`

**Database migration: `006_user_trigger.sql`**

- Trigger on `auth.users` INSERT → auto-creates matching row in `users` table
- Sets `display_name` to email prefix by default

**Middleware updates: `lib/supabase/middleware.ts`**

- After session refresh, check if route is protected (e.g., `/import`)
- Redirect unauthenticated users to `/login?next={path}`
- Public routes (`/standings`, `/schedule`, `/bracket`, `/chat`) remain open

**Navigation: `components/layout/TopNav.tsx`**

- Add `<UserMenu />` — shows "Sign In" link when logged out, user dropdown when logged in
- Dropdown has: display name, "My Teams", "Sign Out"

**Team picker integration:**

- When authenticated, migrate localStorage favourites to `followed_teams` table
- `TeamProvider` checks auth state: if logged in, reads favourites from DB; if not, reads from localStorage
- Selecting a team as a logged-in user writes to `followed_teams`

**Deferred:** Google and Apple sign-in. Start with email/password only. Add OAuth providers later.

### Files

New: ~10 files (auth pages, components, helpers, migration)
Modified: `TopNav.tsx`, `middleware.ts`, `TeamProvider.tsx`, `app/layout.tsx`

---

## Step 3: Roles & RLS Policies

### What Gets Built

**TypeScript types: `lib/types.ts`** — add:
- `TeamRole = "admin" | "contributor" | "teammate" | "follower"`
- `AppUser` interface
- `TeamMember` interface
- `InviteLink` interface

**Database migration: `007_enable_rls.sql`**

Enable RLS on all tables and create policies:

**Helper functions (SQL):**
- `role_level(role)` — returns integer: follower=1, teammate=2, contributor=3, admin=4
- `has_min_role(team_id, min_role)` — checks if `auth.uid()` has >= that role on the team

**Policy summary:**

| Table | Read | Write |
|-------|------|-------|
| teams, tournaments, pools, pool_teams, games, tiebreaker_rules, provincial_rankings, seasons, qualifier_loops | Public (anyone) | — |
| games | Public read | Contributor+ (INSERT/UPDATE score fields) |
| users | Own row only | Own row only |
| team_members | Own memberships + admin sees team members | Admin only |
| followed_teams | Own rows | Own rows |
| invite_links | Admin of team | Admin of team |
| notifications | Own rows | Own rows (update read status) |
| team_events | Teammate+ | Contributor+ write, Admin delete |
| source_of_truth_claims | Own claims | Own claims (INSERT) |

**Important:** The anon key must still be able to read public tables. All public-read policies use `using (true)`.

**Score entry gating:**

- `ScoreEntrySheet.tsx` — only render the edit button if user has contributor+ role
- Pass role as prop from parent server component
- RLS enforces this at the DB level as backup

**Import page gating:**

- `app/import/page.tsx` — check role server-side, return "unauthorized" if not admin

### Files

New: 1 migration file, types additions
Modified: `ScoreEntrySheet.tsx` (conditional render), `CsvImport.tsx` (conditional render), page files that need role checks

---

## Step 4: Invite System

### What Gets Built

**Invite generation page: `app/team-settings/invites/page.tsx`**

- Admin-only page (server component checks role)
- Shows active (unexpired, unused) invite links
- "Generate Link" button with role selector (Teammate or Contributor)
- Each link shows: role, created date, expiry date, copy button
- Links expire after 1 month

**Invite acceptance page: `app/invite/[token]/page.tsx`**

- Public page, outside auth requirement
- Looks up invite by token, validates not expired and not used
- If user is logged in: accept immediately (insert `team_members` row, mark invite used), redirect to `/standings`
- If not logged in: show "Sign Up" / "Log In" buttons with invite token preserved in the flow
- After auth completes, redirect back to `/invite/[token]` to finish acceptance

**API route: `app/api/invites/route.ts`**

- `POST` — generate invite (admin only): creates row in `invite_links` with crypto random token, 1-month expiry
- `POST /accept` — accept invite: validates token, inserts `team_members`, marks invite used

**Public follow link:**

- Any team page can have a "Share" button that copies a link like `/invite/follow/[teamId]`
- Visiting this adds the team to `followed_teams` (if logged in) or localStorage favourites (if not)
- No token needed, no expiry

**Auth callback update:**

- After login/signup, check for `invite` query param
- If present, redirect to `/invite/[token]` to complete acceptance

### Files

New: ~4 files (invites page, acceptance page, API route)
Modified: `auth/callback/route.ts`, `TopNav.tsx` (link to settings)

---

## Step 5: Member Management

### What Gets Built

**Members page: `app/team-settings/members/page.tsx`**

- Admin-only page
- Lists all team members with: display name/email, role badge, joined date
- Actions per member (dropdown):
  - Change role (Teammate ↔ Contributor)
  - Promote to Admin (with confirmation)
  - Remove from team (silently drops to Public Follower — deletes `team_members` row)
- Cannot remove yourself as admin if you're the last admin

**API route: `app/api/team-members/route.ts`**

- `PATCH` — update member role (admin only)
- `DELETE` — remove member (admin only)
- Server-side validation: requester must be admin, can't remove last admin

**Team settings layout: `app/team-settings/layout.tsx`**

- Sidebar/tab navigation: Members, Invites (future: Team Info, etc.)
- Admin-only — server component redirects non-admins

**Navigation addition:**

- TopNav user menu: add "Team Settings" link (visible only to admins)
- Route to `/team-settings/members`

### Files

New: ~4 files (members page, API route, settings layout)
Modified: `TopNav.tsx` / `UserMenu.tsx`

---

## Step 6: Regular Season Support

### What Gets Built

This is independent from auth (depends only on Step 1 team picker). Can be built in parallel with Steps 2–5.

**Seasons table usage:**

The `seasons` table already exists in the schema:
```sql
create table seasons (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id),
  name text not null,
  start_date date,
  end_date date
);
```

Games already have a `season_id` field and `stage` supports `"regular_season"` and `"playoff"`.

**What's needed:**

1. **Seed or create a season** for the team (migration or via import)
2. **Extend schedule view** to show regular season games alongside tournament games
   - Tab or filter: "Tournament" vs "Regular Season" vs "All"
   - Regular season games have `stage = "regular_season"`, `season_id` set, no `pool_id`
3. **Season record display** — calculated from regular season games:
   - W-L-T-OTL
   - Points (configurable per league)
   - Show in standings or a new "Season" tab
4. **League standings view** — manual entry or CSV import of league standings
   - Simple table: rank, team, GP, W, L, T, OTL, PTS
   - Can be imported via the existing CSV import page
5. **Import support** — the existing CSV import already handles schedule and results
   - May need to add `season_id` association when importing regular season games
   - Add "Regular Season" as an import category option

**Schedule page changes: `app/schedule/page.tsx`**

- Query games for the active team's season AND tournament
- Add filter tabs: "Tournament", "Season", "All"
- Regular season games show league opponent context instead of pool context

**Standings page changes: `app/standings/page.tsx`**

- Add a "League" tab alongside Pool A / Pool B tabs
- League standings either calculated from regular season games or manually imported

### Files

New: Potentially 1 migration (seed season data), 1 new component for league standings
Modified: `app/schedule/page.tsx`, `app/standings/page.tsx`, `components/import/CsvImport.tsx`

---

## Full Build Order (All Steps)

```
Step 1: Team Picker ← START HERE
  └─ Step 6: Regular Season (can run in parallel)
  └─ Step 2: Authentication
       └─ Step 3: Roles & RLS
            ├─ Step 4: Invite System
            └─ Step 5: Member Management
```

Steps 4 and 5 can be built in parallel once Step 3 is done.
Step 6 only depends on Step 1 and can be built anytime after.
