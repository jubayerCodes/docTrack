'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-body text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover shadow-primary',
      secondary: 'bg-white text-ink border border-border hover:bg-surface-subtle shadow-sm',
      destructive: 'bg-semantic-dangerBg text-semantic-danger hover:bg-red-100 border border-red-200',
      outline: 'bg-transparent border border-border text-ink hover:bg-surface-subtle',
      ghost: 'bg-transparent text-textSecondary hover:bg-primary-soft hover:text-primary',
      icon: 'bg-white border border-border text-textSecondary hover:text-ink hover:bg-surface-subtle',
    };

    const sizes = {
      sm: 'h-8 px-3 rounded-control text-[11px] gap-1.5',
      md: 'h-10 px-4 rounded-button text-[12px] gap-2',
      lg: 'h-11 px-5 rounded-button text-[13px] gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-control',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
