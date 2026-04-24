import React, { useState } from 'react';
import { Crown, Award } from 'lucide-react';

export default function Titles() {
  const [titles] = useState([
    { id: 1, name: 'WWE Championship', champion: 'John Cena', promotion: 'WWE', defenses: 5, daysHeld: 120 },
    { id: 2, name: 'World Heavyweight Championship', champion: 'The Rock', promotion: 'WWE', defenses: 3, daysHeld: 90 },
    { id: 3, name: 'Intercontinental Championship', champion: 'Stone Cold', promotion: 'WWE', defenses: 8, daysHeld: 180 },
    { id: 4, name: 'United States Championship', champion: 'Triple H', promotion: 'WWE', defenses: 6, daysHeld: 150 },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <Crown className="text-yellow-400" size={32} /> Championship Titles
      </h1>

      <div className="grid grid-cols-1 gap-4">
        {titles.map((title) => (
          <div key={title.id} className="bg-gray-800 border border-red-600 p-4 rounded">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Award className="text-yellow-400 flex-shrink-0" size={28} />
                <div>
                  <h3 className="text-xl font-bold">{title.name}</h3>
                  <p className="text-gray-400">{title.promotion}</p>
                </div>
              </div>
              <span className="bg-red-600 px-3 py-1 rounded text-sm font-bold">
                {title.daysHeld} days
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-gray-400 text-sm">Current Champion</p>
                <p className="text-lg font-bold">{title.champion}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-gray-400 text-sm">Title Defenses</p>
                <p className="text-lg font-bold text-green-400">{title.defenses}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-gray-400 text-sm">Reign Status</p>
                <p className="text-lg font-bold text-yellow-400">Active</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-800 border border-red-600 p-4 rounded">
        <h2 className="text-xl font-bold mb-4">Title History</h2>
        <div className="space-y-2">
          <p className="text-gray-400">• WWE Championship: Last changed 120 days ago</p>
          <p className="text-gray-400">• World Heavyweight: Last changed 90 days ago</p>
          <p className="text-gray-400">• Intercontinental: Last changed 180 days ago</p>
        </div>
      </div>
    </div>
  );
}
