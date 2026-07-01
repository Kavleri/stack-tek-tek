import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Wedding Packages', path: '/admin/packages', icon: 'inventory_2' },
  { name: 'Events & Scheduling', path: '/admin/events', icon: 'event' },
  { name: 'Payments & Invoice', path: '/admin/payments', icon: 'payments' },
  { name: 'Guest Book', path: '/admin/guests', icon: 'people' },
  { name: 'Admin Accounts', path: '/admin/accounts', icon: 'manage_accounts' },
];

export default function Sidebar() {
  const location = useLocation();
  const { admin, logout } = useAuth();

  return (
    <div className="w-64 bg-primary text-surface-container-highest p-5 flex flex-col min-h-screen relative shadow-2xl">
      {/* Editorial Header */}
      <div className="flex items-center gap-3 mb-10 p-2">
        <div className="w-10 h-10 bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim rounded-full flex items-center justify-center shadow-lg">
          <span className="text-primary font-serif font-semibold text-lg">DS</span>
        </div>
        <div>
          <h2 className="text-white font-serif text-lg tracking-wide leading-tight">Dream Syariah</h2>
          <p className="text-[10px] uppercase tracking-widest text-secondary-fixed">Wedding Organizer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-sans ${isActive
                ? 'bg-gradient-to-r from-secondary/30 to-secondary/10 text-white font-semibold'
                : 'hover:bg-surface-container-high/10 hover:text-white text-surface-variant'
                }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-transform ${isActive ? 'text-secondary-fixed scale-110' : 'text-outline-variant'
                }`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout Section (No 1px line, using background shifts) */}
      <div className="bg-primary-container/40 p-4 rounded-2xl mt-6 space-y-3">
        <div className="px-1">
          <p className="text-xs uppercase tracking-widest text-outline-variant font-semibold">Current User</p>
          <p className="text-sm font-serif text-white mt-1 font-medium truncate">{admin?.full_name}</p>
          <p className="text-[11px] text-secondary-fixed font-sans truncate mt-0.5">{admin?.username}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-xl bg-surface-container-lowest text-primary text-xs font-semibold hover:bg-secondary-container hover:text-primary transition-all duration-300 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Logout Session
        </button>
      </div>
    </div>
  );
}
