import React, { useState } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

export default function Rankings() {
  const [rankings] = useState([
    { rank: 1, wrestler: 'John Cena', promotion: 'WWE', rating: 95, wins: 45, losses: 5 },
    { rank: 2, wrestler: 'The Rock', promotion: 'WWE', rating: 92, wins: 42, losses: 8 },
    { rank: 3, wrestler: 'Stone Cold', promotion: 'WWE', rating: 90, wins: 40, losses: 10 },
    { rank: 4, wrestler: 'Triple H', promotion: 'WWE', rating: 88, wins: 38, losses: 12 },
    { rank: 5, wrestler: 'Shawn Michaels', promotion: 'WWE', rating: 85, wins: 35, losses: 15 },
  ]);

  const [promotionFilter, setPromotionFilter] = useState('All');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="text-yellow-400" size={32} /> Rankings
        </h1>
        <select
          value={promotionFilter}
          onChange={(e) => setPromotionFilter(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          <option>All</option>
          <option>WWE</option>
          <option>AEW</option>
          <option>NJPW</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 border-b-2 border-red-600">
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Wrestler</th>
              <th className="p-3 text-left">Promotion</th>
              <th className="p-3 text-center">Rating</th>
              <th className="p-3 text-center">Wins</th>
              <th className="p-3 text-center">Losses</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((entry) => (
              <tr key={entry.rank} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-3">
                  <span className="text-yellow-400 font-bold text-lg">#{entry.rank}</span>
                </td>
                <td className="p-3 font-bold">{entry.wrestler}</td>
                <td className="p-3 text-gray-400">{entry.promotion}</td>
                <td className="p-3 text-center">
                  <span className="bg-red-600 px-2 py-1 rounded">{entry.rating}</span>
                </td>
                <td className="p-3 text-center text-green-400 font-bold">{entry.wins}</td>
                <td className="p-3 text-center text-red-400 font-bold">{entry.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-800 border border-red-600 p-4 rounded">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-400" /> Top Movers
        </h2>
        <div className="space-y-2">
          <p className="text-gray-400">• John Cena: <span className="text-green-400">↑ +2</span></p>
          <p className="text-gray-400">• The Rock: <span className="text-green-400">↑ +1</span></p>
          <p className="text-gray-400">• Stone Cold: <span className="text-red-400">↓ -1</span></p>
        </div>
      </div>
    </div>
  );
}
