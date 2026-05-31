import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Packages', path: '/admin/packages', icon: 'inventory_2' },
  { name: 'Clients', path: '/admin/clients', icon: 'group' },
  { name: 'Events', path: '/admin/events', icon: 'event' },
  { name: 'Bookings', path: '/admin/bookings', icon: 'book_online' },
  { name: 'Payments', path: '/admin/payments', icon: 'payments' },
  { name: 'Guests', path: '/admin/guests', icon: 'people' },
];

export default function Sidebar() {
  const location = useLocation();
  const { admin, logout } = useAuth();

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-slate-300 p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8 p-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
          <span className="text-white font-serif">DS</span>
        </div>
        <div>
          <h2 className="text-white font-serif text-xl">Dream Syariah</h2>
          <p className="text-xs text-slate-500">Wedding Organizer</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 pt-4 mt-4">
        <div className="px-4 py-2 mb-2">
          <p className="text-sm font-medium text-white">{admin?.name}</p>
          <p className="text-xs text-slate-500">{admin?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
