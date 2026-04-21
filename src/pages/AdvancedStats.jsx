import { useState, useEffect } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Trophy, Zap, Calendar, Target } from 'lucide-react';

export default function AdvancedStats() {
  const [stats, setStats] = useState({
    totalMatches: 1250,
    totalEvents: 145,
    averageMatchQuality: 7.8,
    totalWrestlers: 3054,
    activeChampions: 28,
    injuredWrestlers: 12,
  });

  const [timeRange, setTimeRange] = useState('month');
  const [selectedPromotion, setSelectedPromotion] = useState('all');

  const promotions = [
    { id: 'all', name: 'Todas as Promoções' },
    { id: 'wwe', name: 'WWE' },
    { id: 'aew', name: 'AEW' },
    { id: 'njpw', name: 'NJPW' },
    { id: 'tna', name: 'TNA' },
    { id: 'roh', name: 'ROH' },
  ];

  // Sample data for charts
  const matchQualityData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    values: [7.2, 7.5, 7.8, 7.4, 8.1, 8.3, 7.9],
  };

  const winRateByPromotion = {
    labels: ['WWE', 'AEW', 'NJPW', 'TNA', 'ROH'],
    values: [65, 58, 72, 54, 61],
  };

  const matchTypeDistribution = {
    labels: ['Singles', 'Tag Team', 'Triple Threat', 'Fatal 4-Way', 'Outros'],
    values: [45, 30, 15, 8, 2],
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            trend > 0 
              ? 'bg-green-500/20 text-green-600' 
              : 'bg-red-500/20 text-red-600'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  const ChartContainer = ({ title, children }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {children}
    </div>
  );

  const BarChartSimple = ({ data, title }) => {
    const maxValue = Math.max(...data.values);
    return (
      <div className="space-y-3">
        {data.labels.map((label, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{label}</span>
              <span className="text-sm text-muted-foreground">{data.values[idx]}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${(data.values[idx] / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const PieChartSimple = ({ data }) => {
    const total = data.values.reduce((a, b) => a + b, 0);
    const colors = ['from-blue-500', 'from-purple-500', 'from-pink-500', 'from-yellow-500', 'from-green-500'];
    
    return (
      <div className="space-y-3">
        {data.labels.map((label, idx) => {
          const percentage = ((data.values[idx] / total) * 100).toFixed(1);
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[idx]}`} />
              <span className="text-sm flex-1">{label}</span>
              <span className="text-sm font-bold">{percentage}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Estatísticas Avançadas</h1>
        <p className="text-muted-foreground">Análises detalhadas e métricas de desempenho</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Período</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mês</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Ano</option>
            <option value="all">Tudo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Promoção</label>
          <select
            value={selectedPromotion}
            onChange={(e) => setSelectedPromotion(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Zap}
          label="Total de Matches"
          value={stats.totalMatches}
          trend={12}
          color="bg-blue-600"
        />
        <StatCard
          icon={Calendar}
          label="Total de Eventos"
          value={stats.totalEvents}
          trend={8}
          color="bg-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Qualidade Média"
          value={`${stats.averageMatchQuality}/10`}
          trend={5}
          color="bg-green-600"
        />
        <StatCard
          icon={Users}
          label="Lutadores Ativos"
          value={stats.totalWrestlers}
          trend={2}
          color="bg-yellow-600"
        />
        <StatCard
          icon={Trophy}
          label="Campeões Ativos"
          value={stats.activeChampions}
          trend={-3}
          color="bg-red-600"
        />
        <StatCard
          icon={Target}
          label="Lesionados"
          value={stats.injuredWrestlers}
          trend={-15}
          color="bg-orange-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Match Quality Trend */}
        <ChartContainer title="Qualidade de Matches por Dia">
          <BarChartSimple data={matchQualityData} />
        </ChartContainer>

        {/* Win Rate by Promotion */}
        <ChartContainer title="Taxa de Vitória por Promoção">
          <BarChartSimple data={winRateByPromotion} />
        </ChartContainer>

        {/* Match Type Distribution */}
        <ChartContainer title="Distribuição de Tipos de Match">
          <PieChartSimple data={matchTypeDistribution} />
        </ChartContainer>

        {/* Performance Metrics */}
        <ChartContainer title="Métricas de Desempenho">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Taxa de Conclusão</span>
                <span className="text-sm font-bold">94%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Satisfação do Usuário</span>
                <span className="text-sm font-bold">87%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Retenção de Dados</span>
                <span className="text-sm font-bold">99.8%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99.8%' }} />
              </div>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Wrestlers */}
        <ChartContainer title="Top 5 Lutadores">
          <div className="space-y-3">
            {[
              { name: 'Roman Reigns', rating: 98, matches: 156 },
              { name: 'The Rock', rating: 96, matches: 142 },
              { name: 'John Cena', rating: 95, matches: 245 },
              { name: 'Stone Cold', rating: 94, matches: 201 },
              { name: 'Brock Lesnar', rating: 92, matches: 178 },
            ].map((wrestler, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-bold text-muted-foreground">{idx + 1}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{wrestler.name}</p>
                    <p className="text-xs text-muted-foreground">{wrestler.matches} matches</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-yellow-500">{wrestler.rating}</span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Top Titles */}
        <ChartContainer title="Títulos Mais Disputados">
          <div className="space-y-3">
            {[
              { name: 'WWE Championship', defenses: 245, avgQuality: 8.7 },
              { name: 'AEW World Title', defenses: 198, avgQuality: 8.4 },
              { name: 'NJPW Heavyweight', defenses: 187, avgQuality: 8.6 },
              { name: 'TNA World Title', defenses: 156, avgQuality: 8.1 },
              { name: 'ROH World Title', defenses: 142, avgQuality: 7.9 },
            ].map((title, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{title.name}</p>
                  <p className="text-xs text-muted-foreground">{title.defenses} defesas</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-yellow-500">{title.avgQuality}</p>
                  <p className="text-xs text-muted-foreground">qualidade</p>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Export Options */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Exportar Dados</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            Exportar como CSV
          </button>
          <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
            Exportar como PDF
          </button>
          <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}
