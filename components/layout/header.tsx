'use client';

import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface HeaderProps {
  title: string;
  action?: ReactNode;
  showBack?: boolean;
}

export function Header({ title, action, showBack }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
        </div>
        {action && <div className="flex items-center gap-2 ml-4">{action}</div>}
      </div>
    </header>
  );
}
