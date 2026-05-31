import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Event {
  id: number;
  client_name: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
  status: string;
}

interface Booking {
  id: number;
  client_name: string;
  total_amount: number;
  status: string;
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, eventsRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/api/clients`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/events`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (clientsRes.ok) {
          const data = await clientsRes.json();
          setClients(data.clients);
        }

        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events);
        }

        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
  const confirmedEvents = events.filter((e) => e.status === 'Confirmed').length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your weddings.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-blue-600 text-4xl">group</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{loading ? '...' : clients.length}</p>
            <p className="text-slate-500 text-sm">Total Clients</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-green-600 text-4xl">event</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{loading ? '...' : confirmedEvents}</p>
            <p className="text-slate-500 text-sm">Confirmed Events</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-amber-600 text-4xl">payments</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {loading ? '...' : `Rp ${totalRevenue.toLocaleString()}`}
            </p>
            <p className="text-slate-500 text-sm">Total Revenue</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-purple-600 text-4xl">book_online</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{loading ? '...' : bookings.length}</p>
            <p className="text-slate-500 text-sm">Total Bookings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Events</h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-slate-500">Loading events...</p>
              ) : events.length === 0 ? (
                <p className="text-slate-500">No events yet</p>
              ) : (
                events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {event.groom_name} & {event.bride_name}
                      </p>
                      <p className="text-sm text-slate-500">{event.client_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{new Date(event.event_date).toLocaleDateString()}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          event.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Bookings</h2>
            <div className="space-y-4">
              {loading ? (
                <p className="text-slate-500">Loading bookings...</p>
              ) : bookings.length === 0 ? (
                <p className="text-slate-500">No bookings yet</p>
              ) : (
                bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{booking.client_name}</p>
                      <p className="text-sm text-slate-500">Rp {booking.total_amount?.toLocaleString()}</p>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : booking.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
