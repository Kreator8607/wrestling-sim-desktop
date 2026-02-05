import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ChevronDown } from 'lucide-react';

export default function Titles() {
  const [titles, setTitles] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState(null);

  useEffect(() => {
    loadTitles();
  }, []);

  const loadTitles = async () => {
    // Placeholder - será implementado com IPC
    setTitles([
      {
        id: 1,
        name: 'WWE Championship',
        promo: 'WWE',
        prestige: 99,
        champion: 'John Cena',
        defenses: 5,
        history: [
          { champion: 'John Cena', start: '2026-01-29', end: null, defenses: 5 },
          { champion: 'Roman Reigns', start: '2026-01-15', end: '2026-01-29', defenses: 3 },
        ],
      },
      {
        id: 2,
        name: 'AEW World Championship',
        promo: 'AEW',
        prestige: 95,
        champion: 'Kenny Omega',
        defenses: 2,
        history: [
          { champion: 'Kenny Omega', start: '2026-01-20', end: null, defenses: 2 },
        ],
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">👑 Gerenciamento de Títulos</h1>

        {titles.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-slate-400">Nenhum título disponível</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {titles.map((title) => (
              <Card key={title.id}>
                <div
                  onClick={() => setExpandedTitle(expandedTitle === title.id ? null : title.id)}
                  className="cursor-pointer"
                >
                  <CardHeader className="hover:bg-slate-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle>{title.name}</CardTitle>
                        <p className="text-sm text-slate-400 mt-2">
                          {title.promo} • Prestige: {title.prestige}
                        </p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="text-lg font-bold text-yellow-400">{title.champion}</p>
                        <p className="text-xs text-slate-400">Campeão Atual</p>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 transition-transform ${
                          expandedTitle === title.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </CardHeader>
                </div>

                {expandedTitle === title.id && (
                  <CardContent className="border-t border-border">
                    <div className="space-y-4 pt-4">
                      <div className="bg-slate-900 rounded-lg p-4">
                        <p className="text-sm text-slate-400 mb-2">Campeão Atual</p>
                        <p className="text-2xl font-bold text-yellow-400">{title.champion}</p>
                        <p className="text-sm text-slate-400 mt-2">
                          Defesas: <span className="text-green-400">{title.defenses}</span>
                        </p>
                      </div>

                      <div>
                        <p className="font-bold mb-3">Histórico de Reinados</p>
                        <div className="space-y-2">
                          {title.history.map((reign, idx) => (
                            <div key={idx} className="bg-slate-900 rounded-lg p-3 text-sm">
                              <p className="font-medium">{reign.champion}</p>
                              <p className="text-slate-400">
                                {reign.start} {reign.end ? `até ${reign.end}` : '(Atual)'}
                              </p>
                              <p className="text-slate-400">Defesas: {reign.defenses}</p>
                            </div>
                          ))}
                        </div>
                      </div>
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
