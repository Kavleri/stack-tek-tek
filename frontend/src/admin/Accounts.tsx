import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';

interface AdminAccount {
  id: number;
  username: string;
  full_name: string;
  role: 'admin' | 'owner';
  created_at: string;
  updated_at: string;
}

export default function Accounts() {
  const { admin: currentAdmin } = useAuth();
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
  const [targetAccountForReset, setTargetAccountForReset] = useState<AdminAccount | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'admin' as 'admin' | 'owner',
  });

  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const token = localStorage.getItem('token');

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const url = editingAccount
        ? `${API_URL}/api/admins/${editingAccount.id}`
        : `${API_URL}/api/admins`;
      const method = editingAccount ? 'PUT' : 'POST';

      const payload = editingAccount
        ? { full_name: formData.full_name, role: formData.role }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingAccount(null);
        setFormData({
          username: '',
          password: '',
          full_name: '',
          role: 'admin',
        });
        setSuccessMsg(editingAccount ? 'Profil admin berhasil diperbarui.' : 'Akun admin baru berhasil didaftarkan.');
        fetchAccounts();
      } else {
        const err = await response.json();
        setErrorMsg(err.message || 'Gagal memproses data akun.');
      }
    } catch (error) {
      console.error('Failed to save admin account:', error);
      setErrorMsg('Koneksi bermasalah.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!targetAccountForReset) return;

    try {
      const response = await fetch(`${API_URL}/api/admins/${targetAccountForReset.id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        setShowResetModal(false);
        setTargetAccountForReset(null);
        setNewPassword('');
        setSuccessMsg('Password berhasil diatur ulang.');
      } else {
        const err = await response.json();
        setErrorMsg(err.message || 'Gagal menyetel ulang password.');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      setErrorMsg('Koneksi bermasalah.');
    }
  };

  const handleEdit = (acc: AdminAccount) => {
    setEditingAccount(acc);
    setFormData({
      username: acc.username,
      password: '',
      full_name: acc.full_name,
      role: acc.role,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleResetPasswordTrigger = (acc: AdminAccount) => {
    setTargetAccountForReset(acc);
    setNewPassword('');
    setErrorMsg('');
    setShowResetModal(true);
  };

  const handleDelete = async (acc: AdminAccount) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (acc.id === currentAdmin?.id) {
      alert('Anda tidak diperkenankan menghapus akun Anda sendiri yang sedang aktif.');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus akun admin "${acc.full_name}"?`)) {
      try {
        const response = await fetch(`${API_URL}/api/admins/${acc.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setSuccessMsg('Akun admin berhasil dihapus.');
          fetchAccounts();
        } else {
          const err = await response.json();
          setErrorMsg(err.message || 'Gagal menghapus akun.');
        }
      } catch (error) {
        console.error('Failed to delete account:', error);
        setErrorMsg('Koneksi bermasalah.');
      }
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
              Admin <span className="font-normal font-serif">Accounts</span>
            </h1>
            <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">
              Manajemen Hak Akses Internal Staf & Owner
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditingAccount(null);
                setFormData({
                  username: '',
                  password: '',
                  full_name: '',
                  role: 'admin',
                });
                setErrorMsg('');
                setShowModal(true);
              }}
              className="bg-primary text-white px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              Daftarkan Admin Baru
            </button>
          </div>
        </div>

        {/* Feedback Alert Banners */}
        {successMsg && (
          <div className="bg-secondary-container text-on-secondary-fixed-variant p-4 rounded-xl text-xs font-sans font-semibold flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-sm">verified</span>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-error-container/40 text-on-error-container p-4 rounded-xl text-xs font-sans font-semibold flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-sm">error</span>
            {errorMsg}
          </div>
        )}

        {/* Accounts Table (Ghost Table format) */}
        <div className="bg-surface-container-low p-6 rounded-3xl">
          {loading ? (
            <p className="text-sm text-on-surface-variant">Memuat data staf...</p>
          ) : accounts.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">Belum ada akun admin terdaftar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-widest bg-surface-container-high/40">
                    <th className="p-4 rounded-l-xl">Nama Lengkap</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Hak Akses (Role)</th>
                    <th className="p-4">Terdaftar Sejak</th>
                    <th className="p-4 rounded-r-xl text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => {
                    const isSelf = acc.id === currentAdmin?.id;
                    return (
                      <tr
                        key={acc.id}
                        className="hover:bg-surface-container-lowest transition-all duration-200"
                      >
                        <td className="p-4 font-serif font-medium text-primary text-sm flex items-center gap-2">
                          {acc.full_name}
                          {isSelf && (
                            <span className="text-[9px] uppercase tracking-wider bg-secondary-container text-on-secondary-fixed-variant px-2 py-0.5 rounded-full font-sans font-bold">
                              Saya
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-mono text-on-surface-variant font-medium">{acc.username}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${
                            acc.role === 'owner'
                              ? 'bg-primary-container text-on-primary-fixed-variant'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {acc.role}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-on-surface-variant">
                          {new Date(acc.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleResetPasswordTrigger(acc)}
                              className="bg-surface-container-high text-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-secondary-container transition-all"
                            >
                              Reset Sandi
                            </button>
                            <button
                              onClick={() => handleEdit(acc)}
                              className="bg-surface-container-high text-primary p-1.5 rounded-lg hover:bg-secondary-container transition-all"
                              title="Edit Detail"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(acc)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isSelf
                                  ? 'opacity-30 cursor-not-allowed bg-surface-container-high text-on-surface-variant'
                                  : 'bg-error-container/45 text-on-error-container hover:bg-error-container'
                              }`}
                              disabled={isSelf}
                              title={isSelf ? 'Tidak bisa menghapus akun sendiri' : 'Hapus Akun'}
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add / Edit Account */}
        {showModal && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0_12px_40px_rgba(11,37,69,0.06)] border border-outline-variant/15 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-primary mb-6">
                {editingAccount ? 'Ubah Profil Admin' : 'Daftarkan Akun Staf Baru'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Nama Lengkap Staf"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Username untuk masuk"
                    required
                    disabled={!!editingAccount}
                  />
                </div>

                {!editingAccount && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                      placeholder="Masukkan password awal"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Hak Akses (Role)</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                  >
                    <option value="admin">Administrator Staf</option>
                    <option value="owner">Agensi Owner</option>
                  </select>
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
                    Simpan Akun
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Reset Password */}
        {showResetModal && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
            <div className="bg-surface-container-lowest p-8 rounded-[24px] shadow-[0_12px_40px_rgba(11,37,69,0.06)] border border-outline-variant/15 w-full max-w-md">
              <h2 className="text-2xl font-serif text-primary mb-2">Reset Password</h2>
              <p className="text-xs text-on-surface-variant mb-6 font-sans">
                Mengubah sandi untuk staf: <span className="font-semibold text-primary">{targetAccountForReset?.full_name}</span>
              </p>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Password Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface rounded-xl border border-transparent focus:border-primary/20 focus:bg-surface-container-lowest outline-none transition-all duration-300 text-sm font-sans"
                    placeholder="Masukkan password baru"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetModal(false);
                      setTargetAccountForReset(null);
                    }}
                    className="flex-1 bg-surface-container-low text-on-surface-variant py-3 rounded-xl text-xs font-semibold uppercase hover:bg-surface-container-high transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-semibold uppercase hover:opacity-95 transition-all duration-300 shadow-md shadow-primary/10"
                  >
                    Setel Ulang Password
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
