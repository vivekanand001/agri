'use client';

import React from 'react';
import { Product, useProduct } from '@/context/ProductContext';
import { CheckCircle2, Edit2, Save, Leaf, FlaskConical, Bug } from 'lucide-react';

const iconMap = {
  Seeds: Leaf,
  Fertilizer: FlaskConical,
  Pesticides: Bug,
};

interface CategorySectionProps {
  category: 'Seeds' | 'Fertilizer' | 'Pesticides';
}

interface ProductCardProps {
  product: Product;
  updateProduct: (id: string, data: { price: number; stock: number }) => Promise<void>;
}

export default function CategorySection({ category }: CategorySectionProps) {
  const { products, searchQuery, updateProduct } = useProduct();
  const Icon = iconMap[category];
  const filtered = products.filter((product) => product.category === category && product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/30">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-300/80">{category}</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">{category} Stock</h2>
        </div>
        <div className="rounded-3xl bg-slate-800/90 p-3 text-emerald-300 shadow-inner shadow-slate-950/20">
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-400">
            No items found in this category.
          </div>
        ) : (
          filtered.map((product) => <ProductCard key={product._id} product={product} updateProduct={updateProduct} />)
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, updateProduct }: ProductCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [price, setPrice] = React.useState(product.price.toString());
  const [stock, setStock] = React.useState(product.stock.toString());

  React.useEffect(() => {
    setPrice(product.price.toString());
    setStock(product.stock.toString());
  }, [product.price, product.stock]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-inner shadow-slate-950/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-emerald-300/90">
            <span className="rounded-full bg-emerald-500/10 px-2 py-1">{product.category}</span>
            <span className="text-slate-400">ID {product._id.slice(-6)}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-100">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-400">Manage price and stock directly from inventory.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-100 transition hover:border-emerald-400/70"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Price</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">₹{product.price.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Stock</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{product.stock}</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Last updated</p>
          <p className="mt-2 text-lg font-semibold text-slate-200">{new Date(product.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {isEditing && (
        <div className="mt-5 grid gap-3 rounded-3xl border border-emerald-400/20 bg-slate-900/95 p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              New Price
              <input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block text-sm text-slate-300">
              New Stock
              <input
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                type="number"
                min="0"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
              />
            </label>
          </div>
          <button
            onClick={() => {
              updateProduct(product._id, { price: Number(price), stock: Number(stock) });
              setIsEditing(false);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      )}

      {!isEditing && (
        <div className="mt-5 flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900/95 px-4 py-3 text-sm text-slate-400">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          Tap edit to change price or stock directly.
        </div>
      )}
    </div>
  );
}
