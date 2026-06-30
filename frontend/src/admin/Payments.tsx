import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PaymentHistory from './components/PaymentHistory';
import InstallmentManager from './components/InstallmentManager';
import PaymentSummary from './components/PaymentSummary';

export default function Payments() {
  const [activeTab, setActiveTab] = useState<'history' | 'installments' | 'summary'>('summary');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial data jika diperlukan
    // const fetchPaymentSummary = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await fetch('/api/installments/summary/dashboard');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setPaymentData(data.data);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching payment summary:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchPaymentSummary();
  }, []);

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-serif text-primary mb-4">
            Payments & Invoices
          </h1>
          <p className="text-on-surface-variant font-sans tracking-wider text-sm">
            Kelola pembayaran klien dan rencana cicilan dengan mudah
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-12 border-b border-surface-container-low pb-4">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 font-sans text-sm font-medium tracking-wide transition-colors ${
              activeTab === 'summary'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            RINGKASAN
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-sans text-sm font-medium tracking-wide transition-colors ${
              activeTab === 'history'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            RIWAYAT PEMBAYARAN
          </button>
          <button
            onClick={() => setActiveTab('installments')}
            className={`px-6 py-3 font-sans text-sm font-medium tracking-wide transition-colors ${
              activeTab === 'installments'
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            RENCANA CICILAN
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'summary' && <PaymentSummary />}
          {activeTab === 'history' && <PaymentHistory />}
          {activeTab === 'installments' && <InstallmentManager />}
        </div>
      </main>
    </div>
  );
}

