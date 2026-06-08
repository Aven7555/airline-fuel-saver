# Airline Fuel Saver - Staff Reward Tool

A webapp to calculate fuel intake, track fuel savings, and reward staff with commissions based on fuel-saving achievements.

## Features
- 📊 Flight plan data capture from dispatcher
- ⛽ Fuel consumption tracking
- 💰 Commission calculation based on fuel saved
- 👥 Staff reward tracking
- 📈 Dashboard with analytics

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: JSON (demo) / MongoDB (production)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Aven7555/airline-fuel-saver.git
cd airline-fuel-saver

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure
```
airline-fuel-saver/
├── backend/          # Express API
├── frontend/         # React app
├── data/            # Sample flight data
└── package.json
```

## API Endpoints
- `POST /api/flights/import` - Import flight plan from dispatcher
- `POST /api/flights/arrival` - Record flight arrival with actual fuel usage
- `GET /api/flights/:id` - Get flight details
- `GET /api/staff/:staffId/rewards` - Get staff commission/rewards
- `GET /api/dashboard` - Dashboard analytics

## Commission Calculation
Commission = (Planned Fuel - Actual Fuel) × Commission Rate (default: 5% of saved fuel value)

## Demo Data
Sample flight plans and staff data included for testing.
