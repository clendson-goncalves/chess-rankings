"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Trophy } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { RatingChart } from "@/components/rating-chart"
import type { Player, RatingHistory } from "@/lib/types"

export default function ChessRankings() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [showRatingHistory, setShowRatingHistory] = useState(false)
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([])
  const [topPlayer, setTopPlayer] = useState<Player | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    fetchTopPlayers()
  }, [])

  const fetchTopPlayers = async () => {
    try {
      const response = await fetch("/api/players")
      const data = await response.json()
      setPlayers(data)
      if (data.length > 0) {
        setTopPlayer(data[0])
      }
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTopPlayerClick = async () => {
    if (!topPlayer) return

    try {
      const response = await fetch(`/api/rating-history/${topPlayer.username}`)
      const data = await response.json()
      setRatingHistory(data)
      setShowRatingHistory(true)
    } catch (error) {
      console.error("Error fetching rating history:", error)
    }
  }

  const exportCSV = async () => {
    setExportLoading(true)

    try {
      const response = await fetch("/api/export-csv")

      if (!response.ok) {
        throw new Error("Failed to export CSV")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "chess-rankings.csv"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting CSV:", error)
    } finally {
      setExportLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Chess Rankings</h1>
          <p className="text-muted-foreground text-sm">Top 50 Classical Chess Players</p>
        </div>
        <Button onClick={exportCSV} disabled={exportLoading} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {exportLoading ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {!showRatingHistory ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-10 w-10 text-yellow-500" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={players} onTopPlayerClick={handleTopPlayerClick} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-4 bg-gradient-to-r from-yellow-100 to-yellow-400 p-2 rounded-md">
            <Button onClick={() => setShowRatingHistory(false)}>
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div className="text-2xl font-semibold">{topPlayer?.username}</div>
              <span className="text-sm">Rating History (Last 30 Days)</span>
            </div>
          </div>

          <Card>
            <CardContent>
              <RatingChart data={ratingHistory} playerName={topPlayer?.username || ""} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
