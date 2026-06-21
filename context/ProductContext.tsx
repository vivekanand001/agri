'use client';

import React from 'react';

export interface Product {
  _id: string;
  name: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticides';
  price: number;
  stock: number;
  updatedAt: string;
}

interface ProductContextState {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  createProduct: (data: { name: string; category: string; price: number; stock: number }) => Promise<void>;
  updateProduct: (id: string, data: { price: number; stock: number }) => Promise<void>;
  deductStock: (name: string, quantity: number) => Promise<{ message: string }>;
}

const ProductContext = React.createContext<ProductContextState | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    void fetch('/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const refreshProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const createProduct = async (data: { name: string; category: string; price: number; stock: number }) => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    await refreshProducts();
  };

  const updateProduct = async (id: string, data: { price: number; stock: number }) => {
    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    await refreshProducts();
  };

  const deductStock = async (name: string, quantity: number) => {
    const response = await fetch('/api/deduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, quantity }),
    });
    const result = await response.json();
    await refreshProducts();
    return result;
  };

  return (
    <ProductContext.Provider value={{ products, searchQuery, setSearchQuery, createProduct, updateProduct, deductStock }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = React.useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used inside ProductProvider');
  }

  return context;
}
