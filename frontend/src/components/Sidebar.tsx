import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Wedding Packages', path: '/admin/packages', icon: 'inventory_2' },
  { name: 'Events & Scheduling', path: '/admin/events', icon: 'event' },
  { name: 'Payments & Invoice', path: '/admin/payments', icon: 'payments' },
  { name: 'Guest Book', path: '/admin/guests', icon: 'book_online' },
  { name: 'Admin Accounts', path: '/admin/clients', icon: 'admin_panel_settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { admin, logout } = useAuth();

  return (
    <div className="w-64 bg-primary-container min-h-screen text-slate-300 p-4.5 flex flex-col shadow-2xl relative z-10">
      {/* Brand Logo */}
      <div className="flex items-center gap-3.5 mb-10 p-2">
        <div className="w-10 h-10 bg-gradient-to-br from-secondary-fixed to-secondary-fixed-dim rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
          <span className="text-primary font-serif font-semibold text-lg">DS</span>
        </div>
        <div>
          <h2 className="text-white font-serif text-lg leading-tight font-semibold tracking-wide">Dream Syariah</h2>
          <p className="text-[10px] text-secondary-fixed-dim uppercase tracking-[0.24em] font-semibold mt-0.5">WEDDING ORGANIZER</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-secondary-fixed text-primary font-semibold shadow-md shadow-black/10'
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${
                isActive ? 'text-primary' : 'text-slate-400 group-hover:text-white group-hover:scale-110'
              }`}>
                {item.icon}
              </span>
              <span className="text-[14px] tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Logout */}
      <div className="border-t border-white/10 pt-5 mt-5">
        <div className="px-4 py-2 mb-3 bg-white/5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-primary font-semibold font-serif text-sm flex items-center justify-center">
            {admin?.name?.substring(0, 1).toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{admin?.name || 'Administrator'}</p>
            <p className="text-xs text-slate-400 truncate">{admin?.email || 'admin@dreamsyariah.id'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3.5 px-4.5 py-3 w-full rounded-2xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-all duration-300 font-medium"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span className="text-[14px] tracking-wide">Logout</span>
        </button>
      </div>
    </div>
  );
}
