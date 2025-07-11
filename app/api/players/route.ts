import { NextResponse } from "next/server"
import type { LichessPlayer, Player } from "@/lib/types"

export async function GET() {
  try {
    const response = await fetch("https://lichess.org/api/player/top/50/classical")

    if (!response.ok) {
      throw new Error("Failed to fetch players from Lichess")
    }

    const data = await response.json()
    const players: Player[] = data.users.map((player: LichessPlayer, index: number) => ({
      username: player.username,
      rating: player.perfs.classical.rating,
      title: player.title,
      rank: index + 1,
    }))

    return NextResponse.json(players)
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}
