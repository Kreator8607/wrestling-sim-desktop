import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

export default function AutoSimulation() {
  const [promotions, setPromotions] = useState([]);
  const [config, setConfig] = useState({
    promotionId: 1,
    numberOfEvents: 5,
    matchesPerEvent: 8,
    eventInterval: 1000,
    eventNamePrefix: 'Auto Event',
  });
  const [progress, setProgress] = useState({
    status: 'idle',
    currentEvent: 0,
    totalEvents: 0,
    currentMatch: 0,
    totalMatches: 0,
    eventsCreated: 0,
    matchesSimulated: 0,
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setPromotions([
      { id: 1, name: 'WWE' },
      { id: 2, name: 'AEW' },
      { id: 3, name: 'NJPW' },
      { id: 4, name: 'IMPACT' },
      { id: 5, name: 'ROH' },
    ]);
  };

  const handleStartSimulation = async () => {
    setProgress({
      status: 'running',
      currentEvent: 1,
      totalEvents: config.numberOfEvents,
      currentMatch: 0,
      totalMatches: config.matchesPerEvent,
      eventsCreated: 0,
      matchesSimulated: 0,
    });

    // Simulação placeholder
    for (let i = 1; i <= config.numberOfEvents; i++) {
      setProgress(p => ({
        ...p,
        currentEvent: i,
        eventsCreated: i,
      }));

      for (let j = 1; j <= config.matchesPerEvent; j++) {
        setProgress(p => ({
          ...p,
          currentMatch: j,
          matchesSimulated: p.matchesSimulated + 1,
        }));

        await new Promise(resolve => setTimeout(resolve, config.eventInterval / config.matchesPerEvent));
      }

      await new Promise(resolve => setTimeout(resolve, config.eventInterval));
    }

    setProgress(p => ({
      ...p,
      status: 'completed',
    }));
  };

  const handlePause = () => {
    setProgress(p => ({
      ...p,
      status: p.status === 'running' ? 'paused' : 'running',
    }));
  };

  const handleReset = () => {
    setProgress({
      status: 'idle',
      currentEvent: 0,
      totalEvents: 0,
      currentMatch: 0,
      totalMatches: 0,
      eventsCreated: 0,
      matchesSimulated: 0,
    });
  };

  const getProgressPercentage = () => {
    if (progress.totalEvents === 0) return 0;
    return Math.round((progress.eventsCreated / progress.totalEvents) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">🤖 Simulação Automática de Eventos</h1>
        <p className="text-slate-400 mb-8">Configure e execute simulações de múltiplos eventos em sequência</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>⚙️ Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Promoção</label>
                <Select
                  value={config.promotionId}
                  onChange={(e) => setConfig({ ...config, promotionId: parseInt(e.target.value) })}
                  disabled={progress.status === 'running'}
                >
                  {promotions.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Número de Eventos</label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={config.numberOfEvents}
                  onChange={(e) => setConfig({ ...config, numberOfEvents: parseInt(e.target.value) })}
                  disabled={progress.status === 'running'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Matches por Evento</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={config.matchesPerEvent}
                  onChange={(e) => setConfig({ ...config, matchesPerEvent: parseInt(e.target.value) })}
                  disabled={progress.status === 'running'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Intervalo (ms)</label>
                <Input
                  type="number"
                  min="100"
                  max="5000"
                  step="100"
                  value={config.eventInterval}
                  onChange={(e) => setConfig({ ...config, eventInterval: parseInt(e.target.value) })}
                  disabled={progress.status === 'running'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prefixo do Nome</label>
                <Input
                  type="text"
                  value={config.eventNamePrefix}
                  onChange={(e) => setConfig({ ...config, eventNamePrefix: e.target.value })}
                  disabled={progress.status === 'running'}
                  placeholder="Ex: Auto Event"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <Button
                  onClick={handleStartSimulation}
                  disabled={progress.status === 'running'}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Simulação
                </Button>

                {progress.status === 'running' && (
                  <Button
                    onClick={handlePause}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                )}

                {progress.status !== 'idle' && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Resetar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>📊 Progresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Card */}
              <div className="bg-slate-900 border-2 border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {progress.status === 'running' && (
                      <Zap className="w-6 h-6 text-blue-400 animate-spin" />
                    )}
                    <div>
                      <p className="font-bold text-lg capitalize">
                        {progress.status === 'idle' ? 'Pronto' : progress.status}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-800 px-3 py-1 rounded">
                    <p className="font-bold">{getProgressPercentage()}%</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">Eventos</span>
                  <span className="text-sm font-bold">{progress.eventsCreated}/{progress.totalEvents}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded p-4">
                  <p className="text-sm text-slate-400 mb-1">Evento Atual</p>
                  <p className="text-2xl font-bold">{progress.currentEvent}/{progress.totalEvents}</p>
                </div>
                <div className="bg-slate-900 rounded p-4">
                  <p className="text-sm text-slate-400 mb-1">Match Atual</p>
                  <p className="text-2xl font-bold">{progress.currentMatch}/{progress.totalMatches}</p>
                </div>
                <div className="bg-slate-900 rounded p-4">
                  <p className="text-sm text-slate-400 mb-1">Total de Matches</p>
                  <p className="text-2xl font-bold text-green-400">{progress.matchesSimulated}</p>
                </div>
                <div className="bg-slate-900 rounded p-4">
                  <p className="text-sm text-slate-400 mb-1">Taxa de Conclusão</p>
                  <p className="text-2xl font-bold text-blue-400">{getProgressPercentage()}%</p>
                </div>
              </div>

              {/* Summary */}
              {progress.status === 'completed' && (
                <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                  <p className="font-bold text-green-300">✅ Simulação Concluída com Sucesso!</p>
                  <p className="text-sm text-green-200 mt-2">
                    {config.numberOfEvents} eventos criados com {progress.matchesSimulated} matches simulados.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
