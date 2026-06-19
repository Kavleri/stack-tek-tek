import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  notes_for_field_staff: string;
  created_at: string;
}

interface Package {
  id: number;
  package_name: string;
  description: string;
}

export default function WorkOrderPrint() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const foundEvent = (data.events || []).find((e: Event) => e.id === Number(id));
          if (foundEvent) {
            setEvent(foundEvent);
            // Fetch package details
            const pkgResponse = await fetch(`${API_URL}/api/packages/${foundEvent.package_id}`);
            if (pkgResponse.ok) {
              const pkgData = await pkgResponse.json();
              setPkg(pkgData);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load Work Order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token]);

  // Auto trigger print when loading finishes and event is ready
  useEffect(() => {
    if (!loading && event) {
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, event]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
        <div className="text-center">
          <p className="text-sm text-gray-500">Mempersiapkan dokumen instruksi lapangan...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
        <div className="text-center text-red-600 font-semibold">
          <p>Acara tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  // Split package description items for a checklist if description contains commas/new lines
  const checklistItems = pkg?.description 
    ? pkg.description.split(/[,\n.]+/).map(item => item.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 md:p-16 max-w-3xl mx-auto printable-area">
      {/* Editorial Business Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-serif uppercase tracking-wider text-gray-900">Dream Syariah</h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">Wedding Organizer & Concierge</p>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-bold text-gray-800 uppercase tracking-widest">
            Work Order
          </span>
          <p className="text-xs text-gray-500 mt-2 font-mono">{event.invoice_number}</p>
        </div>
      </div>

      {/* Booking Core details */}
      <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Informasi Klien</h3>
          <p className="font-semibold text-base text-gray-900">{event.client_name}</p>
          <p className="text-gray-600 mt-0.5">Kontak: {event.client_phone}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Waktu Pelaksanaan</h3>
          <p className="font-semibold text-gray-900">
            {new Date(event.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-gray-600 mt-0.5">Pukul: {event.event_time.substring(0, 5)} WIB s.d Selesai</p>
        </div>
      </div>

      {/* Location specifics */}
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-8 text-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Lokasi & Venue Acara</h3>
        <p className="font-semibold text-gray-900">{event.location_name}</p>
        <p className="text-gray-600 mt-1 leading-relaxed">{event.location_address || 'Tidak ada alamat lengkap.'}</p>
        {event.google_maps_link && (
          <div className="mt-2 text-xs font-mono text-blue-600 select-all no-print">
            Maps: <a href={event.google_maps_link} target="_blank" rel="noreferrer" className="underline">{event.google_maps_link}</a>
          </div>
        )}
      </div>

      {/* Selected Package Details */}
      <div className="mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Checklist Persiapan Layanan ({event.package_name})</h3>
        
        {checklistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center flex-shrink-0 mt-0.5"></span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Tidak ada rincian item layanan spesifik.</p>
        )}
      </div>

      {/* Field Notes (Notes for Field Staff) */}
      <div className="mb-12">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Catatan Khusus Tim Lapangan</h3>
        <div className="border border-gray-300 p-5 rounded-lg text-sm bg-gray-50/50 leading-relaxed whitespace-pre-line text-gray-800 italic">
          {event.notes_for_field_staff || 'Tidak ada instruksi khusus lapangan.'}
        </div>
      </div>

      {/* Signature blocks for accountability */}
      <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm pt-8 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Penanggung Jawab Acara</p>
          <div className="h-20"></div>
          <p className="font-semibold text-gray-900 border-t border-gray-400 w-48 mx-auto pt-1 font-serif">{event.client_name}</p>
          <p className="text-xs text-gray-500">Klien / Perwakilan</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Penanggung Jawab Lapangan</p>
          <div className="h-20"></div>
          <p className="font-semibold text-gray-900 border-t border-gray-400 w-48 mx-auto pt-1 font-serif">Dream Syariah WO</p>
          <p className="text-xs text-gray-500">Staf Administrasi</p>
        </div>
      </div>

      {/* Print Controls overlay for digital screen viewing */}
      <div className="fixed bottom-6 right-6 no-print flex gap-2">
        <button
          onClick={() => window.print()}
          className="bg-primary text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl hover:opacity-90 active:scale-95 transition-all"
        >
          Cetak Ulang
        </button>
        <button
          onClick={() => window.close()}
          className="bg-gray-100 text-gray-800 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-gray-200 transition-all"
        >
          Tutup Tab
        </button>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .printable-area {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
