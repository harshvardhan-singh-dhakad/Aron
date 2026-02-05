'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Wrench, User, TrendingUp, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/listings/rent', label: 'Kiraya', icon: TrendingUp },
  { href: '/listings/services', label: 'Services', icon: Wrench },
  { href: '/listings/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/listings/buy-sell', label: 'Buy/Sell', icon: Store },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-col border-r bg-white hidden md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="text-2xl font-bold font-headline text-primary">
          Kaam Kiraya
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(item => {
          const isActive =
            (item.href === '/' && pathname === item.href) ||
            (item.href !== '/' && pathname.startsWith(item.href));

          const isServicesActive = item.href.includes('services') && isActive;
          const isKirayaActive = item.href.includes('rent') && isActive;
          const isJobsActive = item.href.includes('jobs') && isActive;
          const isProfileActive = item.href.includes('profile') && isActive;
          const isBuySellActive = item.href.includes('buy-sell') && isActive;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900',
                isActive ? 'font-bold text-primary bg-primary/10' : 'font-medium',
                isServicesActive && 'text-green-600 bg-green-500/10',
                isKirayaActive && 'text-blue-600 bg-blue-500/10',
                isJobsActive && 'text-purple-600 bg-purple-500/10',
                isProfileActive && 'text-orange-600 bg-orange-500/10',
                isBuySellActive && 'text-teal-600 bg-teal-500/10'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
