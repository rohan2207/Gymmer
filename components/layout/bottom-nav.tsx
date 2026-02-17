'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, History, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/', icon: Home, label: 'Today' },
  { href: '/templates', icon: FileText, label: 'Templates' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full',
                'transition-colors touch-manipulation',
                'min-w-[60px]',
                isActive 
                  ? 'text-blue-500' 
                  : 'text-gray-400 hover:text-gray-300'
              )}
            >
              <Icon className="w-6 h-6 mb-0.5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
