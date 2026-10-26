import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 animate-pulse flex flex-col justify-between">
    <div className="aspect-[4/3] bg-zinc-200 rounded-xl mb-3"></div>
    <div className="space-y-2">
      <div className="h-3 bg-zinc-200 rounded w-1/3"></div>
      <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
      <div className="h-3 bg-zinc-200 rounded w-1/4"></div>
    </div>
    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
      <div className="h-5 bg-zinc-200 rounded w-16"></div>
      <div className="h-8 bg-zinc-200 rounded-xl w-16"></div>
    </div>
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr className="animate-pulse border-b border-zinc-100">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-zinc-200 rounded w-full"></div>
      </td>
    ))}
  </tr>
);
