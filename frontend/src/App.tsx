import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState, useEffect } from 'react';
import LandingPage from './guest/LandingPage';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import Packages from './admin/Packages';
import Events from './admin/Events';
import Payments from './admin/Payments';
import Guests from './admin/Guests';
import Accounts from './admin/Accounts';
import WorkOrderPrint from './admin/WorkOrderPrint';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function PublicInvitation({ token }: { token: string }) {
  const [guest, setGuest] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const response = await fetch(`${API_URL}/api/guests/token/${token}`);
        if (response.ok) {
          const data = await response.json();
          setGuest(data.guest);
          setEvent(data.event);
          setRsvpStatus(data.guest.status);
        }
      } catch (error) {
        console.error('Failed to fetch guest:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [token]);

  const handleRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/guests/token/${token}/rsvp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: rsvpStatus }),
      });
      setRsvpSubmitted(true);
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <div className="text-center text-white">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!guest || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900 text-white text-center">
        <div>
          <h1 className="text-2xl mb-4">Invitation Not Found</h1>
          <p>The invitation link is invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900 px-6">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40 L40 0 M0 0 L40 40" fill="none" stroke="#B89336" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        
        <div className="bg-slate-50/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-md w-full text-center relative border border-amber-200/20">
          <span className="text-amber-600 text-xs font-bold uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full mb-6 inline-block">
            Walimatul 'Urs
          </span>
          <h2 className="text-3xl font-serif text-blue-900 mb-2">{event.groom_name} & {event.bride_name}</h2>
          <p className="text-sm text-slate-600 font-body mb-8">{new Date(event.event_date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</p>
          
          <div className="bg-blue-50 p-6 rounded-2xl mb-8">
            <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <h3 className="text-xl font-bold text-blue-900 font-body">{guest.name}</h3>
          </div>
          
          <button 
            onClick={() => setIsOpen(true)}
            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">drafts</span>
            Buka Undangan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800 relative font-body">
      <div className="h-2 bg-gradient-to-r from-blue-900 via-amber-600 to-blue-900 w-full"></div>

      <div className="max-w-xl mx-auto px-6 pt-12 space-y-16">
        <section className="text-center space-y-4">
          <span className="text-amber-600 text-sm uppercase tracking-[0.2em] block font-semibold">Walimatul 'Urs</span>
          <h1 className="text-5xl font-serif text-blue-900">{event.groom_name} & {event.bride_name}</h1>
          <p className="text-slate-600 max-w-sm mx-auto text-sm">
            Maha suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
          </p>
          <div className="h-64 rounded-3xl overflow-hidden shadow-xl border border-amber-200/20">
            <img src="/images/invitation-cover.jpg" alt="Wedding" className="w-full h-full object-cover" />
          </div>
        </section>

        <section className="bg-blue-50 p-8 rounded-3xl text-center space-y-4 border border-amber-100">
          <span className="material-symbols-outlined text-4xl text-amber-600">menu_book</span>
          <p className="font-serif italic text-blue-900 leading-relaxed">
            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
          </p>
          <p className="text-xs uppercase tracking-widest text-amber-600 font-bold font-body">QS. Ar-Rum: 21</p>
        </section>

        <section className="bg-blue-900 text-white p-8 rounded-3xl space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="currentColor" />
            </svg>
          </div>
          
          <h2 className="text-3xl text-center text-amber-300 font-serif relative z-10">Agenda Acara</h2>
          
          <div className="grid grid-cols-1 gap-6 relative z-10">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl space-y-2">
              <span className="material-symbols-outlined text-amber-300 text-3xl">favorite</span>
              <h3 className="text-xl font-serif">Akad Nikah</h3>
              <p className="text-sm text-white/80">{new Date(event.event_date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}</p>
              <p className="text-sm text-white/80">{event.location}</p>
            </div>
          </div>
        </section>

        <section id="rsvp" className="bg-blue-50 p-8 rounded-3xl space-y-6 border border-amber-100">
          <h2 className="text-3xl text-center text-blue-900 font-serif">Konfirmasi Kehadiran</h2>
          
          {rsvpSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <span className="material-symbols-outlined text-5xl text-amber-600">check_circle</span>
              <h3 className="text-xl font-bold text-blue-900">Jazakumullah Khairan!</h3>
              <p className="text-sm text-slate-600">Konfirmasi kehadiran Anda telah tersimpan.</p>
            </div>
          ) : (
            <form onSubmit={handleRSVP} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-slate-600 font-bold">Nama Tamu</label>
                <input 
                  type="text" 
                  value={guest.name} 
                  disabled 
                  className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-blue-900/20 opacity-70"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-slate-600 font-bold">Status Kehadiran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setRsvpStatus('Attending')}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all border ${rsvpStatus === 'Attending' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-transparent'}`}
                  >
                    Hadir
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRsvpStatus('Not Attending')}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all border ${rsvpStatus === 'Not Attending' ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-slate-600 border-transparent'}`}
                  >
                    Tidak Hadir
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!rsvpStatus}
                className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
              >
                Kirim Konfirmasi
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/invitation/:token" element={<PublicInvitation token={useParams().token!} />} />
      <Route path="/admin/login" element={<Login />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/packages" 
        element={
          <ProtectedRoute>
            <Packages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/events" 
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/events/:id/work-order" 
        element={
          <ProtectedRoute>
            <WorkOrderPrint />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/payments" 
        element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/guests" 
        element={
          <ProtectedRoute>
            <Guests />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/accounts" 
        element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
