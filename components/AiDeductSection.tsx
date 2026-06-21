'use client';

import React from 'react';
import { useProduct } from '@/context/ProductContext';
import { Camera, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function AiDeductSection() {
  const { deductStock } = useProduct();
  const [file, setFile] = React.useState<File | null>(null);
  const [message, setMessage] = React.useState('Upload receipt or image to deduct stock');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage('Ready to process. Tap Deduct to parse the bill.');
    setFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage('Please select an image file first.');
      return;
    }

    setIsLoading(true);
    const parseResult = await parseReceiptMock(file);
    const result = await deductStock(parseResult.name, parseResult.quantity);
    setMessage(result.message);
    setIsLoading(false);
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl shadow-slate-950/30">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-emerald-300/80">AI Deduct</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">Receipt scanner + stock deduction</h2>
        </div>
        <Camera className="h-6 w-6 text-emerald-300" />
      </div>

      <label className="group block rounded-3xl border border-dashed border-emerald-500/20 bg-slate-950/80 p-6 text-center transition hover:border-emerald-400/40 hover:bg-slate-900/95">
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <UploadCloud className="mx-auto h-10 w-10 text-emerald-300" />
        <p className="mt-4 text-sm text-slate-400">Tap to take photo of bill / upload receipt</p>
      </label>

      <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
        {message}
      </div>

      <button
        disabled={isLoading}
        onClick={handleSubmit}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Processing...' : 'Deduct Stock'}
      </button>
    </section>
  );
}

async function parseReceiptMock(file: File) {
  const filename = file.name.replace(/\.[^.]+$/, '');
  const match = filename.match(/(.+)[-_ ](\d+)$/);
  if (match) {
    return { name: match[1].replace(/[-_]/g, ' ').trim(), quantity: Number(match[2]) };
  }

  return new Promise((resolve) => setTimeout(() => resolve({ name: 'Corn Seeds', quantity: 5 }), 800));
}
