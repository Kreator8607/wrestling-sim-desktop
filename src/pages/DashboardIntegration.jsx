import { useState, useCallback, useMemo } from 'react';
import MatchCard from '../components/MatchCard';
import { WinRateChart, MatchTypeDistribution, PromotionComparison } from '../components/DataVisualization';
import InUniverseNotifications from '../components/InUniverseNotifications';
import SimulationFeedback from '../components/SimulationFeedback';
import ModernWrestlerCard, { WrestlerCardList } from '../components/ModernWrestlerCard';
import { AnimatedCard, AnimatedButton } from '../components/AnimatedComponents';
import { useThemeContext } from '../hooks/useTheme';
import {
  computeWrestlerRating,
  predictMatchOutcome,
  sortWrestlers,
  filterWrestlers,
} from '../utils/dataOptimization';

export default function DashboardIntegration() {
  const { currentTheme, switchTheme, availableThemes } = useThemeContext();
  const [selectedWrestler, setSelectedWrestler] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
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
      titles: ['WWE Championship', 'United States Championship'],
    },
    {
      id: 2,
      name: 'The Rock',
      promotion: 'WWE',
      wrestlingSkill: 88,
      entertainment: 95,
      starPower: 98,
      intimidation: 92,
      sexAppeal: 90,
      wins: 120,
      losses: 25,
      titles: ['WWE Championship'],
    },
    {
      id: 3,
      name: 'Kenny Omega',
      promotion: 'AEW',
      wrestlingSkill: 95,
      entertainment: 85,
      starPower: 85,
      intimidation: 75,
      sexAppeal: 80,
      wins: 200,
      losses: 40,
      titles: ['AEW World Championship'],
    },
    {
      id: 4,
      name: 'Kazuchika Okada',
      promotion: 'NJPW',
      wrestlingSkill: 98,
      entertainment: 80,
      starPower: 90,
      intimidation: 85,
      sexAppeal: 82,
      wins: 250,
      losses: 35,
      titles: ['IWGP Heavyweight Championship'],
    },
  ]);

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
        { name: 'The Rock', rating: 88 },
      ],
    },
    {
      id: 2,
      promotion: 'AEW',
      event: 'Double or Nothing',
      type: 'Triple Threat',
      date: '2024-05-26',
      location: 'Las Vegas, NV',
      quality: 88,
      competitors: [
        { name: 'Kenny Omega', rating: 95 },
        { name: 'MJF', rating: 82 },
      ],
    },
  ]);

  // Memoized sorted wrestlers
  const sortedWrestlers = useMemo(
    () => sortWrestlers(wrestlers, 'rating', 'desc'),
    [wrestlers]
  );

  // Memoized chart data
  const chartData = useMemo(
    () => ({
      winRate: {
        labels: sortedWrestlers.slice(0, 4).map((w) => w.name),
        values: sortedWrestlers.slice(0, 4).map((w) => {
          const total = (w.wins || 0) + (w.losses || 0);
          return total > 0 ? Math.round(((w.wins || 0) / total) * 100) : 0;
        }),
      },
      matchTypes: {
        labels: ['Singles', 'Tag Team', 'Triple Threat', 'Fatal 4-Way', 'Ladder'],
        values: [45, 30, 15, 8, 2],
      },
      promotions: {
        labels: ['WWE', 'AEW', 'NJPW', 'TNA', 'ROH'],
        values: [92, 88, 95, 75, 70],
      },
    }),
    [sortedWrestlers]
  );

  const handleSimulateMatch = useCallback((match) => {
    const result = {
      winner: match.competitors[0],
      quality: Math.round(Math.random() * 40 + 60),
      crowdReaction: Math.round(Math.random() * 40 + 70),
      momentum: Math.round(Math.random() * 20 + 10),
      popularity: Math.round(Math.random() * 15 + 5),
      damage: Math.round(Math.random() * 30 + 20),
      injury: Math.random() > 0.8 ? 'Minor injury - 2 weeks recovery' : null,
    };
    setMatchResult(result);
    setShowFeedback(true);
  }, []);

  const handleThemeSwitch = useCallback((promotion) => {
    switchTheme(promotion);
  }, [switchTheme]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
      {/* Header */}
      <AnimatedCard delay={0}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
              Pro Wrestling Sim Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Advanced UI/UX Integration Demo</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Current Theme</p>
            <p className="text-lg font-bold text-yellow-400 capitalize">{currentTheme}</p>
          </div>
        </div>
      </AnimatedCard>

      {/* Theme Switcher */}
      <AnimatedCard delay={100}>
        <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">🎨 Switch Promotion Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {['WWE', 'AEW', 'NJPW', 'TNA', 'ROH', 'CMLL'].map((promo) => (
              <AnimatedButton
                key={promo}
                onClick={() => handleThemeSwitch(promo)}
                className={`py-2 px-3 rounded font-bold text-sm transition-all ${
                  currentTheme === promo.toLowerCase()
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {promo}
              </AnimatedButton>
            ))}
          </div>
        </div>
      </AnimatedCard>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Wrestlers */}
        <AnimatedCard delay={200}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">🤼 Top Wrestlers</h2>
            <div className="space-y-3">
              {sortedWrestlers.slice(0, 4).map((wrestler, idx) => (
                <ModernWrestlerCard
                  key={wrestler.id}
                  wrestler={wrestler}
                  onSelect={setSelectedWrestler}
                  isSelected={selectedWrestler?.id === wrestler.id}
                />
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Center Column - Charts */}
        <AnimatedCard delay={300}>
          <div className="space-y-6">
            <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">📊 Win Rate Trends</h3>
              <WinRateChart data={chartData.winRate} />
            </div>
            <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">🎯 Match Types</h3>
              <MatchTypeDistribution data={chartData.matchTypes} />
            </div>
          </div>
        </AnimatedCard>

        {/* Right Column - Matches */}
        <AnimatedCard delay={400}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">🏆 Upcoming Matches</h2>
            <div className="space-y-3">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSimulate={handleSimulateMatch}
                />
              ))}
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Promotion Comparison */}
      <AnimatedCard delay={500}>
        <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📈 Promotion Comparison</h2>
          <PromotionComparison data={chartData.promotions} />
        </div>
      </AnimatedCard>

      {/* Selected Wrestler Details */}
      {selectedWrestler && (
        <AnimatedCard delay={600}>
          <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">⭐ {selectedWrestler.name} - Detailed Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-black bg-opacity-50 p-4 rounded text-center">
                <p className="text-gray-400 text-sm">Overall Rating</p>
                <p className="text-2xl font-bold text-green-400">
                  {computeWrestlerRating(selectedWrestler)}
                </p>
              </div>
              <div className="bg-black bg-opacity-50 p-4 rounded text-center">
                <p className="text-gray-400 text-sm">Wrestling Skill</p>
                <p className="text-2xl font-bold text-blue-400">
                  {selectedWrestler.wrestlingSkill}
                </p>
              </div>
              <div className="bg-black bg-opacity-50 p-4 rounded text-center">
                <p className="text-gray-400 text-sm">Entertainment</p>
                <p className="text-2xl font-bold text-purple-400">
                  {selectedWrestler.entertainment}
                </p>
              </div>
              <div className="bg-black bg-opacity-50 p-4 rounded text-center">
                <p className="text-gray-400 text-sm">Star Power</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {selectedWrestler.starPower}
                </p>
              </div>
              <div className="bg-black bg-opacity-50 p-4 rounded text-center">
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-red-400">
                  {selectedWrestler.wins && selectedWrestler.losses
                    ? Math.round(
                        (selectedWrestler.wins /
                          (selectedWrestler.wins + selectedWrestler.losses)) *
                          100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50">
        <InUniverseNotifications />
      </div>

      {/* Simulation Feedback Modal */}
      <SimulationFeedback
        matchResult={matchResult}
        isVisible={showFeedback}
        onClose={() => setShowFeedback(false)}
      />

      {/* Animation Styles */}
      <style jsx>{`
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

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
