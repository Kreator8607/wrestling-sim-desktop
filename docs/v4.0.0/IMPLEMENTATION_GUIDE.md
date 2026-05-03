# Pro Wrestling Sim v3.0.0 - Implementation Guide

## 🚀 Quick Start

This guide walks you through integrating all advanced UI/UX components into your Pro Wrestling Sim application.

---

## 📋 Pre-requisites

- React 18+
- Tailwind CSS 3+
- Chart.js 3+
- Lucide React (icons)
- Node.js 24+
- Electron (for desktop builds)

---

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
npm install chart.js react-chartjs-2 lucide-react
# or
pnpm add chart.js react-chartjs-2 lucide-react
```

### 2. Copy Component Files

All components are located in:
- `src/components/` - React components
- `src/hooks/` - Custom hooks
- `src/styles/` - CSS files
- `src/utils/` - Utility functions
- `src/pages/` - Page components

### 3. Update Main App.jsx

```jsx
import { ThemeProvider } from './hooks/useTheme';
import DashboardIntegration from './pages/DashboardIntegration';
import './styles/dynamic-themes.css';
import './styles/animations.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-900">
        {/* Your routes here */}
        <DashboardIntegration />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### 4. Add Animation Styles

Create `src/styles/animations.css`:

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.4s ease-out;
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animate-shake {
  animation: shake 0.5s;
}
```

---

## 📦 Component Integration

### Match Card Component

**Use in Match Listing Pages**:

```jsx
import MatchCard from '../components/MatchCard';

function MatchesPage() {
  const [matches] = useState([
    {
      id: 1,
      promotion: 'WWE',
      event: 'WrestleMania 40',
      type: 'Singles',
      date: '2024-04-07',
      location: 'Las Vegas, NV',
      quality: 92,
      competitors: [
        { name: 'John Cena', rating: 85 },
        { name: 'The Rock', rating: 88 }
      ],
      title: 'WWE Championship'
    }
  ]);

  const handleSimulate = (match) => {
    console.log('Simulating match:', match);
    // Call your simulation logic here
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onSimulate={handleSimulate}
        />
      ))}
    </div>
  );
}
```

### Data Visualization Components

**Use in Statistics/Analytics Pages**:

```jsx
import {
  WinRateChart,
  MatchTypeDistribution,
  PromotionComparison
} from '../components/DataVisualization';

function AnalyticsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">Win Rate Trends</h3>
        <WinRateChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            values: [65, 72, 78, 85]
          }}
        />
      </div>

      <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4">Match Types</h3>
        <MatchTypeDistribution
          data={{
            labels: ['Singles', 'Tag Team', 'Triple Threat'],
            values: [45, 30, 15]
          }}
        />
      </div>

      <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-4 lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">Promotion Comparison</h3>
        <PromotionComparison
          data={{
            labels: ['WWE', 'AEW', 'NJPW', 'TNA'],
            values: [92, 88, 95, 75]
          }}
        />
      </div>
    </div>
  );
}
```

### In-Universe Notifications

**Add to Header/Layout**:

```jsx
import InUniverseNotifications from '../components/InUniverseNotifications';

function Layout({ children }) {
  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <h1>Pro Wrestling Sim</h1>
        <InUniverseNotifications />
      </header>
      <main>{children}</main>
    </div>
  );
}
```

### Simulation Feedback Modal

**Use After Match Simulation**:

```jsx
import SimulationFeedback from '../components/SimulationFeedback';
import { useState } from 'react';

