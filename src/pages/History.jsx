import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ChevronDown } from 'lucide-react';

export default function History() {
  const [events, setEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    // Placeholder - será implementado com IPC
    setEvents([
      {
        id: 1,
        name: 'WrestleMania 42',
        promo: 'WWE',
        date: '2026-01-29',
        matches: 3,
        avgRating: 8.5,
        matches_detail: [
          { worker1: 'John Cena', worker2: 'The Rock', winner: 'The Rock', quality: 8.5 },
          { worker1: 'Roman Reigns', worker2: 'Seth Rollins', winner: 'Roman Reigns', quality: 8.0 },
          { worker1: 'The Undertaker', worker2: 'Shawn Michaels', winner: 'The Undertaker', quality: 8.7 },
        ],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📜 Histórico de Eventos</h1>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-400">Nenhum evento criado ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id}>
                <div
                  onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                  className="cursor-pointer"
                >
                  <CardHeader className="hover:bg-slate-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle>{event.name}</CardTitle>
                        <p className="text-sm text-slate-400 mt-2">
                          {event.promo} • {event.date} • {event.matches} matches
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-2xl font-bold text-yellow-400">{event.avgRating.toFixed(1)}</p>
                        <p className="text-xs text-slate-400">Rating Médio</p>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 transition-transform ${
                          expandedEvent === event.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </CardHeader>
                </div>

                {expandedEvent === event.id && (
                  <CardContent className="border-t border-border">
                    <div className="space-y-3 pt-4">
                      {event.matches_detail.map((match, idx) => (
                        <div key={idx} className="bg-slate-900 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-bold">{match.worker1} vs {match.worker2}</p>
                              <p className="text-sm text-slate-400">
                                🥇 Vencedor: <span className="text-green-400">{match.winner}</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-yellow-400">{match.quality.toFixed(1)}</p>
                              <p className="text-xs text-slate-400">Qualidade</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
