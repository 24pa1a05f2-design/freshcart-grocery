import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/products?category=${category.slug || category.name.toLowerCase()}`}
      className="group relative flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white border border-zinc-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-300 text-center"
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-zinc-50 mb-2.5 p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <h4 className="font-semibold text-xs sm:text-sm text-zinc-800 group-hover:text-emerald-700 transition-colors line-clamp-1">
        {category.name}
      </h4>
      <span className="text-[11px] text-zinc-400 mt-0.5">
        {category.productCount ? `${category.productCount} items` : 'Fresh picks'}
      </span>
    </Link>
  );
};
