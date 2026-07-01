import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Client {
  id: number;
  name: string;
}

interface Package {
  id: number;
  name: string;
  price: number;
}

interface Event {
  id: number;
  groom_name: string;
  bride_name: string;
}

interface Booking {
  id: number;
  client_id: number;
  event_id: number;
  package_id: number;
  total_amount: number;
  status: string;
  notes: string;
  client_name: string;
  package_name: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({
    client_id: 0,
    event_id: 0,
    package_id: 0,
    total_amount: 0,
    status: 'Pending',
    notes: '',
  });
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [bookingsRes, clientsRes, packagesRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/packages`),
        fetch(`${API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings || []);
      }
      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data.clients || []);
      }
      if (packagesRes.ok) {
        const data = await packagesRes.json();
        setPackages(Array.isArray(data) ? data : []);
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
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
      const url = editingBooking
        ? `${API_URL}/api/bookings/${editingBooking.id}`
        : `${API_URL}/api/bookings`;
      const method = editingBooking ? 'PUT' : 'POST';

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
        setEditingBooking(null);
        setFormData({
          client_id: 0,
          event_id: 0,
          package_id: 0,
          total_amount: 0,
          status: 'Pending',
          notes: '',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save booking:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await fetch(`${API_URL}/api/bookings/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    }
  };

  const handlePackageChange = (packageId: number) => {
    const pkg = packages.find((p) => p.id === packageId);
    setFormData({
      ...formData,
      package_id: packageId,
      total_amount: pkg?.price || 0,
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-slate-800">Bookings</h1>
            <p className="text-slate-500 mt-1">Manage your wedding bookings</p>
          </div>
          <button
            onClick={() => {
              setEditingBooking(null);
              setFormData({
                client_id: 0,
                event_id: 0,
                package_id: 0,
                total_amount: 0,
                status: 'Pending',
                notes: '',
              });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add Booking
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Event</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Loading bookings...
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">
                          {booking.groom_name} & {booking.bride_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{booking.client_name}</td>
                      <td className="px-6 py-4 text-slate-600">{booking.package_name}</td>
                      <td className="px-6 py-4 text-slate-600">
                        Rp {booking.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'Confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingBooking(booking);
                              setFormData(booking);
                              setShowModal(true);
                            }}
                            className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-2xl font-serif text-slate-800 mb-6">
                {editingBooking ? 'Edit Booking' : 'Add New Booking'}
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Event</label>
                  <select
                    value={formData.event_id}
                    onChange={(e) => setFormData({ ...formData, event_id: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.groom_name} & {event.bride_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Package</label>
                  <select
                    value={formData.package_id}
                    onChange={(e) => handlePackageChange(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Package</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - Rp {pkg.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount (Rp)</label>
                  <input
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
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
