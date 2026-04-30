import { useState } from 'react';
import { Trophy, Users, Calendar, MapPin, Zap } from 'lucide-react';

export default function MatchCard({ match, onSimulate }) {
  const [isHovered, setIsHovered] = useState(false);

  const getPromotionColor = (promotion) => {
    const colors = {
      'WWE': 'from-blue-600 to-blue-800',
      'AEW': 'from-yellow-600 to-black',
      'NJPW': 'from-red-600 to-red-800',
      'TNA': 'from-purple-600 to-purple-800',
      'ROH': 'from-gray-700 to-gray-900',
      'CMLL': 'from-green-600 to-green-800',
    };
    return colors[promotion] || 'from-gray-600 to-gray-800';
  };

  const getMatchTypeColor = (type) => {
    const typeColors = {
      'Singles': 'bg-blue-500',
      'Tag Team': 'bg-purple-500',
      'Triple Threat': 'bg-orange-500',
      'Fatal 4-Way': 'bg-red-500',
      'Ladder': 'bg-yellow-600',
      'Hell in a Cell': 'bg-gray-800',
      'Royal Rumble': 'bg-green-600',
    };
    return typeColors[type] || 'bg-gray-500';
  };

  const matchOdds = match.competitors[0]?.rating > match.competitors[1]?.rating 
    ? `${Math.round((match.competitors[0].rating / (match.competitors[0].rating + match.competitors[1].rating)) * 100)}% - ${100 - Math.round((match.competitors[0].rating / (match.competitors[0].rating + match.competitors[1].rating)) * 100)}%`
    : `${100 - Math.round((match.competitors[0].rating / (match.competitors[0].rating + match.competitors[1].rating)) * 100)}% - ${Math.round((match.competitors[0].rating / (match.competitors[0].rating + match.competitors[1].rating)) * 100)}%`;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-lg border-2 border-red-600 bg-gradient-to-r ${getPromotionColor(match.promotion)} p-4 transition-all duration-300 ${
        isHovered ? 'shadow-2xl shadow-red-600 scale-105' : 'shadow-lg'
      }`}
    >
      {/* Match Type Badge */}
      <div className="absolute top-2 right-2">
        <span className={`${getMatchTypeColor(match.type)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {match.type}
        </span>
      </div>

      {/* Promotion Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-bold text-lg">{match.promotion}</span>
        </div>
        <span className="text-gray-200 text-sm">{match.event}</span>
      </div>

      {/* Match Details */}
      <div className="space-y-3 mb-4">
        {/* Competitors */}
        <div className="space-y-2">
          {match.competitors.map((competitor, idx) => (
            <div key={idx} className="flex items-center justify-between bg-black bg-opacity-40 p-2 rounded">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {competitor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{competitor.name}</p>
                  <p className="text-gray-300 text-xs">Rating: {competitor.rating}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                    style={{ width: `${(competitor.rating / 100) * 100}%` }}
                  />
                </div>
                <p className="text-yellow-300 text-xs font-bold mt-1">{Math.round((competitor.rating / 100) * 100)}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Match Info */}
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-200">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{match.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>Quality: {match.quality}%</span>
          </div>
        </div>

        {/* Odds */}
        <div className="bg-black bg-opacity-40 p-2 rounded text-center">
          <p className="text-gray-300 text-xs mb-1">Predicted Odds</p>
          <p className="text-yellow-300 font-bold">{matchOdds}</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onSimulate(match)}
        className={`w-full py-2 px-4 rounded font-bold text-white transition-all duration-300 ${
          isHovered
            ? 'bg-red-600 hover:bg-red-700 shadow-lg'
            : 'bg-red-700 hover:bg-red-800'
        }`}
      >
        Simulate Match
      </button>

      {/* Title Badge */}
      {match.title && (
        <div className="absolute top-12 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
          {match.title}
        </div>
      )}
    </div>
  );
}
