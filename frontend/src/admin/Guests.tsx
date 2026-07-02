import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Event {
  id: number;
  invoice_number: string;
  client_name: string;
}

interface Guest {
  id: number;
  event_id: number;
  guest_name: string;
  guest_phone: string;
  invitation_slug: string;
  is_attended: boolean;
  client_name?: string;
  event_date?: string;
  invoice_number?: string;
}

export default function Guests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [formData, setFormData] = useState<Partial<Guest>>({
    event_id: 0,
    guest_name: '',
    guest_phone: '',
    invitation_slug: '',
    is_attended: false,
  });

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [guestsRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}/api/guests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (guestsRes.ok) {
        const data = await guestsRes.json();
        setGuests(data.guests || []);
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch guests data:', error);
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
      const url = editingGuest
        ? `${API_URL}/api/guests/${editingGuest.id}`
        : `${API_URL}/api/guests`;
      const method = editingGuest ? 'PUT' : 'POST';

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
        setEditingGuest(null);
        setFormData({
          event_id: selectedEventId !== 'all' ? selectedEventId : (events.length > 0 ? events[0].id : 0),
          guest_name: '',
          guest_phone: '',
          invitation_slug: '',
          is_attended: false,
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save guest:', error);
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData(guest);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data tamu undangan ini?')) {
      try {
        const response = await fetch(`${API_URL}/api/guests/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete guest:', error);
      }
    }
  };

  // Quick door attendance checker check-in
  const toggleAttendance = async (guest: Guest) => {
    try {
      const response = await fetch(`${API_URL}/api/guests/${guest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_attended: !guest.is_attended
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to toggle attendance:', error);
    }
  };

  // Copy link to clipboard helper
  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/invitation/${slug}`;
    navigator.clipboard.writeText(link);
    alert('Tautan undangan berhasil disalin!');
  };

  // WhatsApp share redirect handler
  const handleShareWhatsApp = (guest: Guest) => {
    const link = `${window.location.origin}/invitation/${guest.invitation_slug}`;
    const message = `Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu/Saudara/i *${guest.guest_name}*,

Tanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami. Detail informasi acara dan konfirmasi kehadiran dapat diakses melalui tautan undangan digital berikut:

${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Jazakumullah Khairan.
Wassalamu'alaikum Wr. Wb.`;

    const encodedText = encodeURIComponent(message);
    const cleanPhone = guest.guest_phone.replace(/\D/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '62' + cleanPhone.substring(1);
    }
    
    window.open(`https://wa.me/${formattedPhone}?text=${encodedText}`, '_blank');
  };

  // Filter guests
  const filteredGuests = selectedEventId === 'all'
    ? guests
    : guests.filter(g => g.event_id === Number(selectedEventId));

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-light text-primary tracking-wide">
              Digital <span className="font-normal font-serif">Guest Book</span>
            </h1>
            <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">
              Buku Tamu Digital & Pengiriman Undangan WhatsApp
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditingGuest(null);
                setFormData({
                  event_id: selectedEventId !== 'all' ? selectedEventId : (events.length > 0 ? events[0].id : 0),
                  guest_name: '',
                  guest_phone: '',
                  invitation_slug: '',
                  is_attended: false,
                });
                setShowModal(true);
              }}
              className="bg-primary text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              Tambah Tamu Undangan
            </button>
          </div>
        </div>

        {/* Filter controls (no lines, Sanctuary styled) */}
        <div className="mb-8 bg-surface-container-low p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-xs space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Saring Berdasarkan Acara</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-surface-container-lowest text-on-surface rounded-xl border border-transparent outline-none text-xs font-semibold uppercase tracking-wider"
            >
              <option value="all">Semua Acara</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.client_name} ({evt.invoice_number})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 items-center">
            <div className="text-right">
              <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Hadir / Total Tamu</p>
              <p className="text-xl font-serif font-bold text-primary mt-0.5">
                {filteredGuests.filter(g => g.is_attended).length} <span className="text-xs text-on-surface-variant font-normal font-sans">dari</span> {filteredGuests.length}
              </p>
            </div>
          </div>
        </div>

        {/* Guestbook List (Ghost Table format) */}
        <div className="bg-surface-container-low p-6 rounded-3xl">
          {loading ? (
            <p className="text-sm text-on-surface-variant">Memuat daftar tamu...</p>
          ) : filteredGuests.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">Belum ada tamu terdaftar untuk acara ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-widest bg-surface-container-high/40">
                    <th className="p-4 rounded-l-xl">Status Hadir</th>
                    <th className="p-4">Nama Tamu</th>
                    <th className="p-4">Nomor HP</th>
                    <th className="p-4">Undangan Pernikahan Klien</th>
                    <th className="p-4">Slug Tautan</th>
                    <th className="p-4 rounded-r-xl text-right">Aksi Undangan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((g) => (
                    <tr
                      key={g.id}
                      className="hover:bg-surface-container-lowest transition-all duration-200"
                    >
                      {/* Attendance Toggle Check-In */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleAttendance(g)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            g.is_attended
                              ? 'bg-secondary-container text-on-secondary-fixed-variant'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary-container/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {g.is_attended ? 'check_circle' : 'circle'}
                          </span>
                          {g.is_attended ? 'Hadir' : 'Absen'}
                        </button>
                      </td>

                      <td className="p-4 font-serif font-medium text-primary text-sm">{g.guest_name}</td>
                      <td className="p-4 text-xs font-mono text-on-surface-variant font-medium">{g.guest_phone || '-'}</td>
                      <td className="p-4 text-xs text-on-surface-variant">{g.client_name || 'Umum'}</td>
                      <td className="p-4 text-xs font-mono text-secondary max-w-[120px] truncate" title={g.invitation_slug}>
                        {g.invitation_slug}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleCopyLink(g.invitation_slug)}
                            className="bg-surface-container-high text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-secondary-container transition-all"
                            title="Salin Link Undangan"
                          >
                            Salin Link
                          </button>
                          
                          {g.guest_phone && (
                            <button
                              onClick={() => handleShareWhatsApp(g)}
                              className="bg-secondary text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-1"
                              title="Kirim ke WhatsApp"
                            >
                              <span className="material-symbols-outlined text-[13px]">share</span>
                              Kirim WA
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleEdit(g)}
                            className="bg-surface-container-high text-primary p-1.5 rounded-lg hover:bg-secondary-container transition-all"
                            title="Edit Tamu"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(g.id)}
                            className="bg-error-container/45 text-on-error-container p-1.5 rounded-lg hover:bg-error-container transition-all"
                            title="Hapus Tamu"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0_12px_40px_rgba(11,37,69,0.06)] border border-outline-variant/15 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-primary mb-6">
                {editingGuest ? 'Edit Tamu Undangan' : 'Tambah Tamu Undangan Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Acara Pernikahan</label>
                  <select
                    value={formData.event_id || ''}
                    onChange={(e) => setFormData({ ...formData, event_id: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    required
                  >
                    <option value="">-- Pilih Acara --</option>
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.client_name} ({evt.invoice_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Lengkap Tamu</label>
                  <input
                    type="text"
                    value={formData.guest_name}
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Contoh: Bapak H. Ahmad Subardjo"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nomor HP (WhatsApp)</label>
                  <input
                    type="text"
                    value={formData.guest_phone}
                    onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Contoh: 0812345678"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Kustom Slug Tautan Undangan (Opsional)</label>
                  <input
                    type="text"
                    value={formData.invitation_slug}
                    onChange={(e) => setFormData({ ...formData, invitation_slug: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Contoh: ahmad-subardjo (kosongkan untuk auto-generate)"
                  />
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="is_attended"
                    checked={formData.is_attended || false}
                    onChange={(e) => setFormData({ ...formData, is_attended: e.target.checked })}
                    className="w-4 h-4 text-primary bg-surface-container-low border-transparent rounded focus:ring-0 focus:ring-offset-0"
                  />
                  <label htmlFor="is_attended" className="text-sm font-medium text-on-surface">
                    Tandai Tamu Sudah Hadir di Lokasi (Check-In)
                  </label>
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
                    Simpan Tamu
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
