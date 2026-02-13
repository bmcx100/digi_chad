-- ============================================
-- Seed: DWGHA Bolts & Hearts Annual Tournament
-- Feb 13-15, 2026 — U13A Division
-- ============================================

-- Fixed UUIDs for referencing across the seed
-- Tournament
do $$
declare
  v_tournament_id uuid := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  v_pool_a_id uuid := 'aaaa0001-0000-0000-0000-000000000001';
  v_pool_b_id uuid := 'aaaa0002-0000-0000-0000-000000000002';

  -- Team UUIDs (Pool A)
  v_nepean uuid := 'bbbb0001-0000-0000-0000-000000000001';
  v_southpoint uuid := 'bbbb0002-0000-0000-0000-000000000002';
  v_peterborough uuid := 'bbbb0003-0000-0000-0000-000000000003';
  v_markham uuid := 'bbbb0004-0000-0000-0000-000000000004';
  v_scarborough uuid := 'bbbb0005-0000-0000-0000-000000000005';

  -- Team UUIDs (Pool B)
  v_leaside uuid := 'bbbb0006-0000-0000-0000-000000000006';
  v_napanee uuid := 'bbbb0007-0000-0000-0000-000000000007';
  v_northbay uuid := 'bbbb0008-0000-0000-0000-000000000008';
  v_cornwall uuid := 'bbbb0009-0000-0000-0000-000000000009';
  v_durham uuid := 'bbbb0010-0000-0000-0000-000000000010';
  v_centralyork uuid := 'bbbb0011-0000-0000-0000-000000000011';

  -- Game UUIDs for bracket references
  v_semi1_id uuid := 'cccc0001-0000-0000-0000-000000000001';
  v_semi2_id uuid := 'cccc0002-0000-0000-0000-000000000002';
  v_final_id uuid := 'cccc0003-0000-0000-0000-000000000003';

begin

-- ============================================
-- TEAMS (11 total)
-- ============================================
insert into teams (id, name, external_id, level, skill_level, division, is_shell) values
  (v_nepean, 'Nepean Wildcats', '#2859', 'U13', 'A', 'U13A', false),
  (v_southpoint, 'Southpoint Stars', '#6672', 'U13', 'A', 'U13A', true),
  (v_peterborough, 'Peterborough Ice Kats', '#1484', 'U13', 'A', 'U13A', true),
  (v_markham, 'Markham-Stouffville Stars', '#3582', 'U13', 'A', 'U13A', true),
  (v_scarborough, 'Scarborough Sharks', '#845', 'U13', 'A', 'U13A', true),
  (v_leaside, 'Toronto Leaside Wildcats', '#3792', 'U13', 'A', 'U13A', true),
  (v_napanee, 'Napanee Crunch', '#1878', 'U13', 'A', 'U13A', true),
  (v_northbay, 'North Bay Junior Lakers', '#6254', 'U13', 'A', 'U13A', true),
  (v_cornwall, 'Cornwall Typhoons', '#2328', 'U13', 'A', 'U13A', true),
  (v_durham, 'Durham West Lightning', '#310', 'U13', 'A', 'U13A', true),
  (v_centralyork, 'Central York Panthers', '#3', 'U13', 'A', 'U13A', true);

-- ============================================
-- TOURNAMENT
-- ============================================
insert into tournaments (id, name, start_date, end_date, location, division, level, skill_level, goal_differential_cap, ruleset_text) values
  (v_tournament_id, 'DWGHA Bolts & Hearts Annual Tournament', '2026-02-13', '2026-02-15', 'Oshawa, ON', 'U13A', 'U13', 'A', 5,
'DWGHA Bolts & Hearts Annual Tournament
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

7. To be eligible to participate in the tournament, the participant''s name must appear on the OWHA team
   roster, Canadian Provincial Roster or USA Hockey Official Roster.

8. Each team is permitted a maximum of 20 rostered players including goaltenders. Players must be
   rostered with the registered team on the team''s OWHA (or other applicable governing body) approved
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

12. Standings after the round-robin play will be based on each team''s points total. In the event of a tie, the
    following tie-breakers will be applied:
    In the event of a tie, the following criteria will be used to break the tie:
    a) Number of wins
    b) Winner between the tied teams when they played head to head (does not apply if more than two
       teams tied)
    c) Percentage as calculated by dividing team''s total "Goals For" by the SUM of the team''s "Goals For
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

