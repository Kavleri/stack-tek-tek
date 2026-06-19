import { useMemo, useState } from 'react';
import QRCode from 'react-qr-code';
import Sidebar from '../components/Sidebar';

interface GuestItem {
  id: number;
  name: string;
  phone: string;
  eventName: string;
  slug: string;
  status: 'ABSEN' | 'HADIR';
}

const initialGuests: GuestItem[] = [
  {
    id: 1,
    name: 'Budi Santoso',
    phone: '+62 812-3456-7890',
    eventName: 'Kavleri & Rizky Amalia',
    slug: 'budi-santoso',
    status: 'ABSEN',
  },
  {
    id: 2,
    name: 'Dewi Kartika',
    phone: '+62 811-2233-4455',
    eventName: 'Kavleri & Rizky Amalia',
    slug: 'dewi-kartika',
    status: 'HADIR',
  },
  {
    id: 3,
    name: 'Anton Prasetyo',
    phone: '+62 813-6677-8899',
    eventName: 'Aulia & Fathir',
    slug: 'anton-prasetyo',
    status: 'ABSEN',
  },
  {
    id: 4,
    name: 'Maya Putri',
    phone: '+62 857-9944-2233',
    eventName: 'Aulia & Fathir',
    slug: 'maya-putri',
    status: 'HADIR',
  },
  {
    id: 5,
    name: 'Yusuf Ramadhan',
    phone: '+62 811-3344-5566',
    eventName: 'Kavleri & Rizky Amalia',
    slug: 'yusuf-ramadhan',
    status: 'ABSEN',
  },
];

