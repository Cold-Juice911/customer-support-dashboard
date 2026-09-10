import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = 'secondary', type = 'button', ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          variant === 'primary'
            ? 'bg-accent text-on-accent hover:bg-accent/90'
            : variant === 'secondary'
              ? 'border border-border bg-surface text-primary hover:bg-hover'
              : 'text-secondary hover:bg-hover hover:text-primary',
          className,
        )}
        {...props}
      />
    );
  },
);
