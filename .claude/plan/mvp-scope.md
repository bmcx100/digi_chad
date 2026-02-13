# Minor Hockey Team Tracking App — Step 6: MVP Scope

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
| Team | ID |
|---|---|
| Nepean Wildcats | #2859 |
| Southpoint Stars | #6672 |
| Peterborough Ice Kats | #1484 |
| Markham-Stouffville Stars | #3582 |
| Scarborough Sharks | #845 |

## Pool B Teams
| Team | ID |
|---|---|
| Toronto Leaside Wildcats | #3792 |
| Napanee Crunch | #1878 |
| North Bay Junior Lakers | #6254 |
| Cornwall Typhoons | #2328 |
| Durham West Lightning | #310 |
| Central York Panthers | #3 |

**Note:** Pool B has 6 teams, Pool A has 5 teams.

---

## Schedule

### Friday — Pool A Games
| Game # | Time | Rink | Home | Away |
|---|---|---|---|---|
| 3 | 9:00 AM | ACC 2 | Nepean Wildcats #2859 | Southpoint Stars #6672 |
| 3 | 9:15 AM | ACC 1 | Peterborough Ice Kats #1484 | Markham-Stouffville Stars #3582 |
| 48 | 2:00 PM | ACC 4 | Scarborough Sharks #845 | Nepean Wildcats #2859 |
| 52 | 6:00 PM | ACC 4 | Peterborough Ice Kats #1484 | Southpoint Stars #6672 |
| 25 | 7:00 PM | ACC 2 | Markham-Stouffville Stars #3582 | Scarborough Sharks #845 |

### Friday — Pool B Games
| Game # | Time | Rink | Home | Away |
|---|---|---|---|---|
| 2 | 8:15 AM | ACC 1 | Toronto Leaside Wildcats #3792 | Cornwall Typhoons #2328 |
| 43 | 8:20 AM | ACC 4 | Napanee Crunch #1878 | North Bay Junior Lakers #6254 |
| 30 | 8:30 AM | ACC 3 | Central York Panthers #3 | Durham West Lightning #310 |
| 114 | 2:00 PM | Don Beer 2 | Napanee Crunch #1878 | Central York Panthers #3 |
| 142 | 2:00 PM | O'Brien | North Bay Junior Lakers #6254 | Cornwall Typhoons #2328 |
| 99 | 2:15 PM | Don Beer 1 | Durham West Lightning #310 | Toronto Leaside Wildcats #3792 |

### Saturday — Pool A Games
| Game # | Time | Rink | Home | Away |
|---|---|---|---|---|
| 322 | 7:00 AM | Oshawa Canlan 1 | Nepean Wildcats #2859 | Peterborough Ice Kats #1484 |
| 171 | 7:15 AM | ACC 1 | Southpoint Stars #6672 | Scarborough Sharks #845 |
| 204 | 11:15 AM | ACC 3 | Central York Panthers #3 | Toronto Leaside Wildcats #3792 |
| 221 | 1:00 PM | ACC 4 | Markham-Stouffville Stars #3582 | Nepean Wildcats #2859 |
| 210 | 5:55 PM | ACC 3 | Southpoint Stars #6672 | Markham-Stouffville Stars #3582 |
| 226 | 6:00 PM | ACC 4 | Scarborough Sharks #845 | Peterborough Ice Kats #1484 |

### Saturday — Pool B Games
| Game # | Time | Rink | Home | Away |
|---|---|---|---|---|
| 218 | 10:00 AM | ACC 4 | Durham West Lightning #310 | North Bay Junior Lakers #6254 |
| 189 | 11:00 AM | ACC 2 | Cornwall Typhoons #2328 | Napanee Crunch #1878 |
| 208 | 3:55 PM | ACC 3 | North Bay Junior Lakers #6254 | Central York Panthers #3 |
| 194 | 4:00 PM | ACC 2 | Toronto Leaside Wildcats #3792 | Napanee Crunch #1878 |
| 179 | 5:15 PM | ACC 1 | Cornwall Typhoons #2328 | Durham West Lightning #310 |

**Note:** Game #204 (Saturday 11:15 AM) appears to be a cross-pool game — Central York Panthers (Pool B) vs Toronto Leaside Wildcats (Pool B) but listed under Pool A schedule. May need clarification.

### Sunday — Elimination Round
| Game # | Time | Rink | Matchup |
|---|---|---|---|
| 365 | 8:15 AM | Don Beer 1 | 1st in Pool A vs 2nd in Pool B |
| 372 | 8:30 AM | Don Beer 2 | 1st in Pool B vs 2nd in Pool A |
| 368 | 1:00 PM | Don Beer 1 | Winner Game #365 vs Winner Game #372 (Final) |

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

*Step 6 Complete. Step 7: Roadmap & Next Steps to follow in separate document.*
