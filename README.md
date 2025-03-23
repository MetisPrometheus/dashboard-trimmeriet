# Trimmeriet Gym Visitor Dashboard

A Next.js application for tracking and visualizing gym visitor data with real-time updates and predictions.

## Features

- **Real-time Visitor Tracking**: Monitor current visitor count at your gym
- **Historical Data**: View visitor patterns from previous days
- **Predictive Analytics**: See forecasts for expected visitor counts throughout the day
- **Automatic Updates**: Data refreshes automatically from GitHub repository
- **Interactive Charts**: Visualize visitor patterns with clear, interactive charts
- **Mobile Responsive**: Works on all device sizes

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/datacollector-trimmeriet.git
cd datacollector-trimmeriet
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Source

The application fetches data from the GitHub repository:
https://github.com/MetisPrometheus/datacollector-trimmeriet/blob/main/data/visitor_counts.csv

Data is automatically refreshed when:

- The page loads
- The date is changed
- The "Refresh Now" button is clicked
- Every 5 minutes while viewing today's data

## Project Structure

```
datacollector-trimmeriet/
├── public/
│   └── data/                # Local data cache
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/             # API routes
│   │   ├── page.js          # Main page
│   │   └── layout.js        # Root layout
│   ├── components/          # React components
│   │   ├── DateSelector.js
│   │   ├── PredictionExplanation.js
│   │   ├── SummaryStats.js
│   │   ├── VisitorChart.js
│   │   └── VisitorDashboard.js
│   └── utils/               # Utility functions
│       └── dataUtils.js     # Data fetching & processing
└── package.json
```

## Technologies Used

- Next.js 14
- React 18
- Recharts (for data visualization)
- CSS Modules (for styling)
- date-fns (for date manipulation)
- PapaParse (for CSV parsing)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
