import Link from 'next/link';
import { MapPin, Inbox, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 max-w-7xl">
        <div className="md:hidden">
          <Link href="/" className="text-2xl font-bold font-headline text-primary">
            Kaam Kiraya
          </Link>
        </div>
        <div className="hidden md:block flex-1" />
        <div className="flex items-center gap-2">
            <Link href="/inbox" passHref>
              <Button variant="ghost" size="icon" className="relative">
                  <Inbox className="h-5 w-5" />
                  {/* Optional: Add a notification dot */}
                  {/* <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500" /> */}
              </Button>
            </Link>
            <Link href="/profile" passHref>
              <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
              </Button>
            </Link>
        </div>
      </div>
    </header>
  );
}
