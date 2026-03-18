import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDashboardStore } from '../store/dashboardStore';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, LogOut, Settings, BarChart2, PieChart, Activity, Globe, Presentation, Languages, LineChart } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { pages } = useDashboardStore();
  const { user, logout } = useAuthStore();

  const overviewPages = pages.filter(p => p.section === 'overview');
  const internalPages = pages.filter(p => p.section === 'internal');
  const externalPages = pages.filter(p => p.section === 'external');

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm border border-indigo-100/50' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
    }`;

  return (
    <div className="w-72 bg-white border-r border-slate-100 h-screen flex flex-col shadow-sm z-10">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-sm">
          <Globe className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">GMPT</h1>
          <p className="text-xs font-medium text-indigo-600 tracking-wide uppercase">Localization</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-8 mt-2">
        {/* Overview Section */}
        {overviewPages.length > 0 && (
          <div>
            <h2 className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">
              <Globe size={14} /> Overview
            </h2>
            <nav className="space-y-1.5">
              {overviewPages.map(page => (
                <NavLink key={page.id} to={`/dashboard/${page.id}`} className={navLinkClass}>
                  <span className="text-sm">{page.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* Internal Section */}
        {(user?.role === 'admin' || user?.role === 'internal') && internalPages.length > 0 && (
          <div>
            <h2 className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">
              <Settings size={14} /> Internal Operations
            </h2>
            <nav className="space-y-1.5">
              {internalPages.map(page => (
                <NavLink key={page.id} to={`/dashboard/${page.id}`} className={navLinkClass}>
                  <span className="text-sm">{page.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* External Section */}
        {(user?.role === 'admin' || user?.role === 'internal' || user?.role === 'external') && externalPages.length > 0 && (
          <div>
            <h2 className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">
              <LineChart size={14} /> Product Insights
            </h2>
            <nav className="space-y-1.5">
              {externalPages.map(page => (
                <NavLink key={page.id} to={`/dashboard/${page.id}`} className={navLinkClass}>
                  <span className="text-sm">{page.title}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={navLinkClass}>
            <Settings size={18} />
            <span className="text-sm">Admin Settings</span>
          </NavLink>
        )}
        <div className="mt-4 flex items-center justify-between px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
            <span className="text-xs font-medium text-slate-500 capitalize">{user?.role}</span>
          </div>
          <button onClick={logout} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-lg hover:bg-rose-50">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
