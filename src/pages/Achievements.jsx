import { useState, useEffect } from 'react';
import { Trophy, Lock, Star, Zap, Users, Crown, TrendingUp, Target, Award, Flame } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Initialize achievements from database
    const allAchievements = [
      // Simulação
      {
        id: 1,
        name: 'Primeiro Evento',
        description: 'Crie seu primeiro evento de wrestling',
        icon: 'Play',
        points: 10,
        category: 'simulacao',
        unlocked: true,
        unlockedDate: '2024-01-15',
        progress: 100,
      },
      {
        id: 2,
        name: 'Mestre de Eventos',
        description: 'Crie 50 eventos',
        icon: 'Calendar',
        points: 50,
        category: 'simulacao',
        unlocked: false,
        progress: 12,
        target: 50,
      },
      {
        id: 3,
        name: 'Simulador Profissional',
        description: 'Simule 100 matches',
        icon: 'Zap',
        points: 100,
        category: 'simulacao',
        unlocked: false,
        progress: 45,
        target: 100,
      },
      {
        id: 4,
        name: 'Maratona de Eventos',
        description: 'Crie 10 eventos em um dia',
        icon: 'Flame',
        points: 75,
        category: 'simulacao',
        unlocked: false,
        progress: 3,
        target: 10,
      },

      // Rankings
      {
        id: 5,
        name: 'Analista de Rankings',
        description: 'Visualize o ranking 10 vezes',
        icon: 'TrendingUp',
        points: 15,
        category: 'rankings',
        unlocked: true,
        unlockedDate: '2024-01-20',
        progress: 100,
      },
      {
        id: 6,
        name: 'Rastreador de Estrelas',
        description: 'Acompanhe um lutador até o topo do ranking',
        icon: 'Star',
        points: 60,
        category: 'rankings',
        unlocked: false,
        progress: 65,
        target: 100,
      },
      {
        id: 7,
        name: 'Rei do Rankings',
        description: 'Tenha 5 lutadores no top 10',
        icon: 'Crown',
        points: 80,
        category: 'rankings',
        unlocked: false,
        progress: 2,
        target: 5,
      },

      // Títulos
      {
        id: 8,
        name: 'Primeiro Campeão',
        description: 'Coroe seu primeiro campeão',
        icon: 'Crown',
        points: 25,
        category: 'titulos',
        unlocked: true,
        unlockedDate: '2024-01-25',
        progress: 100,
      },
      {
        id: 9,
        name: 'Mestre de Títulos',
        description: 'Gerencie todos os 59 títulos',
        icon: 'Trophy',
        points: 150,
        category: 'titulos',
        unlocked: false,
        progress: 28,
        target: 59,
      },
      {
        id: 10,
        name: 'Defensor Invencível',
        description: 'Um campeão com 20+ defesas de título',
        icon: 'Flame',
        points: 100,
        category: 'titulos',
        unlocked: false,
        progress: 8,
        target: 20,
      },
      {
        id: 11,
        name: 'Colecionador de Ouro',
        description: 'Tenha 10 campeões simultâneos',
        icon: 'Award',
        points: 120,
        category: 'titulos',
        unlocked: false,
        progress: 3,
        target: 10,
      },

      // Milestones
      {
        id: 12,
        name: 'Centésimo Match',
        description: 'Simule 100 matches',
        icon: 'Zap',
        points: 100,
        category: 'milestones',
        unlocked: false,
        progress: 45,
        target: 100,
      },
      {
        id: 13,
        name: 'Mil Horas',
        description: 'Jogue por 1000 horas',
        icon: 'Target',
        points: 500,
        category: 'milestones',
        unlocked: false,
        progress: 250,
        target: 1000,
      },
      {
        id: 14,
        name: 'Colecionador de Dados',
        description: 'Crie 5000 registros de matches',
        icon: 'Users',
        points: 200,
        category: 'milestones',
        unlocked: false,
        progress: 1200,
        target: 5000,
      },

      // Especiais
      {
        id: 15,
        name: 'Explorador',
        description: 'Acesse todas as páginas do aplicativo',
        icon: 'Zap',
        points: 40,
        category: 'especiais',
        unlocked: true,
        unlockedDate: '2024-02-01',
        progress: 100,
      },
      {
        id: 16,
        name: 'Perfeccionista',
        description: 'Desbloqueie todos os achievements',
        icon: 'Trophy',
        points: 1000,
        category: 'especiais',
        unlocked: false,
        progress: 8,
        target: 16,
      },
    ];

    setAchievements(allAchievements);
    const unlocked = allAchievements.filter(a => a.unlocked).length;
    const points = allAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
    setUnlockedCount(unlocked);
    setTotalPoints(points);
  }, []);

  const categories = [
    { id: 'all', label: 'Todos', icon: Trophy },
    { id: 'simulacao', label: 'Simulação', icon: Zap },
    { id: 'rankings', label: 'Rankings', icon: TrendingUp },
    { id: 'titulos', label: 'Títulos', icon: Crown },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'especiais', label: 'Especiais', icon: Star },
  ];

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === filter);

  const getIconComponent = (iconName) => {
    const icons = { Trophy, Lock, Star, Zap, Users, Crown, TrendingUp, Target, Award, Flame };
    return icons[iconName] || Trophy;
  };

  const AchievementCard = ({ achievement }) => {
    const Icon = getIconComponent(achievement.icon);
    const isUnlocked = achievement.unlocked;
    
    return (
      <div className={`rounded-lg p-4 transition-all ${
        isUnlocked 
          ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30' 
          : 'bg-card border border-border'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isUnlocked 
              ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
              : 'bg-secondary'
          }`}>
            {isUnlocked ? (
              <Icon className="w-6 h-6 text-white" />
            ) : (
              <Lock className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm">{achievement.name}</h3>
              <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded flex-shrink-0">
                {achievement.points}pt
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">{achievement.description}</p>
            
            {!isUnlocked && achievement.target && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{achievement.progress}/{achievement.target}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {isUnlocked && (
              <p className="text-xs text-green-600 font-medium">
                ✓ Desbloqueado em {achievement.unlockedDate}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">Desbloqueie conquistas e ganhe pontos</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Achievements Desbloqueados</p>
              <p className="text-3xl font-bold">{unlockedCount}/{achievements.length}</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pontos Totais</p>
              <p className="text-3xl font-bold">{totalPoints}</p>
            </div>
            <Star className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Progresso Geral</p>
              <p className="text-3xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Nenhum achievement nesta categoria</p>
        </div>
      )}
    </div>
  );
}
