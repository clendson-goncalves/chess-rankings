"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"
import type { Player } from "@/lib/types"

interface DataTableProps {
  data: Player[]
  onTopPlayerClick: () => void
}

export function DataTable({ data, onTopPlayerClick }: DataTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      default:
        return null
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-100 to-yellow-400 hover:from-yellow-200 hover:to-yellow-400"
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-200 font-bold"
      case 3:
        return "bg-gradient-to-r from-gray-50 to-gray-200 font-bold"
      default:
        return "hover:bg-muted/50"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player, index) => {
            const rank = index + 1
            const isClickable = rank === 1

            return (
              <TableRow
                key={player.username}
                className={`${getRankStyle(rank)} ${isClickable ? "cursor-pointer" : ""} transition-colors`}
                onClick={isClickable ? onTopPlayerClick : undefined}
              >
                <TableCell className="font-normal">
                  <div className="flex justify-center">
                    {getRankIcon(rank)}
                    <span className="font-bold">
                      {rank === 1 ? "" : `${rank}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`${rank === 1 ? 'text-xl font-semibold' : ''}`}>{player.username}</div>{player.title && (
                      <Badge className="text-[10px] font-bold">
                        {player.title}
                      </Badge>
                    )}
                    {rank === 1 ? <Badge variant="outline" className="text-[9px] font-bold border-black">RATING HISTORY</Badge> : ''}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">{player.rating}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div >
  )
}
