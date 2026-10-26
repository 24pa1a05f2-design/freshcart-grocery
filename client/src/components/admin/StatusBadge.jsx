import React from 'react';

export const StatusBadge = ({ status, type = 'order' }) => {
  if (type === 'order') {
    const styles = {
      Pending: 'bg-amber-50 text-amber-700 border-amber-200/80',
      Confirmed: 'bg-blue-50 text-blue-700 border-blue-200/80',
      Preparing: 'bg-purple-50 text-purple-700 border-purple-200/80',
      'Out for Delivery': 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      Cancelled: 'bg-rose-50 text-rose-700 border-rose-200/80',
    }[status] || 'bg-zinc-100 text-zinc-700 border-zinc-200';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80"></span>
        {status}
      </span>
    );
  }

  // Inventory Stock Badge
  const stockStyles = {
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    'Low Stock': 'bg-amber-50 text-amber-700 border-amber-200/80',
    'Out of Stock': 'bg-rose-50 text-rose-700 border-rose-200/80',
  }[status] || 'bg-zinc-100 text-zinc-700 border-zinc-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${stockStyles}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80"></span>
      {status}
    </span>
  );
};
