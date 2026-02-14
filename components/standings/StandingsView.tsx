"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StandingsTable } from "./StandingsTable"
import type { TeamStanding } from "@/lib/standings-engine"
import type { RankingsMap } from "@/lib/types"

interface PoolStanding {
  pool: {
    id: string
    name: string
    advancement_count: number
  }
  standings: TeamStanding[]
}

interface StandingsViewProps {
  poolStandings: PoolStanding[]
  rankings: RankingsMap
  myTeamPoolId?: string
}

export function StandingsView({
  poolStandings,
  rankings,
  myTeamPoolId,
}: StandingsViewProps) {
  const defaultPool = myTeamPoolId ?? poolStandings[0]?.pool.id ?? ""
  const [activePool, setActivePool] = useState(defaultPool)

  const current = poolStandings.find((ps) => ps.pool.id === activePool)

  return (
    <div className="standings-tabs">
      <Tabs value={activePool} onValueChange={setActivePool}>
        <TabsList className="w-full">
          {poolStandings.map((ps) => (
            <TabsTrigger key={ps.pool.id} value={ps.pool.id} className="flex-1">
              Pool {ps.pool.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {current && (
        <StandingsTable
          poolName={current.pool.name}
          standings={current.standings}
          advancementCount={current.pool.advancement_count}
          rankings={rankings}
        />
      )}
    </div>
  )
}
