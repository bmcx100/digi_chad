-- ============================================
-- MVP: Disable RLS for unauthenticated access
-- This will be replaced with proper RLS policies in Phase 2
-- ============================================

alter table teams disable row level security;
alter table tournaments disable row level security;
alter table tournament_point_structure disable row level security;
alter table pools disable row level security;
alter table pool_teams disable row level security;
alter table tiebreaker_rules disable row level security;
alter table games disable row level security;
alter table seasons disable row level security;
alter table users disable row level security;
alter table team_members disable row level security;
alter table followed_teams disable row level security;
alter table provincial_rankings disable row level security;
alter table invite_links disable row level security;
alter table notifications disable row level security;
alter table source_of_truth_claims disable row level security;
alter table team_events disable row level security;
alter table qualifier_loops disable row level security;
alter table qualifier_loop_teams disable row level security;
