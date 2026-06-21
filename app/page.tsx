import AddProductSection from '@/components/AddProductSection';
import AiDeductSection from '@/components/AiDeductSection';
import CategorySection from '@/components/CategorySection';
import HeaderBar from '@/components/HeaderBar';
import { ProductProvider } from '@/context/ProductContext';

export default function Home() {
  return (
    <ProductProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <HeaderBar />
          <main className="mt-4 grid gap-4">
            <CategorySection category="Seeds" />
            <CategorySection category="Fertilizer" />
            <CategorySection category="Pesticides" />
            <AddProductSection />
            <AiDeductSection />
          </main>
        </div>
      </div>
    </ProductProvider>
  );
}
