import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          {
            'bg-gray-800 text-gray-300': variant === 'default',
            'bg-green-900/50 text-green-400 border border-green-700': variant === 'success',
            'bg-yellow-900/50 text-yellow-400 border border-yellow-700': variant === 'warning',
            'bg-red-900/50 text-red-400 border border-red-700': variant === 'danger',
            'bg-blue-900/50 text-blue-400 border border-blue-700': variant === 'info',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
