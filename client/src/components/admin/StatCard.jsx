import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'emerald' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
  }[color] || 'bg-zinc-100 text-zinc-700';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorStyles}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-zinc-900 tracking-tight">{value}</div>
      {subtext && <p className="text-xs text-zinc-400 mt-1 font-medium">{subtext}</p>}
    </div>
  );
};
