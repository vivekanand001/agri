'use client';

import React from 'react';
import { useProduct } from '@/context/ProductContext';
import { PlusCircle } from 'lucide-react';

export default function AddProductSection() {
  const { createProduct } = useProduct();
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Seeds');
  const [price, setPrice] = React.useState('');
  const [stock, setStock] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/30">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-300/80">Add Product</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">Create new inventory item</h2>
        </div>
        <PlusCircle className="h-6 w-6 text-emerald-300" />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <label className="block text-sm text-slate-300">
          Product Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
            placeholder="Example: Corn Seed"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
          >
            <option>Seeds</option>
            <option>Fertilizer</option>
            <option>Pesticides</option>
          </select>
        </label>

        <label className="block text-sm text-slate-300">
          Price
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
            placeholder="e.g. 45.50"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Initial Stock
          <input
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            type="number"
            min="0"
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
            placeholder="e.g. 120"
          />
        </label>
      </div>

      <button
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await createProduct({ name, category, price: Number(price), stock: Number(stock) });
          setName('');
          setPrice('');
          setStock('');
          setCategory('Seeds');
          setIsLoading(false);
        }}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Saving...' : 'Save Product'}
      </button>
    </section>
  );
}
