import { Link } from 'wouter';
import { Play, History, Trophy, Crown, Zap, AlertCircle } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Play,
      label: 'Booking',
      description: 'Crie eventos e simule lutas',
      href: '/booking',
      color: 'bg-blue-900',
    },
    {
      icon: History,
      label: 'Histórico',
      description: 'Veja todos os eventos criados',
      href: '/history',
      color: 'bg-purple-900',
    },
    {
      icon: Trophy,
      label: 'Rankings',
      description: 'Veja o ranking dos lutadores',
      href: '/rankings',
      color: 'bg-yellow-900',
    },
    {
      icon: Crown,
      label: 'Títulos',
      description: 'Gerencie os títulos de campeão',
      href: '/titles',
      color: 'bg-red-900',
    },
    {
      icon: Zap,
      label: 'Auto Simulação',
      description: 'Simule múltiplos eventos automaticamente',
      href: '/auto-simulation',
      color: 'bg-green-900',
    },
    {
      icon: AlertCircle,
      label: 'Lesões',
      description: 'Gerencie lesões de lutadores',
      href: '/injuries',
      color: 'bg-orange-900',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            🎭 Pro Wrestling Sim
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Simulador profissional de wrestling para Windows
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <p className="text-sm text-slate-400">Versão</p>
              <p className="text-lg font-bold">2.0.0</p>
            </div>
            <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <p className="text-sm text-slate-400">Lutadores</p>
              <p className="text-lg font-bold">22+</p>
            </div>
            <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <p className="text-sm text-slate-400">Promoções</p>
              <p className="text-lg font-bold">5</p>
            </div>
            <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
              <p className="text-sm text-slate-400">Títulos</p>
              <p className="text-lg font-bold">10</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.href} href={feature.href}>
                <a
                  className={`${feature.color} border border-slate-700 rounded-lg p-6 hover:border-slate-500 transition-all hover:shadow-lg hover:shadow-slate-900/50 cursor-pointer group`}
                >
                  <Icon className="w-12 h-12 mb-4 text-slate-300 group-hover:text-white transition-colors" />
                  <h3 className="text-xl font-bold mb-2">{feature.label}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </a>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">📊 Estatísticas Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Eventos Criados</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Matches Simulados</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Lutadores Ativos</p>
              <p className="text-3xl font-bold">22</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Campeões</p>
              <p className="text-3xl font-bold">10</p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/booking">
            <a className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg">
              ▶️ Começar a Simular
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
