import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Booking() {
  const [events, setEvents] = useState([
    { id: 1, name: 'WrestleMania 40', date: '2026-04-07', matches: 12, status: 'Completed' },
    { id: 2, name: 'Royal Rumble 2026', date: '2026-01-26', matches: 8, status: 'Completed' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', date: '', matches: 1 });

  const addEvent = () => {
    if (formData.name && formData.date) {
      setEvents([...events, { ...formData, id: Date.now(), status: 'Scheduled' }]);
      setFormData({ name: '', date: '', matches: 1 });
      setShowForm(false);
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} /> New Event
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 p-4 rounded mb-6">
          <input
            type="text"
            placeholder="Event Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
          />
          <input
            type="number"
            min="1"
            value={formData.matches}
            onChange={(e) => setFormData({ ...formData, matches: parseInt(e.target.value) })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
          />
          <button
            onClick={addEvent}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            Create Event
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-gray-800 border border-red-600 p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{event.name}</h3>
                <p className="text-gray-400">Date: {event.date}</p>
                <p className="text-gray-400">Matches: {event.matches}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
                  event.status === 'Completed' ? 'bg-green-600' : 'bg-yellow-600'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded">
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="bg-red-600 hover:bg-red-700 p-2 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
