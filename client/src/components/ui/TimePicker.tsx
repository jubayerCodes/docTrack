'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const CLINICAL_TIME_SLOTS = [
  '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

export interface TimePickerProps {
  label?: string;
  value: string;
  onChange: (time: string) => void;
  className?: string;
  required?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  className,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTime.trim()) {
      onChange(customTime.trim());
      setIsOpen(false);
      setShowCustomInput(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="block text-xs font-semibold text-ink mb-1.5">
          {label}
          {required && <span className="text-semantic-danger ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full h-10 rounded-control border border-border bg-surface px-3 text-xs text-left text-ink transition-all duration-150 flex items-center justify-between',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          isOpen && 'border-primary ring-2 ring-primary/20'
        )}
      >
        <span className={cn('truncate', !value && 'text-textSubtle')}>
          {value || 'Select appointment time...'}
        </span>
        <Clock className="w-3.5 h-3.5 text-textMuted flex-shrink-0 ml-2" />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto right-auto sm:right-0 md:left-0 md:right-auto top-[calc(100%+4px)] z-50 w-64 max-w-[calc(100vw-2rem)] max-h-64 overflow-y-auto rounded-control bg-surface border border-border shadow-dropdown p-1.5 animate-in fade-in zoom-in-95 duration-150">
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-textMuted border-b border-border mb-1">
            Standard 30-min Slots
          </p>

          <div className="grid grid-cols-2 gap-1 mb-2">
            {CLINICAL_TIME_SLOTS.map((slot) => {
              const isSelected = slot === value;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    onChange(slot);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left',
                    isSelected
                      ? 'bg-primary-soft text-primary font-bold'
                      : 'text-ink hover:bg-surface-subtle'
                  )}
                >
                  <span>{slot}</span>
                  {isSelected && <Check className="w-3 h-3 text-primary flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Custom Time Dial Option */}
          <div className="pt-1.5 border-t border-border">
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-center py-1 text-[11px] text-primary hover:underline font-semibold"
              >
                + Custom Dial Time
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="flex gap-1.5 p-1">
                <input
                  type="text"
                  placeholder="e.g. 10:15 AM"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="flex-1 h-7 px-2 text-xs border border-border rounded bg-surface focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  type="submit"
                  className="h-7 px-2 bg-primary text-white text-xs rounded font-semibold"
                >
                  Set
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
