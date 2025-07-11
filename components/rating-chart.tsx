"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card } from "@/components/ui/card"
import type { RatingHistory } from "@/lib/types"

interface RatingChartProps {
  data: RatingHistory[]
  playerName: string
}

export function RatingChart({ data }: RatingChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    rating: item.rating,
    fullDate: item.date,
  }))

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={{ stroke: "#e2e8f0" }} />
          <YAxis tick={{ fontSize: 11 }} tickLine={{ stroke: "#e2e8f0" }} domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-3 border rounded-md">
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-lg font-bold">Rating: {payload[0].value}</div>
                  </Card>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#eab308"
            strokeWidth={3}
            dot={{ fill: "#eab308", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#eab308", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
