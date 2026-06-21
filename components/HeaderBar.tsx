'use client';

import { useProduct } from '@/context/ProductContext';
import { Search } from 'lucide-react';

export default function HeaderBar() {
  const { searchQuery, setSearchQuery } = useProduct();

  return (
    <header className="sticky top-0 z-20 rounded-3xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/40 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400/80">Agri Retail</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-50 sm:text-3xl">Inventory Control</h1>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 shadow-inner shadow-slate-950/20">
        <Search className="h-5 w-5 text-emerald-300" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search products across all categories"
          className="w-full bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
        />
      </div>
    </header>
  );
}
