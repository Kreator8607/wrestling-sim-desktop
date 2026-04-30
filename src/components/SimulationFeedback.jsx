import { useState, useEffect } from 'react';
import { Zap, TrendingUp, Heart, Flame, AlertCircle } from 'lucide-react';

export default function SimulationFeedback({ matchResult, isVisible, onClose }) {
  const [displayedStats, setDisplayedStats] = useState({});
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    if (!isVisible || !matchResult) return;

    setAnimationPhase(0);
    setDisplayedStats({});

    // Animate stats reveal
    const phases = [
      { delay: 300, key: 'winner' },
      { delay: 600, key: 'quality' },
      { delay: 900, key: 'crowd' },
      { delay: 1200, key: 'stats' },
    ];

    phases.forEach(({ delay, key }) => {
      setTimeout(() => {
        setDisplayedStats((prev) => ({ ...prev, [key]: true }));
      }, delay);
    });

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [isVisible, matchResult, onClose]);

  if (!isVisible || !matchResult) return null;

  const getWinnerColor = (winner) => {
    return winner.rating > 75 ? 'text-green-400' : winner.rating > 50 ? 'text-yellow-400' : 'text-red-400';
  };

  const getQualityColor = (quality) => {
    if (quality >= 80) return 'text-green-400';
    if (quality >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCrowdReactionColor = (reaction) => {
    if (reaction >= 80) return 'from-green-600 to-green-800';
    if (reaction >= 60) return 'from-yellow-600 to-yellow-800';
    return 'from-red-600 to-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border-4 border-red-600 rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-2">
            MATCH RESULT
          </h2>
          <div className="h-1 w-32 bg-gradient-to-r from-red-600 to-yellow-600 mx-auto rounded-full" />
        </div>

        {/* Winner */}
        {displayedStats.winner && (
          <div className="mb-8 animate-pulse-in">
            <div className="bg-black bg-opacity-50 border-l-4 border-yellow-500 p-6 rounded">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">🏆 WINNER</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-3xl font-black ${getWinnerColor(matchResult.winner)}`}>
                    {matchResult.winner.name}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {matchResult.winner.promotion}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-2xl font-bold">
                    {matchResult.winner.rating}
                  </p>
                  <p className="text-gray-400 text-xs">Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Match Quality */}
        {displayedStats.quality && (
          <div className="mb-8 animate-pulse-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-black bg-opacity-50 border-l-4 border-blue-500 p-6 rounded">
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">⚡ Match Quality</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Overall Quality</span>
                  <span className={`text-xl font-bold ${getQualityColor(matchResult.quality)}`}>
                    {matchResult.quality}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${matchResult.quality}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crowd Reaction */}
        {displayedStats.crowd && (
          <div className="mb-8 animate-pulse-in" style={{ animationDelay: '0.4s' }}>
            <div className={`bg-gradient-to-r ${getCrowdReactionColor(matchResult.crowdReaction)} bg-opacity-20 border-l-4 border-orange-500 p-6 rounded`}>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-3">👥 Crowd Reaction</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <span className="text-gray-300">Crowd Heat</span>
                </div>
                <span className="text-2xl font-bold text-orange-400">
                  {matchResult.crowdReaction}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats */}
        {displayedStats.stats && (
          <div className="grid grid-cols-3 gap-4 mb-8 animate-pulse-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-black bg-opacity-50 border border-gray-700 p-4 rounded text-center">
              <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs uppercase mb-1">Momentum</p>
              <p className="text-green-400 font-bold text-lg">+{matchResult.momentum}</p>
            </div>
            <div className="bg-black bg-opacity-50 border border-gray-700 p-4 rounded text-center">
              <Heart className="w-5 h-5 text-red-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs uppercase mb-1">Popularity</p>
              <p className="text-red-400 font-bold text-lg">+{matchResult.popularity}</p>
            </div>
            <div className="bg-black bg-opacity-50 border border-gray-700 p-4 rounded text-center">
              <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
              <p className="text-gray-400 text-xs uppercase mb-1">Damage</p>
              <p className="text-yellow-400 font-bold text-lg">{matchResult.damage}%</p>
            </div>
          </div>
        )}

        {/* Injury Alert */}
        {matchResult.injury && (
          <div className="mb-6 bg-red-900 bg-opacity-30 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold text-sm">⚠️ Injury Report</p>
              <p className="text-gray-300 text-sm mt-1">{matchResult.injury}</p>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-in {
          animation: pulse-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
