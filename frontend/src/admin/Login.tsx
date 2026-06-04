import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Kredensial login salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Editorial Decorative Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary-fixed/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-tertiary-fixed/40 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative bg-surface-container-lowest/80 backdrop-blur-2xl p-10 rounded-[24px] shadow-[0_12px_40px_rgba(11,37,69,0.04)] border border-outline-variant/10 w-full max-w-[440px] z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-container to-primary rounded-full flex items-center justify-center mb-4 shadow-md">
            <span className="text-secondary-fixed font-serif font-bold text-lg">DS</span>
          </div>
          <h1 className="text-2xl font-serif text-primary tracking-wide">Dream Syariah</h1>
          <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">Concierge Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                placeholder="Masukkan username admin"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
              placeholder="Masukkan password"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-error-container/40 text-on-error-container px-4 py-3 rounded-xl text-xs font-sans font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-container to-primary text-white py-4 rounded-xl font-sans text-sm font-semibold tracking-wide hover:opacity-95 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-primary-container/10"
          >
            {loading ? 'Menghubungkan...' : 'Masuk Ke Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-on-surface-variant bg-surface-container-low/50 py-3 rounded-xl">
          <p className="font-sans">Credentials: <span className="font-semibold text-primary">admin</span> / <span className="font-semibold text-primary">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
