'use client';

import { usePathname } from 'next/navigation';
import BottomNav from '@/components/bottom-nav';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/header';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
            {children}
        </main>
      </div>

      <BottomNav />

      {pathname !== '/post-ad' && (
        <Link
          href="/post-ad"
          className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: 'hsl(var(--accent))' }}
          aria-label="Post a new Ad"
        >
          <Plus className="h-8 w-8" strokeWidth={3} />
        </Link>
      )}
    </div>
  );
}
