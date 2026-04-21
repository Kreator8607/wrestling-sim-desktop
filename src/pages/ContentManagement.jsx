import { useState } from 'react';
import { Upload, Download, RefreshCw, Users, Building2, Trophy, Database } from 'lucide-react';

export default function ContentManagement() {
  const [contentStats, setContentStats] = useState({
    wrestlers: 5000,
    promotions: 100,
    titles: 100,
    lastUpdate: '2024-03-31',
    updateAvailable: true,
  });

  const [updateProgress, setUpdateProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateContent = async () => {
    setIsUpdating(true);
    
    // Simulate update process
    for (let i = 0; i <= 100; i += 10) {
      setUpdateProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsUpdating(false);
    setUpdateProgress(0);
    alert('Conteúdo atualizado com sucesso!');
  };

  const handleImportData = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        alert(`Importando ${type}...`);
        // Handle file import
      }
    };
    input.click();
  };

  const ContentCard = ({ icon: Icon, title, count, description }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <span className="text-2xl font-bold text-primary">{count}</span>
      </div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Gerenciamento de Conteúdo</h1>
        <p className="text-muted-foreground">Atualize e importe dados de lutadores, promoções e títulos</p>
      </div>

      {/* Content Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ContentCard
          icon={Users}
          title="Lutadores"
          count={contentStats.wrestlers}
          description="Lutadores cadastrados no sistema"
        />
        <ContentCard
          icon={Building2}
          title="Promoções"
          count={contentStats.promotions}
          description="Promoções de wrestling"
        />
        <ContentCard
          icon={Trophy}
          title="Títulos"
          count={contentStats.titles}
          description="Títulos de campeonato"
        />
        <ContentCard
          icon={Database}
          title="Última Atualização"
          count="31/03"
          description="Data da última atualização"
        />
      </div>

      {/* Update Section */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Atualizar Conteúdo</h3>
        
        {contentStats.updateAvailable && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-yellow-600">
              ⚠️ Nova versão de conteúdo disponível! Atualize para obter 500+ novos lutadores e 50+ novas promoções.
            </p>
          </div>
        )}

        {isUpdating && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Atualizando...</span>
              <span className="text-sm font-bold">{updateProgress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${updateProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpdateContent}
          disabled={isUpdating}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} />
          {isUpdating ? 'Atualizando...' : 'Atualizar Conteúdo Agora'}
        </button>
      </div>

      {/* Import/Export Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Dados
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => handleImportData('Lutadores')}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Importar Lutadores
            </button>
            <button
              onClick={() => handleImportData('Promoções')}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Importar Promoções
            </button>
            <button
              onClick={() => handleImportData('Títulos')}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Importar Títulos
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Formatos aceitos: JSON, CSV. Máximo 10MB por arquivo.
          </p>
        </div>

        {/* Export */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Dados
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Exportar Lutadores
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
              Exportar Promoções
            </button>
            <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Exportar Títulos
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Exporte seus dados em JSON para backup ou compartilhamento.
          </p>
        </div>
      </div>

      {/* Update History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Histórico de Atualizações</h3>
        <div className="space-y-3">
          {[
            { date: '2024-03-31', version: 'v3.0.0', changes: '500+ novos lutadores, 50+ novas promoções, 40+ novos títulos' },
            { date: '2024-03-15', version: 'v2.2.0', changes: 'Otimizações de performance, novos atributos' },
            { date: '2024-02-28', version: 'v2.1.0', changes: 'Interface redesenhada, novo sistema de ranking' },
            { date: '2024-02-01', version: 'v2.0.0', changes: 'Lançamento da versão 2.0' },
          ].map((update, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 bg-secondary rounded-lg">
              <div>
                <p className="font-bold">{update.version}</p>
                <p className="text-sm text-muted-foreground">{update.changes}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{update.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-600/20 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Fontes de Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-medium mb-2">Lutadores</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• WWE Official Database</li>
              <li>• AEW Roster</li>
              <li>• NJPW Records</li>
              <li>• Cagematch.net</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Promoções & Títulos</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Wrestling Observer</li>
              <li>• Wrestlemania Records</li>
              <li>• Wikipedia Wrestling</li>
              <li>• Official Promotions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
