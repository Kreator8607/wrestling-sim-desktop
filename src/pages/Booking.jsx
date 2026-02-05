import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Plus, Trash2, Play } from 'lucide-react';

export default function Booking() {
  const [promotions, setPromotions] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [eventName, setEventName] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Carregar promoções e lutadores do banco de dados
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    // Placeholder - será implementado com IPC
    setPromotions([
      { id: 1, name: 'WWE' },
      { id: 2, name: 'AEW' },
      { id: 3, name: 'NJPW' },
      { id: 4, name: 'IMPACT' },
      { id: 5, name: 'ROH' },
    ]);
  };

  const handleCreateEvent = async () => {
    if (!eventName || !selectedPromotion) {
      alert('Preencha todos os campos');
      return;
    }

    // Placeholder - será implementado com IPC
    alert(`Evento "${eventName}" criado para ${selectedPromotion}`);
  };

  const addMatch = () => {
    setMatches([
      ...matches,
      {
        id: Date.now(),
        worker1: '',
        worker2: '',
        type: 'singles',
        title: '',
      },
    ]);
  };

  const removeMatch = (id) => {
    setMatches(matches.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📅 Booking de Eventos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Configuração */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>⚙️ Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Promoção</label>
                <Select
                  value={selectedPromotion}
                  onChange={(e) => setSelectedPromotion(e.target.value)}
                >
                  <option value="">Selecione uma promoção</option>
                  {promotions.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nome do Evento</label>
                <Input
                  placeholder="Ex: WrestleMania 42"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data</label>
                <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <Button
                onClick={handleCreateEvent}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                ✅ Criar Evento
              </Button>
            </CardContent>
          </Card>

          {/* Painel de Matches */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>🥊 Matches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {matches.length === 0 ? (
                <p className="text-slate-400">Nenhum match adicionado ainda</p>
              ) : (
                matches.map((match) => (
                  <div key={match.id} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Lutador 1</label>
                        <Select>
                          <option>Selecionar</option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Lutador 2</label>
                        <Select>
                          <option>Selecionar</option>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Tipo</label>
                        <Select>
                          <option>Singles</option>
                          <option>Tag Team</option>
                          <option>Trios</option>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Título</label>
                        <Select>
                          <option>Nenhum</option>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Play className="w-4 h-4 mr-2" />
                        Simular
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeMatch(match.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <Button
                onClick={addMatch}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Match
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
