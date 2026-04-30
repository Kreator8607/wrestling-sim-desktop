import { useState, useMemo } from 'react';
import { Star, TrendingUp, Heart, Zap, Shield } from 'lucide-react';

// Optimized Wrestler Card Component
export default function ModernWrestlerCard({ wrestler, onSelect, isSelected = false }) {
  const [isHovered, setIsHovered] = useState(false);

  // Memoize computed values to prevent unnecessary recalculations
  const stats = useMemo(() => ({
    overall: Math.round(
      (wrestler.wrestlingSkill +
        wrestler.entertainment +
        wrestler.starPower +
        wrestler.intimidation +
        wrestler.sexAppeal) /
        5
    ),
    winRate: wrestler.wins ? Math.round((wrestler.wins / (wrestler.wins + wrestler.losses)) * 100) : 0,
    momentum: wrestler.wins > wrestler.losses ? 'Rising' : 'Declining',
  }), [wrestler]);

  // Memoize color calculations
  const colors = useMemo(() => ({
    overall: stats.overall > 80 ? 'text-green-400' : stats.overall > 60 ? 'text-yellow-400' : 'text-red-400',
    momentum: stats.momentum === 'Rising' ? 'text-green-400' : 'text-red-400',
  }), [stats]);

  const getAttributeColor = (value) => {
    if (value >= 80) return 'from-green-500 to-green-600';
    if (value >= 60) return 'from-yellow-500 to-yellow-600';
    if (value >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getAttributeLabel = (value) => {
    if (value >= 80) return 'Elite';
    if (value >= 60) return 'Great';
    if (value >= 40) return 'Good';
    return 'Fair';
  };

  const AttributeBar = ({ label, value, icon: Icon }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Icon && <Icon className="w-3 h-3 text-gray-400" />}
          <span className="text-xs text-gray-400">{label}</span>
        </div>
        <span className="text-xs font-bold text-gray-300">{getAttributeLabel(value)}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getAttributeColor(value)} transition-all duration-300`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(wrestler)}
      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 cursor-pointer ${
        isSelected
          ? 'border-yellow-500 shadow-2xl shadow-yellow-500'
          : 'border-gray-700 hover:border-red-600'
      } ${isHovered ? 'shadow-xl' : 'shadow-lg'}`}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90" />

      {/* Content */}
      <div className="relative p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-black text-white truncate">{wrestler.name}</h3>
            <p className="text-xs text-gray-400">{wrestler.promotion}</p>
          </div>
          {isSelected && (
            <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          )}
        </div>

        {/* Overall Rating */}
        <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Overall Rating</span>
            <span className={`text-2xl font-black ${colors.overall}`}>
              {stats.overall}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getAttributeColor(stats.overall)} transition-all duration-300`}
              style={{ width: `${stats.overall}%` }}
            />
          </div>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-2 gap-3">
          <AttributeBar
            label="Wrestling"
            value={wrestler.wrestlingSkill}
            icon={Shield}
          />
          <AttributeBar
            label="Entertainment"
            value={wrestler.entertainment}
            icon={Zap}
          />
          <AttributeBar
            label="Star Power"
            value={wrestler.starPower}
            icon={Star}
          />
          <AttributeBar
            label="Intimidation"
            value={wrestler.intimidation}
            icon={TrendingUp}
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-black bg-opacity-50 p-2 rounded border border-gray-700">
            <p className="text-xs text-gray-400">Wins</p>
            <p className="text-sm font-bold text-green-400">{wrestler.wins || 0}</p>
          </div>
          <div className="bg-black bg-opacity-50 p-2 rounded border border-gray-700">
            <p className="text-xs text-gray-400">Losses</p>
            <p className="text-sm font-bold text-red-400">{wrestler.losses || 0}</p>
          </div>
          <div className="bg-black bg-opacity-50 p-2 rounded border border-gray-700">
            <p className="text-xs text-gray-400">Win Rate</p>
            <p className="text-sm font-bold text-yellow-400">{stats.winRate}%</p>
          </div>
        </div>

        {/* Momentum */}
        <div className="flex items-center justify-between bg-black bg-opacity-50 p-2 rounded border border-gray-700">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Momentum
          </span>
          <span className={`text-xs font-bold ${colors.momentum}`}>
            {stats.momentum}
          </span>
        </div>

        {/* Titles */}
        {wrestler.titles && wrestler.titles.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-gray-400">Titles</p>
            <div className="flex flex-wrap gap-1">
              {wrestler.titles.map((title, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-yellow-600 text-white px-2 py-1 rounded font-bold"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full py-2 px-3 rounded font-bold text-sm transition-all duration-300 ${
            isSelected
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isSelected ? 'Selected' : 'Select Wrestler'}
        </button>
      </div>

      {/* Hover Effect Border */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-red-600 rounded-lg opacity-50" />
        </div>
      )}
    </div>
  );
}

// Optimized Wrestler List Component
export function WrestlerCardList({ wrestlers, onSelect, selectedId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wrestlers.map((wrestler) => (
        <ModernWrestlerCard
          key={wrestler.id}
          wrestler={wrestler}
          onSelect={onSelect}
          isSelected={selectedId === wrestler.id}
        />
      ))}
    </div>
  );
}
