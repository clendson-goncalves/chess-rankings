import { NextResponse } from "next/server"
import type { LichessRatingHistory, RatingHistory } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    const response = await fetch(`https://lichess.org/api/user/${username}/rating-history`)

    if (!response.ok) {
      throw new Error("Failed to fetch rating history from Lichess")
    }

    const data: LichessRatingHistory[] = await response.json()
    const classicalData = data.find((item) => item.name === "Classical")

    if (!classicalData) {
      return NextResponse.json([])
    }

    // Get last 30 days of data
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentPoints = classicalData.points.filter((point) => {
      const pointDate = new Date(point[0], point[1], point[2])
      return pointDate >= thirtyDaysAgo
    })

    // Fill in missing days with previous rating
    const ratingHistory: RatingHistory[] = []
    let lastRating = recentPoints.length > 0 ? recentPoints[0][3] : 1500

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const dayData = recentPoints.find((point) => {
        const pointDate = new Date(point[0], point[1], point[2])
        return pointDate.toDateString() === date.toDateString()
      })

      if (dayData) {
        lastRating = dayData[3]
      }

      ratingHistory.push({
        date: date.toISOString().split("T")[0],
        rating: lastRating,
      })
    }

    return NextResponse.json(ratingHistory)
  } catch (error) {
    console.error("Error fetching rating history:", error)
    return NextResponse.json({ error: "Failed to fetch rating history" }, { status: 500 })
  }
}
