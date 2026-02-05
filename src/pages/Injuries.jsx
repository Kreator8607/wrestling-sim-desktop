import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { AlertCircle, Trash2 } from 'lucide-react';

export default function Injuries() {
  const [injuries, setInjuries] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');

  useEffect(() => {
    loadWorkers();
    loadInjuries();
  }, []);

  const loadWorkers = async () => {
    setWorkers([
      { id: 1, name: 'John Cena' },
      { id: 2, name: 'The Rock' },
      { id: 3, name: 'Roman Reigns' },
      { id: 4, name: 'Seth Rollins' },
      { id: 5, name: 'The Undertaker' },
    ]);
  };

  const loadInjuries = async () => {
    setInjuries([
      {
        id: 1,
        worker: 'John Cena',
        type: 'Lesão no Pescoço',
        severity: 75,
        recoveryWeeks: 4,
        weeksRemaining: 2,
      },
      {
        id: 2,
        worker: 'Roman Reigns',
        type: 'Lesão nas Costas',
        severity: 50,
        recoveryWeeks: 6,
        weeksRemaining: 4,
      },
    ]);
  };

  const removeInjury = (id) => {
    setInjuries(injuries.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">⚠️ Gerenciamento de Lesões</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Adicionar Lesão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Lutador</label>
                <Select
                  value={selectedWorker}
                  onChange={(e) => setSelectedWorker(e.target.value)}
                >
                  <option value="">Selecionar</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </Select>
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700">
                Adicionar Lesão
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Lesões Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              {injuries.length === 0 ? (
                <p className="text-slate-400">Nenhuma lesão ativa</p>
              ) : (
                <div className="space-y-3">
                  {injuries.map((injury) => (
                    <div key={injury.id} className="bg-slate-900 border border-red-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          <AlertCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-bold">{injury.worker}</p>
                            <p className="text-sm text-slate-400">{injury.type}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeInjury(injury.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-slate-400">Severidade</p>
                          <p className="font-bold">{injury.severity}%</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Semanas Totais</p>
                          <p className="font-bold">{injury.recoveryWeeks}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Restante</p>
                          <p className="font-bold text-yellow-400">{injury.weeksRemaining}</p>
                        </div>
                      </div>

                      <div className="mt-3 bg-slate-800 rounded h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full transition-all"
                          style={{
                            width: `${((injury.recoveryWeeks - injury.weeksRemaining) / injury.recoveryWeeks) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
