import { useState, useEffect } from 'react';

interface InstallmentPlan {
  id: number;
  booking_id: number;
  total_installments: number;
  installment_amount: number;
  paid_installments: number;
  next_due_date: string;
  status: string;
  notes: string;
  client_name: string;
  client_phone: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
  booking_total: number;
}

interface InstallmentSchedule {
  id: number;
  installment_plan_id: number;
  installment_number: number;
  due_date: string;
  amount: number;
  paid_amount: number;
  status: string;
  payment_date: string;
  notes: string;
}

export default function InstallmentManager() {
  const [plans, setPlans] = useState<InstallmentPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<InstallmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Active' | 'Completed' | 'Overdue'>('all');
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(null);
  const [schedules, setSchedules] = useState<InstallmentSchedule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    installment_number: 1,
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchInstallmentPlans();
  }, []);

  const fetchInstallmentPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/installments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPlans(data.data || []);
        setFilteredPlans(data.data || []);
      } else {
        setError('Gagal memuat data cicilan');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (planId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/installments/${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSchedules(data.data?.schedules || []);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  useEffect(() => {
    let filtered = plans;

    if (searchTerm) {
      filtered = filtered.filter(
        (plan) =>
          plan.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.groom_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.bride_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((plan) => plan.status === filterStatus);
    }

    setFilteredPlans(filtered);
  }, [searchTerm, filterStatus, plans]);

  const handleSelectPlan = (plan: InstallmentPlan) => {
    setSelectedPlan(plan);
    fetchSchedules(plan.id);
    setPaymentForm({
      installment_number: plan.paid_installments + 1,
      amount: plan.installment_amount,
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleRecordPayment = async () => {
    if (!selectedPlan) return;

    try {
      const schedule = schedules.find(
        (s) => s.installment_number === paymentForm.installment_number
      );

      if (!schedule) {
        setError('Jadwal cicilan tidak ditemukan');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/installments/${schedule.id}/payment`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: paymentForm.amount,
            payment_date: paymentForm.payment_date,
            status: 'Paid',
            notes: paymentForm.notes,
          }),
        }
      );

      if (response.ok) {
        setError(null);
        setShowModal(false);
        fetchInstallmentPlans();
        if (selectedPlan) {
          fetchSchedules(selectedPlan.id);
        }
      } else {
        setError('Gagal mencatat pembayaran');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

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
      case 'Active':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Overdue':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-on-surface-variant">Memuat data cicilan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-serif text-primary mb-4">Filter & Pencarian</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
              CARI
            </label>
            <input
              type="text"
              placeholder="Nama klien atau mempelai..."
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
              <option value="Active">Aktif</option>
              <option value="Completed">Selesai</option>
              <option value="Overdue">Jatuh Tempo</option>
            </select>
          </div>
        </div>

        <p className="font-sans text-sm text-on-surface-variant">
          {filteredPlans.length} rencana cicilan
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-sans text-sm">{error}</p>
        </div>
      )}

      {/* Installment Plans List */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-lg p-12 text-center">
            <p className="text-on-surface-variant font-sans text-sm">
              Belum ada rencana cicilan
            </p>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-surface-container-lowest rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-secondary"
              onClick={() => handleSelectPlan(plan)}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Client Info */}
                <div>
                  <p className="font-sans text-xs tracking-wide text-on-surface-variant mb-1">
                    KLIEN
                  </p>
                  <p className="font-serif text-sm font-bold text-on-surface">
                    {plan.client_name}
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">
                    {plan.groom_name} & {plan.bride_name}
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">
                    📞 {plan.client_phone}
                  </p>
                </div>

                {/* Installment Details */}
                <div>
                  <p className="font-sans text-xs tracking-wide text-on-surface-variant mb-1">
                    RINCIAN CICILAN
                  </p>
                  <p className="font-serif text-sm font-bold text-on-surface">
                    {plan.paid_installments}/{plan.total_installments} Cicilan
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">
                    Per cicilan: {formatCurrency(plan.installment_amount)}
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-1">
                    Total: {formatCurrency(plan.installment_amount * plan.total_installments)}
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <p className="font-sans text-xs tracking-wide text-on-surface-variant mb-2">
                    PROGRESS
                  </p>
                  <div className="bg-surface-container-low rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full transition-all"
                      style={{
                        width: `${((plan.paid_installments / plan.total_installments) * 100).toFixed(1)}%`,
                      }}
                    />
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant">
                    {((plan.paid_installments / plan.total_installments) * 100).toFixed(0)}% Selesai
                  </p>
                </div>

                {/* Status & Action */}
                <div className="flex flex-col items-end justify-between">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium font-sans ${getStatusColor(plan.status)}`}>
                    {plan.status === 'Active' && '⚙️ Aktif'}
                    {plan.status === 'Completed' && '✓ Selesai'}
                    {plan.status === 'Overdue' && '⚠️ Jatuh Tempo'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(plan);
                      setShowModal(true);
                    }}
                    className="mt-2 px-4 py-2 bg-primary text-on-primary rounded text-xs font-medium font-sans hover:opacity-90 transition-opacity"
                  >
                    Catat Pembayaran
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className="mt-4 pt-4 border-t border-surface-container-low flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-sans text-xs text-on-surface-variant">
                    📅 Acara: {formatDate(plan.event_date)}
                  </p>
                  {plan.next_due_date && (
                    <p className="font-sans text-xs text-red-600 mt-1">
                      Jatuh tempo: {formatDate(plan.next_due_date)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    handleSelectPlan(plan);
                    setShowModal(false);
                  }}
                  className="text-primary font-sans text-xs font-medium hover:underline"
                >
                  Lihat Detail →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedPlan && !showModal && (
        <div className="bg-surface-container-lowest rounded-lg p-8 mt-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-serif text-primary mb-2">
                Detail Cicilan - {selectedPlan.client_name}
              </h3>
              <p className="font-sans text-sm text-on-surface-variant">
                {selectedPlan.groom_name} & {selectedPlan.bride_name}
              </p>
            </div>
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-on-surface-variant hover:text-on-surface text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="text-left px-4 py-3 font-sans font-bold text-on-surface-variant">
                    Cicilan #
                  </th>
                  <th className="text-left px-4 py-3 font-sans font-bold text-on-surface-variant">
                    Jatuh Tempo
                  </th>
                  <th className="text-right px-4 py-3 font-sans font-bold text-on-surface-variant">
                    Jumlah
                  </th>
                  <th className="text-right px-4 py-3 font-sans font-bold text-on-surface-variant">
                    Terbayar
                  </th>
                  <th className="text-center px-4 py-3 font-sans font-bold text-on-surface-variant">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b border-surface-container-low hover:bg-surface-container-low">
                    <td className="px-4 py-3 font-serif font-bold">#{schedule.installment_number}</td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {formatDate(schedule.due_date)}
                    </td>
                    <td className="px-4 py-3 text-right font-serif">
                      {formatCurrency(schedule.amount)}
                    </td>
                    <td className="px-4 py-3 text-right font-serif text-green-600">
                      {formatCurrency(schedule.paid_amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        schedule.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : schedule.status === 'Overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {schedule.status === 'Paid' && '✓ Terbayar'}
                        {schedule.status === 'Pending' && '⏳ Pending'}
                        {schedule.status === 'Overdue' && '⚠️ Jatuh Tempo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-serif text-primary mb-6">Catat Pembayaran Cicilan</h3>

            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
                  KLIEN
                </label>
                <p className="text-on-surface font-sans text-sm">{selectedPlan.client_name}</p>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
                  CICILAN KE
                </label>
                <select
                  value={paymentForm.installment_number}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      installment_number: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border-b border-surface-container-low focus:border-primary focus:outline-none bg-surface text-on-surface"
                >
                  {Array.from({ length: selectedPlan.total_installments }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Cicilan {i + 1} dari {selectedPlan.total_installments}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
                  JUMLAH PEMBAYARAN
                </label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border-b border-surface-container-low focus:border-primary focus:outline-none bg-surface text-on-surface"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
                  TANGGAL PEMBAYARAN
                </label>
                <input
                  type="date"
                  value={paymentForm.payment_date}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      payment_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border-b border-surface-container-low focus:border-primary focus:outline-none bg-surface text-on-surface"
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-on-surface-variant mb-2 tracking-wide">
                  CATATAN
                </label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Catatan pembayaran (opsional)"
                  rows={3}
                  className="w-full px-3 py-2 border-b border-surface-container-low focus:border-primary focus:outline-none bg-surface text-on-surface placeholder-on-surface-variant resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPlan(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded font-sans font-medium hover:bg-primary hover:text-on-primary transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRecordPayment}
                className="flex-1 px-4 py-2 bg-primary text-on-primary rounded font-sans font-medium hover:opacity-90 transition-opacity"
              >
                Simpan Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
