import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Package {
  id: number;
  package_name: string;
  price: number;
}

interface Event {
  id: number;
  invoice_number: string;
  client_name: string;
  client_phone: string;
  event_date: string;
  event_time: string;
  location_name: string;
  status: string;
  package_id: number;
  package_name: string;
  package_price: number;
}

interface Payment {
  id: number;
  event_id: number;
  payment_amount: number;
}

export default function Dashboard() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesRes, eventsRes, paymentsRes] = await Promise.all([
          fetch(`${API_URL}/api/packages`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/events`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/payments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (packagesRes.ok) {
          const data = await packagesRes.json();
          setPackages(data);
        }

        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data.events || []);
        }

        if (paymentsRes.ok) {
          const data = await paymentsRes.json();
          setPayments(data.payments || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Calculations
  const totalRevenue = payments.reduce((sum, p) => sum + (p.payment_amount || 0), 0);
  const confirmedEvents = events.filter((e) => e.status === 'confirmed').length;

  // Outstanding accounts logic (Daftar Piutang)
  const outstandingEvents = events
    .map(e => {
      const eventPayments = payments.filter(p => p.event_id === e.id);
      const totalPaid = eventPayments.reduce((sum, p) => sum + p.payment_amount, 0);
      const balance = e.package_price - totalPaid;
      return {
        ...e,
        total_paid: totalPaid,
        balance: balance > 0 ? balance : 0
      };
    })
    .filter(e => e.balance > 0 && e.status !== 'cancelled');

  const totalOutstanding = outstandingEvents.reduce((sum, e) => sum + e.balance, 0);

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Editorial Greeting Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-light text-primary tracking-wide">
              Overview <span className="font-normal font-serif">Dashboard</span>
            </h1>
            <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">
              Wedding Organizer Management Panel
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-on-surface-variant font-medium">Hari Ini</p>
            <p className="text-sm font-serif text-primary font-medium">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats Row with bold serif numbers and tonal separation (no borders) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-surface-container-low p-6 rounded-2xl transition-all hover:scale-[1.01] duration-300">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">inventory_2</span>
            <p className="text-3xl font-serif font-bold text-primary">
              {loading ? '...' : packages.length}
            </p>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mt-1">Total Paket</p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl transition-all hover:scale-[1.01] duration-300">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">event_available</span>
            <p className="text-3xl font-serif font-bold text-primary">
              {loading ? '...' : confirmedEvents}
            </p>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mt-1">Acara Konfirmasi</p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl transition-all hover:scale-[1.01] duration-300">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4">payments</span>
            <p className="text-2xl font-serif font-bold text-primary truncate">
              {loading ? '...' : `Rp ${totalRevenue.toLocaleString('id-ID')}`}
            </p>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mt-1">Total Pemasukan</p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl transition-all hover:scale-[1.01] duration-300">
            <span className="material-symbols-outlined text-error text-3xl mb-4">receipt_long</span>
            <p className="text-2xl font-serif font-bold text-error truncate">
              {loading ? '...' : `Rp ${totalOutstanding.toLocaleString('id-ID')}`}
            </p>
            <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mt-1">Piutang Klien</p>
          </div>
        </div>

        {/* Asymmetric Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Outstanding Accounts / Daftar Piutang (Takes 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-serif text-primary">Piutang Pembayaran Klien</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Daftar pemesanan yang belum lunas</p>
                </div>
                <span className="bg-error-container/40 text-on-error-container text-[11px] px-2.5 py-1 rounded-full font-bold uppercase">
                  {outstandingEvents.length} Acara
                </span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="text-sm text-on-surface-variant">Memuat data piutang...</p>
                ) : outstandingEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-secondary/30">verified_user</span>
                    <p className="text-sm text-on-surface-variant mt-2">Semua tagihan lunas terbayar.</p>
                  </div>
                ) : (
                  outstandingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:translate-x-0.5 duration-200"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-secondary font-semibold font-sans tracking-wide uppercase">
                          {evt.invoice_number}
                        </p>
                        <h4 className="font-serif font-medium text-primary text-base">
                          {evt.client_name}
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          Hari H: {new Date(evt.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs text-on-surface-variant font-medium">Sisa Pembayaran</p>
                        <p className="text-sm font-serif font-bold text-error mt-0.5">
                          Rp {evt.balance.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          Dari total Rp {evt.package_price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Recent Bookings & Upcoming Schedules (Takes 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <h2 className="text-xl font-serif text-primary mb-6">Jadwal Acara Terkini</h2>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-sm text-on-surface-variant">Memuat data acara...</p>
                ) : events.length === 0 ? (
                  <p className="text-sm text-on-surface-variant text-center py-6">Belum ada pesanan acara.</p>
                ) : (
                  events.slice(0, 5).map((evt) => (
                    <div
                      key={evt.id}
                      className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-serif font-medium text-primary text-sm">
                          {evt.client_name}
                        </h4>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {new Date(evt.event_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} - {evt.event_time.substring(0, 5)}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate max-w-[150px] mt-0.5">
                          {evt.location_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${evt.status === 'confirmed'
                              ? 'bg-secondary-container text-on-secondary-fixed-variant'
                              : evt.status === 'completed'
                                ? 'bg-primary-container text-on-primary-fixed-variant'
                                : evt.status === 'cancelled'
                                  ? 'bg-error-container text-on-error-container'
                                  : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                            }`}
                        >
                          {evt.status === 'confirmed' ? 'Dikonfirmasi' : evt.status === 'completed' ? 'Selesai' : evt.status === 'cancelled' ? 'Batal' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
