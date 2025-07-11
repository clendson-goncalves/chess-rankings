import { NextResponse } from "next/server"
import type { LichessPlayer, LichessRatingHistory } from "@/lib/types"

export async function GET() {
  try {
    // Fetch top 50 players
    const playersResponse = await fetch("https://lichess.org/api/player/top/50/classical")
    const playersData = await playersResponse.json()
    const players: LichessPlayer[] = playersData.users

    // Generate date headers for last 30 days
    const dates: string[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split("T")[0])
    }

    // Create CSV header
    const header = ["username", ...dates].join(",")
    const rows = [header]

    // Process each player
    for (const player of players) {
      try {
        const historyResponse = await fetch(`https://lichess.org/api/user/${player.username}/rating-history`)
        const historyData: LichessRatingHistory[] = await historyResponse.json()
        const classicalData = historyData.find((item) => item.name === "Classical")

        const playerRatings = [player.username]
        let lastRating = player.perfs.classical.rating

        if (classicalData) {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

          const recentPoints = classicalData.points.filter((point) => {
            const pointDate = new Date(point[0], point[1], point[2])
            return pointDate >= thirtyDaysAgo
          })

          // Fill ratings for each date
          for (const dateStr of dates) {
            const date = new Date(dateStr)
            const dayData = recentPoints.find((point) => {
              const pointDate = new Date(point[0], point[1], point[2])
              return pointDate.toDateString() === date.toDateString()
            })

            if (dayData) {
              lastRating = dayData[3]
            }

            playerRatings.push(lastRating.toString())
          }
        } else {
          // If no history data, use current rating for all dates
          for (let i = 0; i < dates.length; i++) {
            playerRatings.push(lastRating.toString())
          }
        }

        rows.push(playerRatings.join(","))
      } catch (error) {
        console.error(`Error processing player ${player.username}:`, error)
        // Add player with current rating for all dates if error occurs
        const playerRatings = [player.username]
        for (let i = 0; i < dates.length; i++) {
          playerRatings.push(player.perfs.classical.rating.toString())
        }
        rows.push(playerRatings.join(","))
      }
    }

    const csvContent = rows.join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="chess-rankings.csv"',
      },
    })
  } catch (error) {
    console.error("Error generating CSV:", error)
    return NextResponse.json({ error: "Failed to generate CSV" }, { status: 500 })
  }
}
