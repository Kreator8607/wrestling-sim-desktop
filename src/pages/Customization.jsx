import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, Zap, Heart, Power } from 'lucide-react';

export default function Customization() {
  const [customWrestlers, setCustomWrestlers] = useState([
    {
      id: 1,
      name: 'Custom Wrestler 1',
      promotion: 'Independente',
      attributes: {
        wrestlingSkill: 75,
        entertainment: 80,
        starPower: 70,
        intimidation: 65,
        sexAppeal: 60,
      },
      specialMoves: ['Finisher 1', 'Signature Move'],
      createdDate: '2024-03-01',
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    promotion: 'Independente',
    attributes: {
      wrestlingSkill: 50,
      entertainment: 50,
      starPower: 50,
      intimidation: 50,
      sexAppeal: 50,
    },
    specialMoves: [],
  });

  const promotions = [
    'Independente',
    'WWE',
    'AEW',
    'NJPW',
    'TNA',
    'ROH',
    'CMLL',
    'NJPW',
  ];

  const handleCreateNew = () => {
    setFormData({
      name: '',
      promotion: 'Independente',
      attributes: {
        wrestlingSkill: 50,
        entertainment: 50,
        starPower: 50,
        intimidation: 50,
        sexAppeal: 50,
      },
      specialMoves: [],
    });
    setEditingId(null);
    setIsCreating(true);
  };

  const handleEdit = (wrestler) => {
    setFormData(wrestler);
    setEditingId(wrestler.id);
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Nome do lutador é obrigatório');
      return;
    }

    if (editingId) {
      setCustomWrestlers(
        customWrestlers.map(w =>
          w.id === editingId
            ? { ...formData, id: editingId }
            : w
        )
      );
    } else {
      setCustomWrestlers([
        ...customWrestlers,
        {
          ...formData,
          id: Math.max(...customWrestlers.map(w => w.id), 0) + 1,
          createdDate: new Date().toISOString().split('T')[0],
        },
      ]);
    }

    setIsCreating(false);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja deletar este lutador?')) {
      setCustomWrestlers(customWrestlers.filter(w => w.id !== id));
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const handleAttributeChange = (attr, value) => {
    setFormData({
      ...formData,
      attributes: {
        ...formData.attributes,
        [attr]: parseInt(value),
      },
    });
  };

  const getOverallRating = (attrs) => {
    const values = Object.values(attrs);
    return Math.round(values.reduce((a, b) => a + b) / values.length);
  };

  const AttributeSlider = ({ label, attr, value, onChange }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-bold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(attr, e.target.value)}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  const WrestlerCard = ({ wrestler }) => (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{wrestler.name}</h3>
          <p className="text-xs text-muted-foreground">{wrestler.promotion}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-500">
            {getOverallRating(wrestler.attributes)}
          </div>
          <div className="text-xs text-muted-foreground">Rating</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Power className="w-3 h-3 text-blue-500" />
          <span>Wrestling: {wrestler.attributes.wrestlingSkill}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span>Entertainment: {wrestler.attributes.entertainment}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-3 h-3 text-red-500" />
          <span>Star Power: {wrestler.attributes.starPower}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3 text-purple-500" />
          <span>Intimidation: {wrestler.attributes.intimidation}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(wrestler)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => handleDelete(wrestler.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Deletar
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Criado em {wrestler.createdDate}
      </p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Customização de Lutadores</h1>
          <p className="text-muted-foreground">Crie e edite seus próprios lutadores</p>
        </div>
        {!isCreating && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Lutador
          </button>
        )}
      </div>

      {/* Form */}
      {isCreating && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {editingId ? 'Editar Lutador' : 'Criar Novo Lutador'}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Lutador</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Digite o nome"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Promoção</label>
                <select
                  value={formData.promotion}
                  onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {promotions.map((promo) => (
                    <option key={promo} value={promo}>
                      {promo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Rating Geral</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {getOverallRating(formData.attributes)}
                </p>
              </div>
            </div>

            {/* Attributes */}
            <div className="space-y-4">
              <AttributeSlider
                label="Wrestling Skill"
                attr="wrestlingSkill"
                value={formData.attributes.wrestlingSkill}
                onChange={handleAttributeChange}
              />
              <AttributeSlider
                label="Entertainment"
                attr="entertainment"
                value={formData.attributes.entertainment}
                onChange={handleAttributeChange}
              />
              <AttributeSlider
                label="Star Power"
                attr="starPower"
                value={formData.attributes.starPower}
                onChange={handleAttributeChange}
              />
              <AttributeSlider
                label="Intimidation"
                attr="intimidation"
                value={formData.attributes.intimidation}
                onChange={handleAttributeChange}
              />
              <AttributeSlider
                label="Sex Appeal"
                attr="sexAppeal"
                value={formData.attributes.sexAppeal}
                onChange={handleAttributeChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvar Lutador
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg font-medium transition-colors"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Wrestlers Grid */}
      {!isCreating && (
        <div>
          <h2 className="text-xl font-bold mb-4">Meus Lutadores Customizados ({customWrestlers.length})</h2>
          {customWrestlers.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-lg">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">Nenhum lutador customizado ainda</p>
              <button
                onClick={handleCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Criar Primeiro Lutador
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customWrestlers.map((wrestler) => (
                <WrestlerCard key={wrestler.id} wrestler={wrestler} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
