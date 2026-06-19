import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Package {
  id: number;
  package_name: string;
  price: number;
  description: string;
  is_active: boolean | number;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Form fields state
  const [packageName, setPackageName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token');

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      } else {
        setError('Gagal memuat paket pernikahan.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [token]);

  const openAddModal = () => {
    setPackageName('');
    setPrice('');
    setDescription('');
    setIsActive(true);
    setError('');
    setShowAddModal(true);
  };

  const openEditModal = (pkg: Package) => {
    setSelectedPackage(pkg);
    setPackageName(pkg.package_name);
    setPrice(pkg.price.toString());
    setDescription(pkg.description);
    setIsActive(pkg.is_active === 1 || pkg.is_active === true);
    setError('');
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageName || !price) {
      setError('Nama paket dan harga wajib diisi.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          package_name: packageName,
          price: Number(price),
          description,
          is_active: isActive ? 1 : 0,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        fetchPackages();
      } else {
        const data = await res.json();
        setError(data.message || 'Gagal menyimpan paket baru.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    if (!packageName || !price) {
      setError('Nama paket dan harga wajib diisi.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/packages/${selectedPackage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          package_name: packageName,
          price: Number(price),
          description,
          is_active: isActive ? 1 : 0,
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        fetchPackages();
      } else {
        const data = await res.json();
        setError(data.message || 'Gagal mengubah paket.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket pernikahan ini?')) {
      try {
        const res = await fetch(`${API_URL}/api/packages/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          fetchPackages();
        } else {
          alert('Gagal menghapus paket.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan koneksi server.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-primary tracking-wide">Wedding Packages</h1>
            <p className="text-xs text-on-surface-variant tracking-wider uppercase font-sans mt-2 font-medium">
              Katalog Layanan & CRUD Paket Pernikahan
            </p>
          </div>
          <div>
            <button
              onClick={openAddModal}
              className="bg-primary text-white px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all duration-300 shadow-md shadow-primary/10 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Tambah Paket Baru
            </button>
          </div>
        </div>

        {/* Loading & Error State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm text-on-surface-variant font-medium">Memuat data paket...</p>
          </div>
        ) : error && packages.length === 0 ? (
          <div className="bg-error-container/30 text-on-error-container p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const isPkgActive = pkg.is_active === 1 || pkg.is_active === true;
              return (
                <div
                  key={pkg.id}
                  className="bg-surface-container-lowest p-6 rounded-2xl shadow-ambient-sm relative flex flex-col justify-between transition-all duration-300 hover:shadow-ambient hover:scale-[1.01] border border-outline-variant/10"
                >
                  <div>
                    {/* Card Top Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-secondary text-[24px]">stars</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPkgActive
                            ? 'bg-secondary-container text-on-secondary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {isPkgActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </div>

                    {/* Card Main Info */}
                    <h3 className="text-xl font-serif font-semibold text-primary">{pkg.package_name}</h3>
                    <p className="text-2xl font-serif font-bold text-primary mt-2">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-xs text-on-surface-variant font-sans leading-relaxed mt-4 mb-8">
                      {pkg.description || 'Tidak ada deskripsi layanan.'}
                    </p>
                  </div>

                  {/* Card Actions Row */}
                  <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/10">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="flex-1 bg-surface-container-low text-primary py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-300 text-center"
                    >
                      Edit Detail
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="flex-1 bg-error-container/40 text-on-error-container py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-error/15 transition-all duration-300 text-center"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: Tambah Paket */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-ambient-lg border border-outline-variant/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-primary mb-6">Tambah Paket Pernikahan</h2>
              
              <form onSubmit={handleAddSubmit} className="space-y-5">
                {error && (
                  <div className="bg-error-container/30 text-on-error-container p-3 rounded-xl text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Nama Paket
                  </label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Contoh: Gold Package"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/40 mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Harga Paket (Rp)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="50000000"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/40 mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Deskripsi Layanan
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan detail katering, dekorasi panggung, dokumentasi, dll..."
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/40 mt-1.5 h-32 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 rounded text-secondary focus:ring-secondary/50 border-none bg-surface-container-low cursor-pointer"
                  />
                  <label htmlFor="is_active" className="text-sm text-on-surface font-medium cursor-pointer">
                    Aktifkan Paket Pernikahan (Muncul di Pemesanan)
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-surface-container-low text-on-surface-variant py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all duration-300 shadow-md shadow-primary/10 disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Paket */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 backdrop-blur-sm p-4">
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-ambient-lg border border-outline-variant/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-serif text-primary mb-6">Edit Detail Paket Pernikahan</h2>
              
              <form onSubmit={handleEditSubmit} className="space-y-5">
                {error && (
                  <div className="bg-error-container/30 text-on-error-container p-3 rounded-xl text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Nama Paket
                  </label>
                  <input
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Contoh: Gold Package"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/40 mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Harga Paket (Rp)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="50000000"
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/40 mt-1.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Deskripsi Layanan
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tuliskan detail katering, dekorasi panggung, dokumentasi, dll..."
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3.5 text-sm focus:ring-1 focus:ring-secondary/50 placeholder-on-surface-variant/40 mt-1.5 h-32 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <input
                    id="is_active_edit"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 rounded text-secondary focus:ring-secondary/50 border-none bg-surface-container-low cursor-pointer"
                  />
                  <label htmlFor="is_active_edit" className="text-sm text-on-surface font-medium cursor-pointer">
                    Aktifkan Paket Pernikahan (Muncul di Pemesanan)
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-surface-container-low text-on-surface-variant py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-surface-container-high transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all duration-300 shadow-md shadow-primary/10 disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan'}
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
