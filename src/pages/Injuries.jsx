import React, { useState } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function Injuries() {
  const [injuries, setInjuries] = useState([
    { id: 1, wrestler: 'John Cena', injury: 'Shoulder Injury', daysOut: 14, status: 'Recovering' },
    { id: 2, wrestler: 'The Rock', injury: 'Back Strain', daysOut: 7, status: 'Recovering' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ wrestler: '', injury: '', daysOut: 7 });

  const addInjury = () => {
    if (formData.wrestler && formData.injury) {
      setInjuries([...injuries, { ...formData, id: Date.now(), status: 'Recovering' }]);
      setFormData({ wrestler: '', injury: '', daysOut: 7 });
      setShowForm(false);
    }
  };

  const removeInjury = (id) => {
    setInjuries(injuries.filter(i => i.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Injuries</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} /> Report Injury
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-4 rounded mb-6 border border-red-600">
          <input
            type="text"
            placeholder="Wrestler Name"
            value={formData.wrestler}
            onChange={(e) => setFormData({ ...formData, wrestler: e.target.value })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Injury Type"
            value={formData.injury}
            onChange={(e) => setFormData({ ...formData, injury: e.target.value })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
          />
          <input
            type="number"
            min="1"
            value={formData.daysOut}
            onChange={(e) => setFormData({ ...formData, daysOut: parseInt(e.target.value) })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
          />
          <button
            onClick={addInjury}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            Report Injury
          </button>
        </div>
      )}

      <div className="space-y-4">
        {injuries.map((injury) => (
          <div key={injury.id} className="bg-gray-800 border border-red-600 p-4 rounded flex justify-between items-start">
            <div className="flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-bold">{injury.wrestler}</h3>
                <p className="text-gray-400">{injury.injury}</p>
                <p className="text-sm text-yellow-400">Out for {injury.daysOut} days</p>
              </div>
            </div>
            <button
              onClick={() => removeInjury(injury.id)}
              className="bg-red-600 hover:bg-red-700 p-2 rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
