import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Package {
  id: number;
  package_name: string;
}

interface Event {
  id: number;
  invoice_number: string;
  client_name: string;
  client_phone: string;
  event_date: string;
  event_time: string;
  location_name: string;
  location_address: string;
  google_maps_link: string;
  package_id: number;
  package_name: string;
  package_price: number;
  status: string;
  notes_for_field_staff: string;
  created_at: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState<Partial<Event>>({
    client_name: '',
    client_phone: '',
    event_date: '',
    event_time: '08:00',
    location_name: '',
    location_address: '',
    google_maps_link: '',
    package_id: 0,
    status: 'pending',
    notes_for_field_staff: '',
  });

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [eventsRes, packagesRes] = await Promise.all([
        fetch(`${API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/packages`),
      ]);

      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
      if (packagesRes.ok) {
        const data = await packagesRes.json();
        setPackages(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch events data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
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
        body: JSON.stringify({
          ...formData,
          package_id: formData.package_id ? Number(formData.package_id) : null
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingEvent(null);
        setFormData({
          client_name: '',
          client_phone: '',
          event_date: '',
          event_time: '08:00',
          location_name: '',
          location_address: '',
          google_maps_link: '',
          package_id: 0,
          status: 'pending',
          notes_for_field_staff: '',
        });
        fetchData();
      } else {
        const errorData = await response.json();
        setFormError(errorData.message || 'Gagal menyimpan pemesanan acara.');
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      setFormError('Koneksi internet bermasalah.');
    }
  };

  const handleEdit = (evt: Event) => {
    setEditingEvent(evt);
    setFormData(evt);
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data acara & semua catatan pembayarannya?')) {
      try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  // Calendar Helper Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const startDayOffset = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // Sunday is 0

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-light text-primary tracking-wide">
              Events & <span className="font-normal font-serif">Scheduling</span>
            </h1>
            <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">
              Jadwal Acara & Checklist Operasional Lapangan
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setFormData({
                  client_name: '',
                  client_phone: '',
                  event_date: '',
                  event_time: '08:00',
                  location_name: '',
                  location_address: '',
                  google_maps_link: '',
                  package_id: 0,
                  status: 'pending',
                  notes_for_field_staff: '',
                });
                setFormError('');
                setShowModal(true);
              }}
              className="bg-primary text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Buat Pemesanan Acara
            </button>
          </div>
        </div>

        {/* 2 Grid Columns: Interactive Calendar & Event Lists */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Calendar Section (7 Cols) */}
          <div className="xl:col-span-7 bg-surface-container-low p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-medium text-primary">
                {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="w-9 h-9 bg-surface-container-lowest text-primary rounded-xl flex items-center justify-center hover:bg-secondary-container transition-all duration-300"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-9 h-9 bg-surface-container-lowest text-primary rounded-xl flex items-center justify-center hover:bg-secondary-container transition-all duration-300"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              <div>Min</div>
              <div>Sen</div>
              <div>Sel</div>
              <div>Rab</div>
              <div>Kam</div>
              <div>Jum</div>
              <div>Sab</div>
            </div>

            {/* Calendar Grid Body */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day offset spacers */}
              {Array.from({ length: startDayOffset }).map((_, idx) => (
                <div key={`spacer-${idx}`} className="aspect-square bg-transparent"></div>
              ))}

              {/* Day cells */}
              {daysInMonth.map((day, idx) => {
                const formattedDate = day.toISOString().substring(0, 10);
                const dayEvents = events.filter(e => e.event_date === formattedDate);
                const isToday = new Date().toISOString().substring(0, 10) === formattedDate;

                return (
                  <div
                    key={`day-${idx}`}
                    className={`aspect-square p-2 rounded-xl flex flex-col justify-between transition-all duration-200 relative group border border-outline-variant/10 ${
                      isToday 
                        ? 'bg-secondary-container text-on-secondary-fixed-variant' 
                        : 'bg-surface-container-lowest text-on-surface'
                    }`}
                  >
                    <span className="text-xs font-semibold font-serif">{day.getDate()}</span>
                    
                    {/* Event indicators */}
                    <div className="flex flex-wrap gap-1 mt-1 justify-end">
                      {dayEvents.map(evt => (
                        <div
                          key={evt.id}
                          className={`w-2.5 h-2.5 rounded-full cursor-help ${
                            evt.status === 'confirmed'
                              ? 'bg-secondary'
                              : evt.status === 'completed'
                              ? 'bg-primary'
                              : evt.status === 'cancelled'
                              ? 'bg-outline'
                              : 'bg-tertiary-fixed-dim'
                          }`}
                          title={`${evt.client_name} (${evt.status})`}
                        />
                      ))}
                    </div>

                    {/* Popover on Hover */}
                    {dayEvents.length > 0 && (
                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 bg-primary text-white p-3 rounded-xl shadow-xl hidden group-hover:block z-30 pointer-events-none text-left">
                        <p className="text-[9px] uppercase tracking-wider text-secondary-fixed font-semibold">Scheduled Booking</p>
                        {dayEvents.map(evt => (
                          <div key={evt.id} className="mt-1.5 border-t border-white/10 pt-1.5 first:mt-0 first:border-0 first:pt-0">
                            <p className="text-xs font-serif font-medium truncate">{evt.client_name}</p>
                            <p className="text-[10px] text-white/70 mt-0.5 truncate">{evt.location_name}</p>
                            <p className="text-[9px] italic text-white/50">{evt.status}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events List Section (5 Cols) */}
          <div className="xl:col-span-5 space-y-6">
            <h2 className="text-xl font-serif font-medium text-primary">Daftar Acara</h2>
            
            {loading ? (
              <p className="text-sm text-on-surface-variant">Memuat data acara...</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">Belum ada pemesanan terdaftar.</p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {events.map(evt => (
                  <div
                    key={evt.id}
                    className="bg-surface-container-low p-5 rounded-2xl space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-secondary font-semibold font-sans tracking-wide uppercase">
                          {evt.invoice_number}
                        </p>
                        <h4 className="font-serif font-medium text-primary text-lg mt-0.5">
                          {evt.client_name}
                        </h4>
                        <p className="text-xs text-on-surface-variant">HP: {evt.client_phone}</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                          evt.status === 'confirmed'
                            ? 'bg-secondary-container text-on-secondary-fixed-variant'
                            : evt.status === 'completed'
                            ? 'bg-primary-container text-on-primary-fixed-variant'
                            : evt.status === 'cancelled'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 text-on-surface-variant font-sans border-t border-outline-variant/10 pt-3">
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
                        {new Date(evt.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                        {evt.event_time.substring(0, 5)} WIB
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                        {evt.location_name}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
                        {evt.package_name}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-outline-variant/10">
                      <a
                        href={`/admin/events/${evt.id}/work-order`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 bg-primary text-white py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-center hover:opacity-95 transition-all duration-300"
                      >
                        Print WO
                      </a>
                      <button
                        onClick={() => handleEdit(evt)}
                        className="bg-surface-container-lowest text-primary px-3 py-2 rounded-xl text-xs font-semibold uppercase hover:bg-secondary-container transition-all duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="bg-error-container/40 text-on-error-container px-3 py-2 rounded-xl text-xs font-semibold uppercase hover:bg-error-container transition-all duration-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0_12px_40px_rgba(11,37,69,0.06)] border border-outline-variant/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-primary mb-6">
                {editingEvent ? 'Edit Detail Acara' : 'Buat Pemesanan Acara Baru'}
              </h2>

              {formError && (
                <div className="bg-error-container/40 text-on-error-container p-4 rounded-xl text-xs font-sans font-medium flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Klien</label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                      placeholder="Contoh: Budi Prasetyo"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nomor HP Klien</label>
                    <input
                      type="text"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                      placeholder="Contoh: 0812345678"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tanggal Acara</label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Waktu Acara (WIB)</label>
                    <input
                      type="time"
                      value={formData.event_time}
                      onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pilih Paket Wedding</label>
                    <select
                      value={formData.package_id || ''}
                      onChange={(e) => setFormData({ ...formData, package_id: e.target.value ? Number(e.target.value) : 0 })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                      required
                    >
                      <option value="">-- Pilih Paket --</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.package_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status Pemesanan</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Gedung / Lokasi</label>
                  <input
                    type="text"
                    value={formData.location_name}
                    onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Contoh: Grand Ballroom Hotel Madinah"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Alamat Lengkap Lokasi</label>
                  <textarea
                    value={formData.location_address}
                    onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans resize-none"
                    placeholder="Masukkan alamat lengkap lokasi"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Link Google Maps</label>
                  <input
                    type="url"
                    value={formData.google_maps_link}
                    onChange={(e) => setFormData({ ...formData, google_maps_link: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Catatan Lapangan (Work Order Details)</label>
                  <textarea
                    value={formData.notes_for_field_staff}
                    onChange={(e) => setFormData({ ...formData, notes_for_field_staff: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans resize-none"
                    placeholder="Tulis instruksi khusus untuk tim dekorasi, katering, sound system, dll..."
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-surface-container-low text-on-surface-variant py-3 rounded-xl text-xs font-semibold uppercase hover:bg-surface-container-high transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-semibold uppercase hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10"
                  >
                    Simpan Acara
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
