import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agri Inventory Manager',
  description: 'Mobile-first inventory manager for agricultural shop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
