import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || '';

interface Event {
  id: number;
  invoice_number: string;
  client_name: string;
  event_date: string;
  package_name: string;
  package_price: number;
}

interface Payment {
  id: number;
  event_id: number;
  payment_amount: number;
  payment_date: string;
  payment_type: 'booking_fee' | 'down_payment' | 'installment' | 'final_payment';
  payment_method: string;
  receipt_note: string;
  client_name: string;
  invoice_number: string;
  package_price: number;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  
  // Custom Filter State: 'all' | 'receivables' (Piutang)
  const [viewTab, setViewTab] = useState<'transactions' | 'piutang'>('transactions');

  const [formData, setFormData] = useState<Partial<Payment>>({
    event_id: 0,
    payment_amount: 0,
    payment_date: new Date().toISOString().substring(0, 10),
    payment_type: 'down_payment',
    payment_method: 'Transfer BCA',
    receipt_note: '',
  });

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [paymentsRes, eventsRes] = await Promise.all([
        fetch(`${API_URL}/api/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments || []);
      }
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to fetch payments data:', error);
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
      const url = editingPayment
        ? `${API_URL}/api/payments/${editingPayment.id}`
        : `${API_URL}/api/payments`;
      const method = editingPayment ? 'PUT' : 'POST';

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
        setEditingPayment(null);
        setFormData({
          event_id: 0,
          payment_amount: 0,
          payment_date: new Date().toISOString().substring(0, 10),
          payment_type: 'down_payment',
          payment_method: 'Transfer BCA',
          receipt_note: '',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save payment:', error);
    }
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData(payment);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan kuitansi pembayaran ini?')) {
      try {
        const response = await fetch(`${API_URL}/api/payments/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete payment:', error);
      }
    }
  };

