-- ============================================
-- Minor Hockey Tracker — Full Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS
-- ============================================
create table users (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  is_platform_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- TEAMS
-- ============================================
create table teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  external_id text,
  level text,
  skill_level text,
  division text,
  association text,
  region text,
  is_verified boolean not null default false,
  is_shell boolean not null default false,
  shadow_of_team_id uuid references teams(id),
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- TEAM MEMBERS
-- ============================================
create table team_members (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  role text not null check (role in ('admin', 'contributor', 'teammate', 'follower')),
  joined_at timestamptz not null default now(),
  unique (user_id, team_id)
);

create index idx_team_members_user on team_members(user_id);
create index idx_team_members_team on team_members(team_id);

-- ============================================
-- FOLLOWED TEAMS
-- ============================================
create table followed_teams (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  followed_at timestamptz not null default now(),
  unique (user_id, team_id)
);

-- ============================================
-- SEASONS
-- ============================================
create table seasons (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  name text not null,
  start_date date,
  end_date date
);

-- ============================================
-- TOURNAMENTS
-- ============================================
create table tournaments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  start_date date,
  end_date date,
  location text,
  division text,
  level text,
  skill_level text,
  ruleset_text text,
  goal_differential_cap integer,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- TOURNAMENT POINT STRUCTURE
-- ============================================
create table tournament_point_structure (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  win_points integer not null default 2,
  tie_points integer not null default 1,
  loss_points integer not null default 0,
  otl_points integer not null default 0
);

-- ============================================
-- POOLS
-- ============================================
create table pools (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name text not null,
  advancement_count integer not null default 2
);

-- ============================================
-- POOL TEAMS
-- ============================================
create table pool_teams (
  id uuid primary key default uuid_generate_v4(),
  pool_id uuid not null references pools(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade
);

create index idx_pool_teams_pool on pool_teams(pool_id);
create index idx_pool_teams_team on pool_teams(team_id);

-- ============================================
-- TIEBREAKER RULES
-- ============================================
create table tiebreaker_rules (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  priority_order integer not null,
  rule_type text not null check (rule_type in ('simple', 'formula')),
  simple_stat text,
  simple_direction text check (simple_direction in ('higher_better', 'lower_better')),
  formula_expression text,
  formula_precision integer,
  formula_direction text check (formula_direction in ('higher_better', 'lower_better')),
  head_to_head_max_teams integer,
  description text
);

create index idx_tiebreaker_rules_tournament on tiebreaker_rules(tournament_id, priority_order);

-- ============================================
-- GAMES
-- ============================================
create table games (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references tournaments(id) on delete cascade,
  pool_id uuid references pools(id),
  season_id uuid references seasons(id),
  game_number text,
  stage text not null check (stage in (
    'pool_play', 'quarterfinal', 'semifinal', 'final',
    'consolation', 'regular_season', 'playoff'
  )),
  start_datetime timestamptz not null,
  venue text,
  home_team_id uuid references teams(id),
  away_team_id uuid references teams(id),
  home_placeholder text,
  away_placeholder text,
  bracket_source_game_1_id uuid references games(id),
  bracket_source_game_2_id uuid references games(id),
  final_score_home integer,
  final_score_away integer,
  goals_by_period_home integer[],
  goals_by_period_away integer[],
  penalty_minutes_home integer,
  penalty_minutes_away integer,
  fastest_goal_seconds_home integer,
  fastest_goal_seconds_away integer,
  result_type text check (result_type in ('regulation', 'overtime', 'shootout', 'forfeit')),
  end_reason text check (end_reason in ('regulation', 'OT', 'shootout')),
  overtime_winner_team_id uuid references teams(id),
  shootout_winner_team_id uuid references teams(id),
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed')),
  entered_by uuid references users(id),
  entered_at timestamptz,
  updated_at timestamptz default now()
);

create index idx_games_tournament_pool on games(tournament_id, pool_id);
create index idx_games_home_team on games(home_team_id);
create index idx_games_away_team on games(away_team_id);
create index idx_games_start on games(start_datetime);

-- ============================================
-- PROVINCIAL RANKINGS
-- ============================================
create table provincial_rankings (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  rank integer not null,
  division text,
  level text,
  date_recorded date not null,
  created_at timestamptz not null default now()
);

-- ============================================
-- INVITE LINKS
-- ============================================
create table invite_links (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  role text not null check (role in ('teammate', 'contributor')),
  token text not null unique,
  created_by uuid not null references users(id),
  expires_at timestamptz not null,
  used_by uuid references users(id),
  used_at timestamptz
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  data jsonb,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================
-- SOURCE OF TRUTH CLAIMS
-- ============================================
create table source_of_truth_claims (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  claimant_user_id uuid not null references users(id),
  claimant_info text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ============================================
-- TEAM EVENTS (practices, meetings, etc.)
-- ============================================
create table team_events (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid not null references teams(id) on delete cascade,
  season_id uuid references seasons(id),
  event_type text not null check (event_type in ('practice', 'meeting', 'other')),
  title text,
  start_datetime timestamptz not null,
  end_datetime timestamptz,
  venue text,
  notes text,
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- QUALIFIER LOOPS (provincial qualifiers)
-- ============================================
create table qualifier_loops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  level text,
  skill_level text,
  qualification_spots integer not null,
  format text not null check (format in ('round_robin', 'series', 'tournament')),
  target_tournament_id uuid references tournaments(id),
  created_by uuid not null references users(id),
  created_at timestamptz not null default now()
);

-- ============================================
-- QUALIFIER LOOP TEAMS
-- ============================================
create table qualifier_loop_teams (
  id uuid primary key default uuid_generate_v4(),
  loop_id uuid not null references qualifier_loops(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  qualified boolean not null default false
);
