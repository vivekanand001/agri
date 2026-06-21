import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agri Inventory Manager',
  description: 'Manage agricultural inventory with MongoDB and Next.js.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
