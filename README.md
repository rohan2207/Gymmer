# Gymmer - Workout Tracker

A mobile-first workout tracking application built with Next.js, featuring your personalized 5-day PPLUL (Push/Pull/Legs/Upper/Lower) program.

## Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with touch-friendly interface
- 💪 **Workout Tracking** - Log sets, reps, and weights with auto-save
- ⏱️ **Rest Timer** - Built-in rest timer with customizable presets
- 📊 **Progress Analytics** - Track your progress with charts and weekly comparisons
- 🏆 **PR Detection** - Automatic personal record detection with celebrations
- 📅 **Calendar View** - Visual workout calendar with streak tracking
- 🎨 **Framer Motion** - Smooth animations and transitions
- 💾 **Offline-First** - All data stored locally in IndexedDB

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: IndexedDB (via Dexie.js)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Your Workout Program

The app comes pre-loaded with your optimized 5-day PPLUL split:

- **Tuesday** - Push (Upper Chest & Triceps Priority)
- **Wednesday** - Pull (Back Thickness Priority)
- **Thursday** - Legs (Strength Emphasis)
- **Friday** - Upper (Back + Tricep Specialization)
- **Saturday** - Lower (Hypertrophy + Conditioning)

## Deployment

### Deploy to Vercel

The easiest way to deploy:

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy!

Or use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## PWA Installation

The app supports Progressive Web App installation:

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Install for app-like experience

## Data Management

- All workout data is stored locally in your browser
- Data persists across sessions
- No account or internet required
- Export/import functionality for backups (coming soon)

## License

Personal use only.
