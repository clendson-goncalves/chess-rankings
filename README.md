# Chess Rankings Application by Clendson Goncalves

A modern, responsive web application that displays the top 50 classical chess players from Lichess, featuring interactive rating history charts and CSV export functionality.

## Features

- **Top 50 Rankings**: Display the current top 50 classical chess players from Lichess
- **Visual Highlights**: Special highlighting for top 3 players (#1 Gold, #2 and #3 Silver)
- **Interactive Rating History**: Click on the #1 player to view their 30-day rating progression
- **CSV Export**: Export complete rating data for all 50 players with loading states
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during data fetching and export operations
- **Real-time Data**: Fetches live data from the Lichess API
- **Modern UI**: Clean, minimal interface using shadcn/ui components

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **API**: Lichess Public API
- **Icons**: Lucide React

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/chess-rankings-app.git
   cd chess-rankings
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Internal API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/players` | GET | Fetches top 50 classical chess players |
| `/api/rating-history/[username]` | GET | Gets 30-day rating history for a specific player |
| `/api/export-csv` | GET | Generates and downloads CSV with all player data |

### External API (Lichess)

- **Players**: `https://lichess.org/api/player/top/50/classical`
- **Rating History**: `https://lichess.org/api/user/{username}/rating-history`

## Configuration

### Customization
- **Player Count**: Modify API calls to fetch different numbers of players
- **Time Range**: Adjust rating history period in API routes
- **Styling**: Customize colors and themes in `tailwind.config.js`