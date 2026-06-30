import { useState, useEffect } from 'react';

interface SummaryData {
  total_plans: number;
  active_plans: number;
  overdue_plans: number;
  completed_plans: number;
  total_value: number;
  total_paid: number;
}

export default function PaymentSummary() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/installments/summary/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSummary(data.data);
        } else if (response.status === 404) {
          // Jika belum ada data, set default
          setSummary({
            total_plans: 0,
            active_plans: 0,
            overdue_plans: 0,
            completed_plans: 0,
            total_value: 0,
            total_paid: 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Gagal memuat data');
        // Set default data jika ada error
        setSummary({
          total_plans: 0,
          active_plans: 0,
          overdue_plans: 0,
          completed_plans: 0,
          total_value: 0,
          total_paid: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    {
      title: 'Total Rencana Cicilan',
      value: summary?.total_plans || 0,
      color: 'bg-primary text-on-primary',
      icon: '📋',
    },
    {
      title: 'Cicilan Aktif',
      value: summary?.active_plans || 0,
      color: 'bg-blue-500 text-white',
      icon: '⚙️',
    },
    {
      title: 'Cicilan Jatuh Tempo',
      value: summary?.overdue_plans || 0,
      color: 'bg-red-500 text-white',
      icon: '⚠️',
    },
    {
      title: 'Cicilan Selesai',
      value: summary?.completed_plans || 0,
      color: 'bg-green-500 text-white',
      icon: '✓',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-on-surface-variant">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`${stat.color} rounded-lg p-6 text-white shadow-lg transition-transform hover:scale-105`}
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="font-sans text-sm font-medium tracking-wide opacity-90 mb-2">
              {stat.title}
            </p>
            <p className="text-3xl font-serif font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm border-l-4 border-secondary">
        <h3 className="text-xl font-serif text-primary mb-8">Ringkasan Finansial</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-sans text-sm tracking-wide text-on-surface-variant mb-2">
              TOTAL NILAI CICILAN
            </p>
            <p className="text-3xl font-serif font-bold text-primary">
              {formatCurrency(summary?.total_value || 0)}
            </p>
          </div>
          <div>
            <p className="font-sans text-sm tracking-wide text-on-surface-variant mb-2">
              TOTAL TERBAYAR
            </p>
            <p className="text-3xl font-serif font-bold text-green-600">
              {formatCurrency(summary?.total_paid || 0)}
            </p>
          </div>
          <div>
            <p className="font-sans text-sm tracking-wide text-on-surface-variant mb-2">
              SISA PEMBAYARAN
            </p>
            <p className="text-3xl font-serif font-bold text-red-600">
              {formatCurrency((summary?.total_value || 0) - (summary?.total_paid || 0))}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 pt-8 border-t border-surface-container-low">
          <p className="font-sans text-sm tracking-wide text-on-surface-variant mb-4">
            PROGRESS PEMBAYARAN KESELURUHAN
          </p>
          <div className="bg-surface-container-low rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
              style={{
                width: `${
                  summary && summary.total_value > 0
                    ? ((summary.total_paid / summary.total_value) * 100).toFixed(1)
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="font-sans text-sm text-on-surface-variant mt-2">
            {summary && summary.total_value > 0
              ? ((summary.total_paid / summary.total_value) * 100).toFixed(1)
              : 0}
            % pembayaran selesai
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-surface-container-lowest rounded-lg p-6 border-l-4 border-secondary">
        <p className="font-sans text-sm text-on-surface-variant">
          💡 <span className="font-medium">Tips:</span> Pantau cicilan yang akan jatuh tempo agar 
          klien dapat membayar tepat waktu. Gunakan fitur reminder untuk mengingatkan klien.
        </p>
      </div>
    </div>
  );
}