function MatchSimulation() {
  const [matchResult, setMatchResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSimulateMatch = () => {
    const result = {
      winner: { name: 'John Cena', rating: 85 },
      quality: 92,
      crowdReaction: 88,
      momentum: 15,
      popularity: 8,
      damage: 25,
      injury: null
    };
    setMatchResult(result);
    setShowFeedback(true);
  };

  return (
    <>
      <button onClick={handleSimulateMatch}>
        Simulate Match
      </button>

      <SimulationFeedback
        matchResult={matchResult}
        isVisible={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
}
```

### Modern Wrestler Card

**Use in Roster Pages**:

```jsx
import ModernWrestlerCard, { WrestlerCardList } from '../components/ModernWrestlerCard';
import { useState } from 'react';

function RosterPage() {
  const [selectedWrestler, setSelectedWrestler] = useState(null);
  const [wrestlers] = useState([
    {
      id: 1,
      name: 'John Cena',
      promotion: 'WWE',
      wrestlingSkill: 85,
      entertainment: 90,
      starPower: 95,
      intimidation: 80,
      sexAppeal: 88,
      wins: 150,
      losses: 30,
      titles: ['WWE Championship']
    }
    // ... more wrestlers
  ]);

  return (
    <div>
      <WrestlerCardList
        wrestlers={wrestlers}
        onSelect={setSelectedWrestler}
        selectedId={selectedWrestler?.id}
      />

      {selectedWrestler && (
        <div className="mt-8 p-6 bg-gray-800 border-2 border-yellow-500 rounded-lg">
          <h2 className="text-2xl font-bold">{selectedWrestler.name}</h2>
          {/* Display detailed stats */}
        </div>
      )}
    </div>
  );
}
```

### Animated Components

**Use Throughout Your App**:

```jsx
import {
  AnimatedCard,
  AnimatedButton,
  AnimatedText,
  AnimatedProgress,
  AnimatedList
} from '../components/AnimatedComponents';

function HomePage() {
  return (
    <div className="space-y-8">
      <AnimatedCard delay={0}>
        <h1>Welcome to Pro Wrestling Sim</h1>
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <AnimatedText staggerDelay={50}>
          Create your wrestling empire
        </AnimatedText>
      </AnimatedCard>

      <AnimatedCard delay={200}>
        <AnimatedButton onClick={handleStart}>
          Get Started
        </AnimatedButton>
      </AnimatedCard>

      <AnimatedCard delay={300}>
        <AnimatedProgress value={75} max={100} />
      </AnimatedCard>

      <AnimatedCard delay={400}>
        <AnimatedList
          items={features}
          renderItem={(item) => <div>{item.name}</div>}
        />
      </AnimatedCard>
    </div>
  );
}
```

---

## 🎨 Theme Integration

### Switch Themes Dynamically

```jsx
import { useThemeContext } from '../hooks/useTheme';

function ThemeSwitcher() {
  const { currentTheme, switchTheme, availableThemes } = useThemeContext();

  return (
    <div className="flex gap-2">
      {availableThemes.map((theme) => (
        <button
          key={theme}
          onClick={() => switchTheme(theme)}
          className={`px-4 py-2 rounded ${
            currentTheme === theme.toLowerCase()
              ? 'bg-yellow-600'
              : 'bg-gray-600'
          }`}
        >
          {theme}
        </button>
      ))}
    </div>
  );
}
```

### Apply Theme Classes

```jsx
function ThemedComponent() {
  return (
    <div className="theme-gradient p-6 rounded-lg">
      <h1 className="theme-primary text-2xl font-bold">
        Themed Title
      </h1>
      <button className="btn-theme mt-4">
        Themed Button
      </button>
      <div className="card-theme mt-4">
        Themed Card
      </div>
    </div>
  );
}
```

---

## ⚡ Data Optimization

### Use Caching for Performance

```jsx
import {
  computeWrestlerRating,
  filterWrestlers,
  sortWrestlers,
  predictMatchOutcome
} from '../utils/dataOptimization';
import { useMemo } from 'react';

function OptimizedWrestlerList({ wrestlers }) {
  // Memoize computed ratings
  const ratedWrestlers = useMemo(
    () => wrestlers.map(w => ({
      ...w,
      rating: computeWrestlerRating(w)
    })),
    [wrestlers]
  );

  // Memoize sorted list
  const sortedWrestlers = useMemo(
    () => sortWrestlers(ratedWrestlers, 'rating', 'desc'),
    [ratedWrestlers]
  );

  // Memoize filtered list
  const filteredWrestlers = useMemo(
    () => filterWrestlers(sortedWrestlers, {
      minRating: 75,
      promotion: 'WWE'
    }),
    [sortedWrestlers]
  );

  return (
    <div>
      {filteredWrestlers.map(wrestler => (
        <div key={wrestler.id}>
          {wrestler.name} - Rating: {wrestler.rating}
        </div>
      ))}
    </div>
  );
}
```

### Debounce Search

```jsx
import { debounce } from '../utils/dataOptimization';
import { useState, useCallback } from 'react';

function SearchWrestlers() {
  const [results, setResults] = useState([]);

  const handleSearch = useCallback(
    debounce((query) => {
      // Perform search
      const filtered = wrestlers.filter(w =>
        w.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }, 300),
    []
  );

  return (
    <input
      type="text"
      placeholder="Search wrestlers..."
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

---

## 🧪 Testing Components

### Test Match Card

```jsx
import { render, screen } from '@testing-library/react';
import MatchCard from '../components/MatchCard';

test('renders match card with correct data', () => {
  const match = {
    promotion: 'WWE',
    event: 'WrestleMania',
    type: 'Singles',
    competitors: [
      { name: 'Wrestler 1', rating: 85 },
      { name: 'Wrestler 2', rating: 80 }
    ]
  };

  render(<MatchCard match={match} onSimulate={() => {}} />);
  
  expect(screen.getByText('WWE')).toBeInTheDocument();
  expect(screen.getByText('WrestleMania')).toBeInTheDocument();
});
```

### Test Theme Switching

```jsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useThemeContext } from '../hooks/useTheme';

test('theme switches correctly', () => {
  function TestComponent() {
    const { currentTheme, switchTheme } = useThemeContext();
    return (
      <div>
        <span>{currentTheme}</span>
        <button onClick={() => switchTheme('WWE')}>Switch</button>
      </div>
    );
  }

  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

  expect(screen.getByText('default')).toBeInTheDocument();
  screen.getByRole('button').click();
  expect(screen.getByText('wwe')).toBeInTheDocument();
});
```

---

## 🚀 Building for Windows (.exe)

### Update Electron Main Process

```javascript
// main.js
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  win.loadURL(startUrl);
}

app.on('ready', createWindow);
```

### Build Configuration

```json
{
  "homepage": "./",
  "main": "public/electron.js",
  "homepage": "./",
  "build": {
    "appId": "com.wrestling-sim.app",
    "productName": "Pro Wrestling Sim",
    "files": [
      "build/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": ["nsis", "portable"]
    }
  }
}
```

---

## 📊 Performance Metrics

### Expected Performance

- **Component Load Time**: < 100ms
- **Animation Frame Rate**: 60 FPS
- **Theme Switch**: < 50ms
- **Data Computation**: < 200ms (cached)
- **Chart Render**: < 500ms

### Monitoring

```javascript
import { getCacheStats } from '../utils/dataOptimization';

console.log('Cache Stats:', getCacheStats());
// Output: { wrestlerCache: 45, matchCache: 23, statsCache: 12 }
```

---

## 🐛 Troubleshooting

### Issue: Animations not working

**Solution**: Ensure `animations.css` is imported in your main CSS file.

### Issue: Theme not switching

**Solution**: Verify `ThemeProvider` wraps your entire app and `dynamic-themes.css` is imported.

### Issue: Charts not rendering

**Solution**: Check that Chart.js is installed and imported correctly.

### Issue: Performance issues

**Solution**: Use `useMemo` for expensive computations and check cache stats.

---

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Chart.js Documentation](https://www.chartjs.org)
- [React Documentation](https://react.dev)
- [Electron Documentation](https://www.electronjs.org)

---

## ✅ Deployment Checklist

- [ ] All components imported and tested
- [ ] Theme system working correctly
- [ ] Animations smooth and performant
- [ ] Data optimization implemented
- [ ] Notifications system integrated
- [ ] Match simulation feedback working
- [ ] All pages responsive
- [ ] Performance optimized
- [ ] Built and tested on Windows
- [ ] GitHub Actions workflow configured
- [ ] Ready for release

---

**Version**: 3.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
