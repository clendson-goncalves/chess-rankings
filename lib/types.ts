export interface Player {
  username: string
  rating: number
  title?: string
  rank: number
}

export interface RatingHistory {
  date: string
  rating: number
}

export interface LichessPlayer {
  id: string
  username: string
  perfs: {
    classical: {
      rating: number
    }
  }
  title?: string
}

export interface LichessRatingHistory {
  name: string
  points: [number, number, number, number][]
}
