import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative inline-flex min-w-0">
      <select
        className={cn(
          'min-h-9 w-full appearance-none rounded-md border border-border bg-surface py-1.5 pl-3 pr-8 text-sm font-medium text-primary transition-colors hover:bg-hover disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary"
      />
    </span>
  );
}
