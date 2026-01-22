
import React from 'react';
import { LayoutDashboard, Stethoscope, Users, Settings, BarChart3, PlusCircle, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
    { icon: PlusCircle, label: 'Nouvelle Ordonnance', path: '/new-prescription' },
    { icon: Calendar, label: 'Rendez-vous', path: '/appointments' },
    { icon: Users, label: 'Patients & Historique', path: '/patients' },
    { icon: BarChart3, label: 'Finances & Analytique', path: '/analytics' },
    { icon: Settings, label: 'Configuration', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col no-print shadow-sm z-30">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-10 h-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 animate-pulse">
          <Stethoscope size={24} />
        </div>
        <div>
          <h1 className="font-extrabold text-gray-900 text-xl tracking-tight leading-tight">DocEase</h1>
          <p className="text-[10px] text-[#10B981] font-bold uppercase tracking-widest">Intelligent Clinic</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-700 font-bold' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-[#10B981]' : 'text-gray-400 group-hover:text-emerald-400'} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t bg-gray-50/50">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Statut Système</div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <span className="text-xs text-gray-800 font-bold block">Base de données</span>
            <span className="text-[10px] text-emerald-600">Locale & Sécurisée</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
