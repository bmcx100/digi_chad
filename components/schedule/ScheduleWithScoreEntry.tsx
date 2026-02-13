"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ScheduleView } from "./ScheduleView"
import { ScoreEntrySheet } from "@/components/score-entry/ScoreEntrySheet"
import type { Game, Pool } from "@/lib/types"

interface ScheduleWithScoreEntryProps {
  games: Game[]
  pools: Pool[]
}

export function ScheduleWithScoreEntry({
  games,
  pools,
}: ScheduleWithScoreEntryProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const router = useRouter()

  const handleGameTap = useCallback((game: Game) => {
    setSelectedGame(game)
    setSheetOpen(true)
  }, [])

  const handleSaved = useCallback(() => {
    router.refresh()
  }, [router])

  return (
    <>
      <ScheduleView games={games} pools={pools} onGameTap={handleGameTap} />
      <ScoreEntrySheet
        game={selectedGame}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSaved={handleSaved}
      />
    </>
  )
}
