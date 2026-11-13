'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-ink mb-1.5">
            {label}
            {required && <span className="text-semantic-danger ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 rounded-control border border-border bg-surface px-3 text-xs text-ink placeholder:text-textSubtle transition-all duration-150',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'disabled:bg-surface-subtle disabled:opacity-60',
              leftIcon && 'pl-9',
              error && 'border-semantic-danger focus:border-semantic-danger focus:ring-semantic-danger/20',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-semantic-danger mt-1">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-textMuted mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