14. It is the team''s responsibility to ensure a clean dressing room is left upon completion of their game. All
    teams are requested to vacate the dressing room 30 minutes or less after their game is completed.

15. The Tournament Committee reserves itself the final word on the interpretation of the rules.

16. Championship awards and medals MAY be presented off-ice if deemed by Tournament Officials due to
    time constraints and will be presented at a determined location as required.

17. Spectators are not allowed to go on the ice to take pictures after games. We thank you for your
    anticipated support.');

-- ============================================
-- POINT STRUCTURE
-- ============================================
insert into tournament_point_structure (tournament_id, win_points, tie_points, loss_points, otl_points) values
  (v_tournament_id, 2, 1, 0, 0);

-- ============================================
-- POOLS
-- ============================================
insert into pools (id, tournament_id, name, advancement_count) values
  (v_pool_a_id, v_tournament_id, 'A', 2),
  (v_pool_b_id, v_tournament_id, 'B', 2);

-- ============================================
-- POOL TEAMS
-- ============================================
-- Pool A (5 teams)
insert into pool_teams (pool_id, team_id) values
  (v_pool_a_id, v_nepean),
  (v_pool_a_id, v_southpoint),
  (v_pool_a_id, v_peterborough),
  (v_pool_a_id, v_markham),
  (v_pool_a_id, v_scarborough);

-- Pool B (6 teams)
insert into pool_teams (pool_id, team_id) values
  (v_pool_b_id, v_leaside),
  (v_pool_b_id, v_napanee),
  (v_pool_b_id, v_northbay),
  (v_pool_b_id, v_cornwall),
  (v_pool_b_id, v_durham),
  (v_pool_b_id, v_centralyork);

-- ============================================
-- TIEBREAKER RULES (7 rules in priority order)
-- ============================================
insert into tiebreaker_rules (tournament_id, priority_order, rule_type, simple_stat, simple_direction, formula_expression, formula_precision, formula_direction, head_to_head_max_teams, description) values
  (v_tournament_id, 1, 'simple', 'wins', 'higher_better', null, null, null, null, 'Number of wins'),
  (v_tournament_id, 2, 'simple', 'head_to_head', 'higher_better', null, null, null, 2, 'Head-to-head record (only if exactly 2 teams tied)'),
  (v_tournament_id, 3, 'formula', null, null, 'GF / (GF + GA)', 5, 'higher_better', null, 'GF/(GF+GA) ratio to 5 decimal places'),
  (v_tournament_id, 4, 'simple', 'goals_against', 'lower_better', null, null, null, null, 'Fewest Goals Against'),
  (v_tournament_id, 5, 'simple', 'penalty_minutes', 'lower_better', null, null, null, null, 'Fewest Penalty Minutes'),
  (v_tournament_id, 6, 'simple', 'fastest_first_goal', 'lower_better', null, null, null, null, 'Earliest first goal scored across all preliminary games'),
  (v_tournament_id, 7, 'simple', 'coin_toss', null, null, null, null, null, 'Coin Toss');

-- ============================================
-- GAMES — Friday Pool A (5 games)
-- ============================================
insert into games (tournament_id, pool_id, game_number, stage, start_datetime, venue, home_team_id, away_team_id, status) values
  (v_tournament_id, v_pool_a_id, '3',  'pool_play', '2026-02-13 09:00:00-05', 'ACC 2', v_nepean, v_southpoint, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '3',  'pool_play', '2026-02-13 09:15:00-05', 'ACC 1', v_peterborough, v_markham, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '48', 'pool_play', '2026-02-13 14:00:00-05', 'ACC 4', v_scarborough, v_nepean, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '52', 'pool_play', '2026-02-13 18:00:00-05', 'ACC 4', v_peterborough, v_southpoint, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '25', 'pool_play', '2026-02-13 19:00:00-05', 'ACC 2', v_markham, v_scarborough, 'scheduled');