  // Process Outstanding Receivables (Daftar Piutang Klien)
  const clientReceivables = events
    .map(evt => {
      const eventPayments = payments.filter(p => p.event_id === evt.id);
      const totalPaid = eventPayments.reduce((sum, p) => sum + p.payment_amount, 0);
      const balance = evt.package_price - totalPaid;
      return {
        ...evt,
        total_paid: totalPaid,
        balance: balance > 0 ? balance : 0,
        status: balance <= 0 ? 'Lunas' : totalPaid > 0 ? 'Termin' : 'Belum Bayar'
      };
    })
    .filter(evt => evt.balance > 0); // Only return outstanding accounts

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'booking_fee': return 'Tanda Jadi (Booking)';
      case 'down_payment': return 'Uang Muka (DP)';
      case 'installment': return 'Termin / Angsuran';
      case 'final_payment': return 'Pelunasan';
      default: return type;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-light text-primary tracking-wide">
              Payments & <span className="font-normal font-serif">Invoices</span>
            </h1>
            <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">
              Pelacakan Keuangan & Piutang Pemesanan Klien
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditingPayment(null);
                setFormData({
                  event_id: events.length > 0 ? events[0].id : 0,
                  payment_amount: 0,
                  payment_date: new Date().toISOString().substring(0, 10),
                  payment_type: 'down_payment',
                  payment_method: 'Transfer BCA',
                  receipt_note: '',
                });
                setShowModal(true);
              }}
              className="bg-primary text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add_card</span>
              Catat Kuitansi Baru
            </button>
          </div>
        </div>

        {/* View Switch Tabs (Sanctuary Aesthetics, no harsh borders) */}
        <div className="flex gap-4 mb-8 bg-surface-container-low p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setViewTab('transactions')}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              viewTab === 'transactions'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Log Transaksi Kuitansi
          </button>
          <button
            onClick={() => setViewTab('piutang')}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              viewTab === 'piutang'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Piutang Klien (Belum Lunas)
            {clientReceivables.length > 0 && (
              <span className="w-2 h-2 bg-error rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: TRANSACTIONS LOG */}
        {viewTab === 'transactions' && (
          <div className="bg-surface-container-low p-6 rounded-3xl">
            <h2 className="text-xl font-serif text-primary mb-6">Log Pembayaran Masuk</h2>
            
            {loading ? (
              <p className="text-sm text-on-surface-variant">Memuat data kuitansi...</p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">Belum ada transaksi pembayaran.</p>
            ) : (
              <div className="overflow-x-auto">
                {/* The "Ghost Table" - Dividerless, separated by spacer blocks, hover effects */}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-widest bg-surface-container-high/40">
                      <th className="p-4 rounded-l-xl">No. Invoice</th>
                      <th className="p-4">Nama Klien</th>
                      <th className="p-4">Jumlah Bayar</th>
                      <th className="p-4">Tipe Kuitansi</th>
                      <th className="p-4">Metode</th>
                      <th className="p-4">Tanggal Kuitansi</th>
                      <th className="p-4 rounded-r-xl text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-surface-container-lowest transition-all duration-200"
                      >
                        <td className="p-4 font-mono text-xs font-semibold text-secondary">{p.invoice_number}</td>
                        <td className="p-4 font-serif font-medium text-primary text-sm">{p.client_name}</td>
                        <td className="p-4 font-serif font-bold text-primary text-sm">Rp {p.payment_amount.toLocaleString('id-ID')}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-secondary-container text-on-secondary-fixed-variant rounded-full">
                            {getPaymentTypeLabel(p.payment_type)}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-on-surface-variant font-medium">{p.payment_method}</td>
                        <td className="p-4 text-xs text-on-surface-variant">
                          {new Date(p.payment_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="bg-surface-container-high text-primary px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider hover:bg-secondary-container transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="bg-error-container/40 text-on-error-container px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider hover:bg-error-container transition-all"
                            >
                              Hapus
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
        )}

        {/* TAB 2: PIUTANG KLIEN */}
        {viewTab === 'piutang' && (
          <div className="bg-surface-container-low p-6 rounded-3xl">
            <h2 className="text-xl font-serif text-primary mb-6">Daftar Tagihan Klien (Piutang)</h2>
            
            {loading ? (
              <p className="text-sm text-on-surface-variant">Memuat tagihan piutang...</p>
            ) : clientReceivables.length === 0 ? (
              <div className="text-center py-10">
                <span className="material-symbols-outlined text-4xl text-secondary/40">verified</span>
                <p className="text-sm text-on-surface-variant mt-2">Semua tagihan pemesanan klien telah lunas!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-widest bg-surface-container-high/40">
                      <th className="p-4 rounded-l-xl">No. Invoice</th>
                      <th className="p-4">Nama Klien</th>
                      <th className="p-4">Paket Dipilih</th>
                      <th className="p-4">Harga Paket</th>
                      <th className="p-4">Total Terbayar</th>
                      <th className="p-4">Sisa Tagihan (Piutang)</th>
                      <th className="p-4 rounded-r-xl">Status Tagihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientReceivables.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-surface-container-lowest transition-all duration-200"
                      >
                        <td className="p-4 font-mono text-xs font-semibold text-secondary">{c.invoice_number}</td>
                        <td className="p-4 font-serif font-medium text-primary text-sm">{c.client_name}</td>
                        <td className="p-4 text-xs font-semibold text-on-surface-variant">{c.package_name}</td>
                        <td className="p-4 font-serif text-sm">Rp {c.package_price.toLocaleString('id-ID')}</td>
                        <td className="p-4 font-serif text-sm text-secondary font-medium">Rp {c.total_paid.toLocaleString('id-ID')}</td>
                        <td className="p-4 font-serif font-bold text-error text-sm">Rp {c.balance.toLocaleString('id-ID')}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                            c.status === 'Termin'
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                              : 'bg-error-container text-on-error-container'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0_12px_40px_rgba(11,37,69,0.06)] border border-outline-variant/15 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-primary mb-6">
                {editingPayment ? 'Edit Kuitansi Pembayaran' : 'Catat Kuitansi Pembayaran Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pilih Acara / Klien</label>
                  <select
                    value={formData.event_id || ''}
                    onChange={(e) => setFormData({ ...formData, event_id: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    required
                    disabled={!!editingPayment}
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
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Jumlah Pembayaran (Rp)</label>
                  <input
                    type="number"
                    value={formData.payment_amount || ''}
                    onChange={(e) => setFormData({ ...formData, payment_amount: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="10000000"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tanggal Pembayaran</label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Tipe Pembayaran</label>
                    <select
                      value={formData.payment_type}
                      onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    >
                      <option value="booking_fee">Tanda Jadi (Booking)</option>
                      <option value="down_payment">Uang Muka (DP)</option>
                      <option value="installment">Termin / Angsuran</option>
                      <option value="final_payment">Pelunasan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Metode Pembayaran</label>
                    <input
                      type="text"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                      placeholder="Contoh: Transfer BCA"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Catatan Tambahan (Keterangan)</label>
                  <textarea
                    value={formData.receipt_note}
                    onChange={(e) => setFormData({ ...formData, receipt_note: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans resize-none"
                    placeholder="Contoh: Pembayaran termin ke-2, pelunasan dilakukan H-30."
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
                    Simpan Kuitansi
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
