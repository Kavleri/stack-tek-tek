import { useState, useEffect } from 'react';

interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: string;
  payment_type: string;
  payment_date: string;
  status: string;
  invoice_number: string;
  notes: string;
  client_name: string;
  client_phone: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Completed' | 'Failed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'Full Payment' | 'Down Payment' | 'Installment'>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPayments(data.data || []);
        setFilteredPayments(data.data || []);
      } else {
        setError('Gagal memuat riwayat pembayaran');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = payments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.groom_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.bride_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((payment) => payment.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((payment) => payment.payment_type === filterType);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, filterStatus, filterType, payments]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Failed':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full Payment':
        return 'bg-blue-50 text-blue-700';
      case 'Down Payment':
        return 'bg-purple-50 text-purple-700';
      case 'Installment':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-on-surface-variant">Memuat riwayat pembayaran...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-serif text-primary mb-4">Filter & Pencarian</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
              CARI
            </label>
            <input
              type="text"
              placeholder="Nama klien, invoice, atau nama mempelai..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-b-2 border-surface-container-low focus:border-primary focus:outline-none bg-surface text-on-surface placeholder-on-surface-variant transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
              STATUS
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-2 border-b-2 border-surface-container-low focus:border-primary focus:outline-none bg-surface text-on-surface"
            >
              <option value="all">Semua Status</option>
              <option value="Completed">Selesai</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Gagal</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
              TIPE PEMBAYARAN
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 border-b-2 border-surface-container-low focus:border-primary focus:outline-none bg-surface text-on-surface"
            >
              <option value="all">Semua Tipe</option>
              <option value="Full Payment">Pembayaran Penuh</option>
              <option value="Down Payment">Uang Muka</option>
              <option value="Installment">Cicilan</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="font-sans text-sm text-on-surface-variant">
          {filteredPayments.length} transaksi ditemukan
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-sans text-sm">{error}</p>
        </div>
      )}

      {/* Payment Table */}
      <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-on-surface-variant font-sans text-sm">
              Tidak ada riwayat pembayaran yang sesuai dengan filter
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-container-low bg-surface-container-low">
                  <th className="text-left px-6 py-4 font-sans text-xs font-bold tracking-wider text-on-surface-variant">
                    INVOICE
                  </th>
                  <th className="text-left px-6 py-4 font-sans text-xs font-bold tracking-wider text-on-surface-variant">
                    KLIEN
                  </th>
                  <th className="text-left px-6 py-4 font-sans text-xs font-bold tracking-wider text-on-surface-variant">
                    TIPE
                  </th>
                  <th className="text-right px-6 py-4 font-sans text-xs font-bold tracking-wider text-on-surface-variant">
                    JUMLAH
                  </th>
                  <th className="text-left px-6 py-4 font-sans text-xs font-bold tracking-wider text-on-surface-variant">
                    TANGGAL
                  </th>
                  <th className="text-center px-6 py-4 font-sans text-xs font-bold tracking-wider text-on-surface-variant">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-surface-container-low hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-sans text-sm font-medium text-primary">
                        {payment.invoice_number || `INV-${payment.id}`}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-sans text-sm font-medium text-on-surface">
                        {payment.client_name}
                      </p>
                      <p className="font-sans text-xs text-on-surface-variant">
                        {payment.groom_name} & {payment.bride_name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-medium font-sans ${getTypeColor(payment.payment_type)}`}>
                        {payment.payment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-serif text-sm font-bold text-on-surface">
                        {formatCurrency(payment.amount)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-sans text-sm text-on-surface-variant">
                        {formatDate(payment.payment_date)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-medium font-sans ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredPayments.length > 0 && (
        <div className="bg-surface-container-lowest rounded-lg p-6 border-t-2 border-secondary">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-sans text-sm tracking-wide text-on-surface-variant mb-2">
                TOTAL PEMBAYARAN
              </p>
              <p className="text-2xl font-serif font-bold text-on-surface">
                {formatCurrency(
                  filteredPayments.reduce((sum, p) => sum + p.amount, 0)
                )}
              </p>
            </div>
            <div>
              <p className="font-sans text-sm tracking-wide text-on-surface-variant mb-2">
                TRANSAKSI SELESAI
              </p>
              <p className="text-2xl font-serif font-bold text-green-600">
                {filteredPayments.filter((p) => p.status === 'Completed').length}
              </p>
            </div>
            <div>
              <p className="font-sans text-sm tracking-wide text-on-surface-variant mb-2">
                TRANSAKSI PENDING
              </p>
              <p className="text-2xl font-serif font-bold text-yellow-600">
                {filteredPayments.filter((p) => p.status === 'Pending').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