-- ============================================
-- GAMES — Friday Pool B (6 games)
-- ============================================
insert into games (tournament_id, pool_id, game_number, stage, start_datetime, venue, home_team_id, away_team_id, status) values
  (v_tournament_id, v_pool_b_id, '2',   'pool_play', '2026-02-13 08:15:00-05', 'ACC 1', v_leaside, v_cornwall, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '43',  'pool_play', '2026-02-13 08:20:00-05', 'ACC 4', v_napanee, v_northbay, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '30',  'pool_play', '2026-02-13 08:30:00-05', 'ACC 3', v_centralyork, v_durham, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '114', 'pool_play', '2026-02-13 14:00:00-05', 'Don Beer 2', v_napanee, v_centralyork, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '142', 'pool_play', '2026-02-13 14:00:00-05', 'O''Brien', v_northbay, v_cornwall, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '99',  'pool_play', '2026-02-13 14:15:00-05', 'Don Beer 1', v_durham, v_leaside, 'scheduled');

-- ============================================
-- GAMES — Saturday Pool A (4 games, excluding #204)
-- ============================================
insert into games (tournament_id, pool_id, game_number, stage, start_datetime, venue, home_team_id, away_team_id, status) values
  (v_tournament_id, v_pool_a_id, '322', 'pool_play', '2026-02-14 07:00:00-05', 'Oshawa Canlan 1', v_nepean, v_peterborough, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '171', 'pool_play', '2026-02-14 07:15:00-05', 'ACC 1', v_southpoint, v_scarborough, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '221', 'pool_play', '2026-02-14 13:00:00-05', 'ACC 4', v_markham, v_nepean, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '210', 'pool_play', '2026-02-14 17:55:00-05', 'ACC 3', v_southpoint, v_markham, 'scheduled'),
  (v_tournament_id, v_pool_a_id, '226', 'pool_play', '2026-02-14 18:00:00-05', 'ACC 4', v_scarborough, v_peterborough, 'scheduled');

-- ============================================
-- GAMES — Saturday Pool B (5 games + #204 moved here)
-- ============================================
insert into games (tournament_id, pool_id, game_number, stage, start_datetime, venue, home_team_id, away_team_id, status) values
  (v_tournament_id, v_pool_b_id, '218', 'pool_play', '2026-02-14 10:00:00-05', 'ACC 4', v_durham, v_northbay, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '189', 'pool_play', '2026-02-14 11:00:00-05', 'ACC 2', v_cornwall, v_napanee, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '204', 'pool_play', '2026-02-14 11:15:00-05', 'ACC 3', v_centralyork, v_leaside, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '208', 'pool_play', '2026-02-14 15:55:00-05', 'ACC 3', v_northbay, v_centralyork, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '194', 'pool_play', '2026-02-14 16:00:00-05', 'ACC 2', v_leaside, v_napanee, 'scheduled'),
  (v_tournament_id, v_pool_b_id, '179', 'pool_play', '2026-02-14 17:15:00-05', 'ACC 1', v_cornwall, v_durham, 'scheduled');

-- ============================================
-- GAMES — Sunday Elimination (3 games)
-- ============================================
insert into games (id, tournament_id, pool_id, game_number, stage, start_datetime, venue, home_team_id, away_team_id, home_placeholder, away_placeholder, status) values
  (v_semi1_id, v_tournament_id, null, '365', 'semifinal', '2026-02-15 08:15:00-05', 'Don Beer 1', null, null, '1st Pool A', '2nd Pool B', 'scheduled'),
  (v_semi2_id, v_tournament_id, null, '372', 'semifinal', '2026-02-15 08:30:00-05', 'Don Beer 2', null, null, '1st Pool B', '2nd Pool A', 'scheduled');

insert into games (id, tournament_id, pool_id, game_number, stage, start_datetime, venue, home_team_id, away_team_id, home_placeholder, away_placeholder, bracket_source_game_1_id, bracket_source_game_2_id, status) values
  (v_final_id, v_tournament_id, null, '368', 'final', '2026-02-15 13:00:00-05', 'Don Beer 1', null, null, 'Winner Semi 1', 'Winner Semi 2', v_semi1_id, v_semi2_id, 'scheduled');

end $$;
