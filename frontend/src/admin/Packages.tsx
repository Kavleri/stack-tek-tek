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
      </main>
    </div>
  );
}