const eventList = ['Kavleri & Rizky Amalia', 'Aulia & Fathir'];
const eventOptions = ['SEMUA ACARA', ...eventList];

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function Guests() {
  const [guests, setGuests] = useState<GuestItem[]>(initialGuests);
  const [selectedEvent, setSelectedEvent] = useState<string>('SEMUA ACARA');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [qrGuest, setQrGuest] = useState<GuestItem | null>(null);
  const [scanSuccess, setScanSuccess] = useState<boolean>(false);
  const [isAddEditOpen, setIsAddEditOpen] = useState<boolean>(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  
  // Form fields state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEvent, setFormEvent] = useState(eventList[0]);
  const [formSlug, setFormSlug] = useState('');
  const [formStatus, setFormStatus] = useState<'ABSEN' | 'HADIR'>('ABSEN');

  // Toast notifications state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 3500);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid characters
      .replace(/\s+/g, '-')         // replace spaces with single dashes
      .replace(/-+/g, '-')          // collapse multiple dashes
      .replace(/(^-|-$)+/g, '');    // trim dashes from start/end
  };

  // Filtered guest list based on Event and Search Query
  const displayedGuests = useMemo(() => {
    let list = guests;
    if (selectedEvent !== 'SEMUA ACARA') {
      list = list.filter((guest) => guest.eventName === selectedEvent);
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      list = list.filter((guest) => guest.name.toLowerCase().includes(query));
    }
    return list;
  }, [guests, selectedEvent, searchQuery]);

  const hadirCount = useMemo(() => guests.filter((guest) => guest.status === 'HADIR').length, [guests]);
  const totalCount = guests.length;

  // Actions
  const handleOpenQr = (guest: GuestItem) => {
    setQrGuest(guest);
    setScanSuccess(false);
  };

  const handleCloseQr = () => {
    setQrGuest(null);
    setScanSuccess(false);
  };

  const handleSimulateScan = () => {
    if (!qrGuest) return;
    
    // Perform status toggle/update
    setGuests((current) =>
      current.map((item) =>
        item.id === qrGuest.id ? { ...item, status: 'HADIR' } : item,
      ),
    );
    
    setQrGuest((current) => (current ? { ...current, status: 'HADIR' } : null));
    setScanSuccess(true);
    showToast(`Check-in berhasil untuk ${qrGuest.name}!`, 'success');
  };

  const handleResetStatus = () => {
    if (!qrGuest) return;
    
    setGuests((current) =>
      current.map((item) =>
        item.id === qrGuest.id ? { ...item, status: 'ABSEN' } : item,
      ),
    );
    
    setQrGuest((current) => (current ? { ...current, status: 'ABSEN' } : null));
    setScanSuccess(false);
    showToast(`Status kehadiran ${qrGuest.name} dikembalikan menjadi ABSEN`, 'info');
  };

  const handleSendWa = (guest: GuestItem) => {
    const text = encodeURIComponent(`Assalamu'alaikum Wr. Wb.
Yth. Bapak/Ibu/Saudara/i *${guest.name}*,

Dengan memohon rahmat Allah SWT, kami mengundang Anda untuk menghadiri acara pernikahan klien kami:
*${guest.eventName}*

Tautan undangan digital Anda dapat diakses melalui link berikut:
https://dreamsyariah.id/invite/${guest.slug}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.

Jazakumullah Khairan Katsiran.
Wassalamu'alaikum Wr. Wb.`);

    const formattedPhone = guest.phone.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${formattedPhone}?text=${text}`;
    window.open(waUrl, '_blank');
    showToast(`Undangan dikirim ke WhatsApp ${guest.name}`, 'success');
  };

  // Add / Edit operations
  const handleOpenAdd = () => {
    setEditingGuest(null);
    setFormName('');
    setFormPhone('');
    setFormEvent(eventList[0]);
    setFormSlug('');
    setFormStatus('ABSEN');
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (guest: GuestItem) => {
    setEditingGuest(guest);
    setFormName(guest.name);
    setFormPhone(guest.phone);
    setFormEvent(guest.eventName);
    setFormSlug(guest.slug);
    setFormStatus(guest.status);
    setIsAddEditOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formSlug.trim()) {
      showToast('Harap isi semua kolom formulir!', 'error');
      return;
    }

    if (editingGuest) {
      // Edit
      setGuests((current) =>
        current.map((item) =>
          item.id === editingGuest.id
            ? {
                ...item,
                name: formName.trim(),
                phone: formPhone.trim(),
                eventName: formEvent,
                slug: formSlug.trim(),
                status: formStatus,
              }
            : item,
        ),
      );
      showToast(`Data tamu ${formName} berhasil diperbarui!`, 'success');
    } else {
      // Add
      const newGuest: GuestItem = {
        id: Date.now(),
        name: formName.trim(),
        phone: formPhone.trim(),
        eventName: formEvent,
        slug: formSlug.trim(),
        status: formStatus,
      };
      setGuests((current) => [...current, newGuest]);
      showToast(`Tamu ${formName} berhasil ditambahkan!`, 'success');
    }
    setIsAddEditOpen(false);
  };

  const handleDelete = (guest: GuestItem) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data tamu: ${guest.name}?`)) {
      setGuests((current) => current.filter((item) => item.id !== guest.id));
      showToast(`Data tamu ${guest.name} telah dihapus.`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex font-sans antialiased">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Admin Section */}
      <main className="flex-1 p-8 bg-surface overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Header Area */}
          <header className="rounded-[28px] bg-surface-container-low p-8 shadow-[0_12px_40px_rgba(11,37,69,0.03)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold font-sans">Guest Book</p>
              <div>
                <h1 className="text-4xl font-serif font-bold text-primary tracking-tight">Digital Guest Book</h1>
                <p className="text-[11px] text-slate-500 font-semibold tracking-wider font-sans mt-0.5">BUKU TAMU DIGITAL & PENGIRIMAN UNDANGAN WHATSAPP</p>
              </div>
            </div>
            
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-primary-container to-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              + TAMBAH TAMU UNDANGAN
            </button>
          </header>

          {/* Filtering and Counters */}
          <section className="grid gap-6 md:grid-cols-[2fr_1fr] items-stretch">
            
            {/* Filter controls container */}
            <div className="rounded-[28px] bg-surface-container-low p-6 shadow-[0_12px_40px_rgba(11,37,69,0.03)] grid gap-4 sm:grid-cols-2">
              {/* Event Filter */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_16px_rgba(11,37,69,0.01)]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SARING BERDASARKAN ACARA</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full rounded-xl bg-surface-container-low border border-transparent focus:border-primary/10 px-4 py-2.5 text-sm text-on-surface outline-none transition-all duration-200 focus:bg-surface-container-lowest"
                >
                  {eventOptions.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name Search */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_16px_rgba(11,37,69,0.01)]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">CARI NAMA TAMU</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Masukkan nama tamu..."
                    className="w-full rounded-xl bg-surface-container-low border border-transparent focus:border-primary/10 pl-10 pr-4 py-2.5 text-sm text-on-surface outline-none transition-all duration-200 focus:bg-surface-container-lowest"
                  />
                </div>
              </div>
            </div>

            {/* Live stats counter */}
            <div className="rounded-[28px] bg-surface-container-low p-6 shadow-[0_12px_40px_rgba(11,37,69,0.03)] flex flex-col justify-center">
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_4px_16px_rgba(11,37,69,0.01)] flex items-center justify-between gap-4 h-full">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">HADIR / TOTAL TAMU</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    {/* Noto Serif for numbers based on DESIGN.md */}
                    <span className="text-4xl font-serif font-bold text-secondary">{hadirCount}</span>
                    <span className="text-sm font-sans font-medium text-slate-400">dari</span>
                    <span className="text-2xl font-serif font-semibold text-primary">{totalCount}</span>
                  </div>
                </div>
                
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-[26px]">groups</span>
                </div>
              </div>
            </div>
          </section>

          {/* Guests Table */}
          <section className="rounded-[28px] bg-surface-container-low p-6 shadow-[0_12px_40px_rgba(11,37,69,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">STATUS</th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">NAMA TAMU</th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">NOMOR HP</th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">UNDANGAN PERNIKAHAN</th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">SLUG TAUTAN</th>
                    <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedGuests.length > 0 ? (
                    displayedGuests.map((guest) => (
                      <tr
                        key={guest.id}
                        className="bg-surface-container-lowest hover:bg-slate-50/60 transition-all duration-200 group shadow-[0_4px_20px_rgba(11,37,69,0.01)]"
                      >
                        {/* Status Badge */}
                        <td className="px-5 py-4.5 align-middle rounded-l-2xl">
                          {guest.status === 'HADIR' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1.5 text-xs font-semibold text-on-secondary-fixed">
                              <span className="material-symbols-outlined text-[15px] font-bold">check</span>
                              HADIR
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface-variant">
                              <span className="block h-2 w-2 rounded-full border border-slate-400" />
                              ABSEN
                            </span>
                          )}
                        </td>

                        {/* Guest Name */}
                        <td className="px-5 py-4.5 align-middle">
                          <p className="font-bold text-on-surface text-[15px] tracking-wide">{guest.name}</p>
                        </td>

                        {/* HP Number */}
                        <td className="px-5 py-4.5 align-middle text-slate-500 font-medium text-[14px]">
                          {guest.phone}
                        </td>

                        {/* Client Wedding Invitation */}
                        <td className="px-5 py-4.5 align-middle text-slate-500 font-medium text-[14px]">
                          {guest.eventName}
                        </td>

                        {/* Slug Link */}
                        <td className="px-5 py-4.5 align-middle">
                          <span className="text-[12px] font-mono text-slate-400 bg-surface-container-low px-2.5 py-1 rounded-lg">
                            {guest.slug}
                          </span>
                        </td>

                        {/* Actions column */}
                        <td className="px-5 py-4.5 align-middle rounded-r-2xl">
                          <div className="flex items-center justify-center gap-2">
                            {/* Barcode Trigger */}
                            <button
                              onClick={() => handleOpenQr(guest)}
                              title="Tampilkan Barcode"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-secondary-container/50 hover:bg-secondary-container text-on-secondary-fixed px-3 py-2 text-xs font-semibold tracking-wider transition-colors duration-200"
                            >
                              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                              BARCODE
                            </button>

                            {/* WhatsApp sender */}
                            <button
                              onClick={() => handleSendWa(guest)}
                              title="Kirim Undangan WhatsApp"
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b5c4f] hover:bg-[#07453b] text-white px-3 py-2 text-xs font-semibold tracking-wider shadow-md shadow-[#0b5c4f]/10 transition-colors duration-200"
                            >
                              <span className="material-symbols-outlined text-[16px] -rotate-12">send</span>
                              KIRIM WA
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEdit(guest)}
                              title="Edit Tamu"
                              className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 w-9 h-9 transition-colors duration-200"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(guest)}
                              title="Hapus Tamu"
                              className="inline-flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 w-9 h-9 transition-colors duration-200"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400 font-medium">
                        Tidak ada data tamu ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Barcode/QR Pop-up Modal */}
      {qrGuest && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[12px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[32px] bg-surface-container-lowest p-6 shadow-[0_12px_40px_rgba(11,37,69,0.08)] relative overflow-hidden animate-scale-up">
            
            {/* Success Scan Overlay */}
            {scanSuccess && (
              <div className="absolute inset-0 bg-secondary-container/95 backdrop-blur-[12px] rounded-[32px] flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 mb-4">
                  <span className="material-symbols-outlined text-[36px] text-on-secondary-fixed font-bold">check</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-1">Check-in Berhasil!</h3>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">Status Kehadiran: HADIR</p>
                <div className="mt-5 bg-white/60 px-5 py-3 rounded-2xl w-full max-w-xs shadow-inner">
                  <p className="font-bold text-on-surface text-[15px]">{qrGuest.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{qrGuest.eventName}</p>
                </div>
                <button
                  onClick={handleCloseQr}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-container to-primary text-white px-6 py-2.5 text-xs font-semibold tracking-wider uppercase shadow-md shadow-black/10 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Selesai
                </button>
              </div>
            )}

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-primary">QR Code Undangan</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Tamu: {qrGuest.name}</p>
              </div>
              <button
                onClick={handleCloseQr}
                className="w-9 h-9 rounded-xl bg-surface-container-low text-slate-500 hover:bg-surface-container-high transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* QR display card */}
            <div className="mt-6 rounded-3xl bg-surface-container-low p-6 text-center">
              <div className="inline-block bg-white p-5 rounded-2xl shadow-md">
                <QRCode value={`https://dreamsyariah.id/invite/${qrGuest.slug}`} size={180} />
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                Scan QR code untuk konfirmasi kehadiran tamu secara instan
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-lowest text-[11px] font-mono text-slate-400 shadow-sm">
                slug: {qrGuest.slug}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5 justify-end">
              {qrGuest.status === 'ABSEN' ? (
                <button
                  onClick={handleSimulateScan}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary-container to-primary px-5 py-3 text-xs font-semibold tracking-wider uppercase text-white shadow-md shadow-black/10 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                  Simulasikan Scan
                </button>
              ) : (
                <button
                  onClick={handleResetStatus}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-3 text-xs font-semibold tracking-wider uppercase text-slate-700 shadow-sm hover:bg-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">undo</span>
                  Kembalikan Absen
                </button>
              )}
              
              <button
                onClick={handleCloseQr}
                className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Guest Pop-up Dialog */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[12px] flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[32px] bg-surface-container-lowest p-6 shadow-[0_12px_40px_rgba(11,37,69,0.08)] relative animate-scale-up">
            
            <div className="flex items-center justify-between mb-6 pb-2">
              <h2 className="text-xl font-serif font-bold text-primary">
                {editingGuest ? 'Edit Tamu Undangan' : 'Tambah Tamu Undangan'}
              </h2>
              <button
                onClick={() => setIsAddEditOpen(false)}
                className="w-9 h-9 rounded-xl bg-surface-container-low text-slate-500 hover:bg-surface-container-high transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">NAMA TAMU</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingGuest) {
                      setFormSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full rounded-xl bg-surface-container-low border border-transparent focus:border-primary/10 px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">NOMOR HP</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="Contoh: +62 812-3456-7890"
                  className="w-full rounded-xl bg-surface-container-low border border-transparent focus:border-primary/10 px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:bg-surface-container-lowest"
                  required
                />
              </div>

              {/* Event Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">UNDANGAN PERNIKAHAN</label>
                <select
                  value={formEvent}
                  onChange={(e) => setFormEvent(e.target.value)}
                  className="w-full rounded-xl bg-surface-container-low border border-transparent focus:border-primary/10 px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:bg-surface-container-lowest"
                >
                  {eventList.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slug */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">SLUG TAUTAN</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(generateSlug(e.target.value))}
                  placeholder="budi-santoso"
                  className="w-full rounded-xl bg-surface-container-low border border-transparent focus:border-primary/10 px-4 py-3 text-sm text-on-surface font-mono outline-none transition-all duration-200 focus:bg-surface-container-lowest"
                  required
                />
                <p className="text-[10px] text-slate-400">
                  Tautan digital: https://dreamsyariah.id/invite/<span className="font-semibold text-slate-500 font-mono">{formSlug || 'slug-tamu'}</span>
                </p>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">STATUS HADIR</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormStatus('ABSEN')}
                    className={`py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all border ${
                      formStatus === 'ABSEN'
                        ? 'bg-surface-container-high text-on-surface-variant border-transparent font-bold'
                        : 'bg-surface-container-low text-slate-400 border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    ABSEN
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('HADIR')}
                    className={`py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all border ${
                      formStatus === 'HADIR'
                        ? 'bg-secondary-container text-on-secondary-fixed border-transparent font-bold'
                        : 'bg-surface-container-low text-slate-400 border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    HADIR
                  </button>
                </div>
              </div>

              {/* Form Controls */}
              <div className="mt-6 pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-br from-primary-container to-primary text-white px-5 py-3 text-xs font-semibold tracking-wider uppercase shadow-md shadow-black/10 hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Simpan Data
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Floating toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl border-0 text-xs font-semibold tracking-wide animate-slide-in ${
              toast.type === 'success'
                ? 'bg-secondary-container text-primary shadow-secondary-container/10'
                : toast.type === 'error'
                ? 'bg-red-50 text-red-700 shadow-red-500/10'
                : 'bg-white text-slate-700 shadow-black/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            {toast.message}
          </div>
        ))}
      </div>

    </div>
  );
}
