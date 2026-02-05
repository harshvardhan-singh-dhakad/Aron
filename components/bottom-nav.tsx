'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Store, User, TrendingUp, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/listings/rent', label: 'Kiraya', icon: TrendingUp },
  { href: '/listings/services', label: 'Services', icon: Wrench },
  { href: '/listings/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/listings/buy-sell', label: 'Buy/Sell', icon: Store },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="mx-auto grid h-full max-w-md grid-cols-5 items-center">
        {navItems.map(item => {
          const isActive =
            (item.href === '/' && pathname === item.href) ||
            (item.href !== '/' && pathname.startsWith(item.href));
            
          const isBuySellActive = item.href.includes('buy-sell') && isActive;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive
                  ? isBuySellActive ? 'text-green-600' : 'text-primary'
                  : 'text-gray-500 hover:text-primary'
              )}
            >
              <item.icon
                className="h-5 w-5"
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span className={cn(isActive && 'font-bold')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
