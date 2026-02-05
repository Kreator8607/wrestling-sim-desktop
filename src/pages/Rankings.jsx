import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Select } from '@/components/ui/Input';

export default function Rankings() {
  const [rankings, setRankings] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState('all');
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    loadPromotions();
    loadRankings();
  }, [selectedPromotion]);

  const loadPromotions = async () => {
    setPromotions([
      { id: 'all', name: 'Todas as Promoções' },
      { id: 1, name: 'WWE' },
      { id: 2, name: 'AEW' },
      { id: 3, name: 'NJPW' },
      { id: 4, name: 'IMPACT' },
      { id: 5, name: 'ROH' },
    ]);
  };

  const loadRankings = async () => {
    // Placeholder - será implementado com IPC
    setRankings([
      { rank: 1, name: 'John Cena', promo: 'WWE', wins: 5, losses: 2, avgQuality: 8.5 },
      { rank: 2, name: 'The Rock', promo: 'WWE', wins: 4, losses: 1, avgQuality: 8.7 },
      { rank: 3, name: 'Roman Reigns', promo: 'WWE', wins: 3, losses: 2, avgQuality: 8.2 },
      { rank: 4, name: 'Kenny Omega', promo: 'AEW', wins: 3, losses: 1, avgQuality: 8.4 },
      { rank: 5, name: 'Kazuchika Okada', promo: 'NJPW', wins: 2, losses: 0, avgQuality: 8.9 },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🏆 Rankings de Lutadores</h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <label className="font-medium">Promoção:</label>
              <Select
                value={selectedPromotion}
                onChange={(e) => setSelectedPromotion(e.target.value)}
                className="w-64"
              >
                {promotions.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ranking Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-bold">Rank</th>
                    <th className="text-left py-3 px-4 font-bold">Lutador</th>
                    <th className="text-left py-3 px-4 font-bold">Promoção</th>
                    <th className="text-center py-3 px-4 font-bold">Vitórias</th>
                    <th className="text-center py-3 px-4 font-bold">Derrotas</th>
                    <th className="text-center py-3 px-4 font-bold">Qualidade Média</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((wrestler) => (
                    <tr key={wrestler.rank} className="border-b border-border hover:bg-slate-800 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-lg font-bold">#{wrestler.rank}</span>
                      </td>
                      <td className="py-3 px-4 font-medium">{wrestler.name}</td>
                      <td className="py-3 px-4 text-slate-400">{wrestler.promo}</td>
                      <td className="py-3 px-4 text-center text-green-400 font-bold">{wrestler.wins}</td>
                      <td className="py-3 px-4 text-center text-red-400 font-bold">{wrestler.losses}</td>
                      <td className="py-3 px-4 text-center">{wrestler.avgQuality.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
