import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function History() {
  const [expandedId, setExpandedId] = useState(null);

  const history = [
    {
      id: 1,
      date: '2026-04-07',
      event: 'WrestleMania 40',
      matches: [
        { winner: 'John Cena', loser: 'The Rock', type: 'Singles' },
        { winner: 'Stone Cold', loser: 'Undertaker', type: 'Singles' },
      ],
    },
    {
      id: 2,
      date: '2026-01-26',
      event: 'Royal Rumble 2026',
      matches: [
        { winner: 'Triple H', loser: 'Shawn Michaels', type: 'Rumble' },
      ],
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Match History</h1>

      <div className="space-y-4">
        {history.map((event) => (
          <div key={event.id} className="bg-gray-800 border border-red-600 rounded">
            <button
              onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
              className="w-full p-4 flex justify-between items-center hover:bg-gray-700 transition"
            >
              <div className="text-left">
                <h3 className="text-lg font-bold">{event.event}</h3>
                <p className="text-gray-400">{event.date}</p>
              </div>
              <ChevronDown
                size={24}
                className={`transform transition ${expandedId === event.id ? 'rotate-180' : ''}`}
              />
            </button>

            {expandedId === event.id && (
              <div className="bg-gray-700 p-4 border-t border-red-600">
                {event.matches.map((match, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <p className="text-white">
                      <span className="font-bold text-green-400">{match.winner}</span>
                      {' '}defeated{' '}
                      <span className="font-bold text-red-400">{match.loser}</span>
                    </p>
                    <p className="text-gray-400 text-sm">Type: {match.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
