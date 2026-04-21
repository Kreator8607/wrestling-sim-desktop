import { useState, useEffect } from 'react';
import { Users, TrendingUp, Trophy, Target, Calendar, Award, Flame, Star } from 'lucide-react';

export default function CareerMode() {
  const [selectedWrestler, setSelectedWrestler] = useState(null);
  const [wrestlers, setWrestlers] = useState([]);
  const [careerStats, setCareerStats] = useState(null);
  const [objectives, setObjectives] = useState([]);

  useEffect(() => {
    // Load sample wrestlers
    const sampleWrestlers = [
      { id: 1, name: 'John Cena', promotion: 'WWE', rating: 95, wins: 245, losses: 32 },
      { id: 2, name: 'Roman Reigns', promotion: 'WWE', rating: 98, wins: 189, losses: 18 },
      { id: 3, name: 'The Rock', promotion: 'WWE', rating: 92, wins: 156, losses: 28 },
      { id: 4, name: 'Stone Cold Steve Austin', promotion: 'WWE', rating: 96, wins: 201, losses: 25 },
      { id: 5, name: 'Brock Lesnar', promotion: 'WWE', rating: 94, wins: 178, losses: 35 },
      { id: 6, name: 'CM Punk', promotion: 'AEW', rating: 91, wins: 167, losses: 42 },
      { id: 7, name: 'Jon Moxley', promotion: 'AEW', rating: 90, wins: 145, losses: 38 },
      { id: 8, name: 'Kenny Omega', promotion: 'AEW', rating: 93, wins: 198, losses: 31 },
    ];
    setWrestlers(sampleWrestlers);
  }, []);

  const handleSelectWrestler = (wrestler) => {
    setSelectedWrestler(wrestler);
    
    // Generate career stats
    const stats = {
      totalMatches: wrestler.wins + wrestler.losses,
      winRate: ((wrestler.wins / (wrestler.wins + wrestler.losses)) * 100).toFixed(1),
      currentRating: wrestler.rating,
      titlesHeld: Math.floor(Math.random() * 5) + 1,
      titleReigns: Math.floor(Math.random() * 8) + 2,
      longestWinStreak: Math.floor(Math.random() * 15) + 3,
      averageMatchQuality: (Math.random() * 40 + 60).toFixed(1),
    };
    setCareerStats(stats);

    // Generate objectives
    const newObjectives = [
      {
        id: 1,
        title: 'Vencer 300 Matches',
        description: `Progresso: ${wrestler.wins}/300`,
        progress: (wrestler.wins / 300) * 100,
        reward: 100,
        completed: wrestler.wins >= 300,
      },
      {
        id: 2,
        title: 'Ganhar Título Mundial',
        description: 'Coroar campeão mundial',
        progress: Math.random() * 100,
        reward: 150,
        completed: false,
      },
      {
        id: 3,
        title: 'Manter Título por 100 Dias',
        description: 'Defender um título por 100 dias consecutivos',
        progress: Math.random() * 100,
        reward: 120,
        completed: false,
      },
      {
        id: 4,
        title: 'Win Streak de 20',
        description: 'Vencer 20 matches consecutivos',
        progress: Math.random() * 100,
        reward: 80,
        completed: false,
      },
      {
        id: 5,
        title: 'Alcançar Rating 99',
        description: `Rating: ${wrestler.rating}/99`,
        progress: (wrestler.rating / 99) * 100,
        reward: 200,
        completed: wrestler.rating >= 99,
      },
    ];
    setObjectives(newObjectives);
  };

  const WrestlerCard = ({ wrestler, isSelected }) => (
    <button
      onClick={() => handleSelectWrestler(wrestler)}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold">{wrestler.name}</h3>
          <p className="text-xs text-muted-foreground">{wrestler.promotion}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-yellow-500">{wrestler.rating}</div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
      </div>
      <div className="flex gap-4 text-xs">
        <div>
          <p className="text-muted-foreground">Vitórias</p>
          <p className="font-bold text-green-500">{wrestler.wins}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Derrotas</p>
          <p className="font-bold text-red-500">{wrestler.losses}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Modo Carreira</h1>
        <p className="text-muted-foreground">Acompanhe a carreira de um lutador e complete objetivos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wrestlers List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Selecione um Lutador</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {wrestlers.map((wrestler) => (
              <WrestlerCard
                key={wrestler.id}
                wrestler={wrestler}
                isSelected={selectedWrestler?.id === wrestler.id}
              />
            ))}
          </div>
        </div>

        {/* Career Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedWrestler ? (
            <>
              {/* Wrestler Header */}
              <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{selectedWrestler.name}</h2>
                    <p className="text-muted-foreground">{selectedWrestler.promotion}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-yellow-500">{selectedWrestler.rating}</div>
                    <div className="text-sm text-muted-foreground">Rating Geral</div>
                  </div>
                </div>
              </div>

              {/* Career Stats */}
              {careerStats && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total de Matches</p>
                    <p className="text-2xl font-bold">{careerStats.totalMatches}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Taxa de Vitória</p>
                    <p className="text-2xl font-bold text-green-500">{careerStats.winRate}%</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Títulos Conquistados</p>
                    <p className="text-2xl font-bold text-yellow-500">{careerStats.titleReigns}</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Maior Win Streak</p>
                    <p className="text-2xl font-bold text-purple-500">{careerStats.longestWinStreak}</p>
                  </div>
                </div>
              )}

              {/* Objectives */}
              <div>
                <h3 className="text-xl font-bold mb-4">Objetivos de Carreira</h3>
                <div className="space-y-3">
                  {objectives.map((obj) => (
                    <div
                      key={obj.id}
                      className={`p-4 rounded-lg border transition-all ${
                        obj.completed
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            {obj.completed && <span className="text-green-500">✓</span>}
                            {obj.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{obj.description}</p>
                        </div>
                        <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded">
                          +{obj.reward}pt
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            obj.completed
                              ? 'bg-green-500'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${obj.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Timeline */}
              <div>
                <h3 className="text-xl font-bold mb-4">Histórico de Carreira</h3>
                <div className="space-y-2">
                  {[
                    { date: '2024-03-15', event: 'Coroado Campeão Mundial', type: 'achievement' },
                    { date: '2024-03-10', event: 'Win Streak de 15 matches', type: 'milestone' },
                    { date: '2024-03-05', event: 'Rating alcançou 95', type: 'rating' },
                    { date: '2024-02-28', event: 'Primeira defesa de título', type: 'achievement' },
                    { date: '2024-02-20', event: 'Entrou no Top 5 do ranking', type: 'milestone' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-card border border-border rounded-lg">
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{item.date}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.event}</p>
                      </div>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <Users className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">Selecione um lutador para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
