import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({
  quantity,
  onChange,
  max = 99,
  min = 1,
  size = 'md',
  disabled = false
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const btnClasses = isSm
    ? 'w-7 h-7 text-xs'
    : isLg
    ? 'w-10 h-10 text-base'
    : 'w-8 h-8 text-sm';

  const fontClasses = isSm ? 'text-xs min-w-5' : isLg ? 'text-base min-w-8' : 'text-sm min-w-6';

  return (
    <div className="inline-flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
      <button
        type="button"
        disabled={disabled || quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className={`${btnClasses} rounded-lg bg-white flex items-center justify-center text-zinc-700 hover:text-emerald-700 hover:bg-zinc-50 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className={`${fontClasses} font-bold text-center text-zinc-900 select-none`}>
        {quantity}
      </span>

      <button
        type="button"
        disabled={disabled || quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className={`${btnClasses} rounded-lg bg-white flex items-center justify-center text-zinc-700 hover:text-emerald-700 hover:bg-zinc-50 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
