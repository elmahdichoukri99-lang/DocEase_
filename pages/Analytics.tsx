
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { AppState, PatientCategory } from '../types';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

interface AnalyticsProps {
  state: AppState;
}

const Analytics: React.FC<AnalyticsProps> = ({ state }) => {
  const chartData = state.history.slice(0, 7).reverse().map(record => ({
    name: record.date.split('-').slice(2).join('/'),
    revenue: record.totalRevenue,
    patients: record.patientsCount,
  }));

  const totalRevenueEver = state.history.reduce((acc, curr) => acc + curr.totalRevenue, 0);
  const totalPatientsEver = state.history.reduce((acc, curr) => acc + curr.patientsCount, 0);

  const segmentData = [
    // Use MAN instead of non-existent ADULT category to fix type error
    { name: 'Hommes', value: state.history.reduce((acc, curr) => acc + curr.segments[PatientCategory.MAN], 0), color: '#3B82F6' },
    { name: 'Enfants', value: state.history.reduce((acc, curr) => acc + curr.segments[PatientCategory.CHILD], 0), color: '#10B981' },
    { name: 'Femmes', value: state.history.reduce((acc, curr) => acc + curr.segments[PatientCategory.WOMAN], 0), color: '#EC4899' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Finances & Performances</h2>
        <p className="text-gray-500 font-bold italic">DocEase Financial Insights (DH)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-2xl w-fit mb-4">
            <DollarSign size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CA Total Archivé</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{totalRevenueEver.toLocaleString()} DH</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4">
            <Users size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patients Archivés</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{totalPatientsEver}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-4">
            <Calendar size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Jours en Mémoire</div>
          <div className="text-2xl font-black text-gray-900 mt-1">{state.history.length} Jrs</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl w-fit mb-4">
            <TrendingUp size={24} />
          </div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Panier Moyen</div>
          <div className="text-2xl font-black text-gray-900 mt-1">
            {totalPatientsEver > 0 ? Math.round(totalRevenueEver / totalPatientsEver).toLocaleString() : 0} DH
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <h3 className="text-sm font-black text-gray-900 mb-8 uppercase tracking-widest">Évolution CA (DH)</h3>
          <div className="h-72 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">Données insuffisantes</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30">
          <h3 className="text-sm font-black text-gray-900 mb-8 uppercase tracking-widest">Typologie Consultations</h3>
          <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={segmentData} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontWeight: 900, fontSize: 10}} width={80} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                   {segmentData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
