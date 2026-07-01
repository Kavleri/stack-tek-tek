import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Client {
  id: number;
  name: string;
}

interface Event {
  id: number;
  client_id: number;
  groom_name: string;
  bride_name: string;
  event_date: string;
  location: string;
  theme: string;
  status: string;
  client_name: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    client_id: 0,
    groom_name: '',
    bride_name: '',
    event_date: '',
    location: '',
    theme: '',
    status: 'Pending',
  });
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [eventsRes, clientsRes] = await Promise.all([
        fetch(`${API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingEvent
        ? `${API_URL}/api/events/${editingEvent.id}`
        : `${API_URL}/api/events`;
      const method = editingEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
          client_id: 0,
          groom_name: '',
          bride_name: '',
          event_date: '',
          location: '',
          theme: '',
          status: 'Pending',
        });
        fetchData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await fetch(`${API_URL}/api/events/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-800">Events</h1>
            <p className="text-slate-500 mt-1">Manage your wedding events</p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(null);
              setFormData({
                client_id: 0,
                groom_name: '',
                bride_name: '',
                event_date: '',
                location: '',
                theme: '',
                status: 'Pending',
              });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-500">No events yet</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-serif text-slate-800">
                    {event.groom_name} & {event.bride_name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">person</span>
                    {event.client_name}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">event</span>
                    {new Date(event.event_date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">location_on</span>
                    {event.location}
                  </p>
                  {event.theme && (
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600">palette</span>
                      {event.theme}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setFormData(event);
                      setShowModal(true);
                    }}
                    className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 rounded-xl font-semibold hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-2xl font-serif text-slate-800 mb-6">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Groom Name</label>
                    <input
                      type="text"
                      value={formData.groom_name}
                      onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bride Name</label>
                    <input
                      type="text"
                      value={formData.bride_name}
                      onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
                  <input
                    type="text"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
