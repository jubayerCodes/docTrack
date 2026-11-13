'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  label?: string;
  value: Date | string;
  onChange: (date: Date) => void;
  className?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  className,
  required,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState<Date>(selectedDate);

  useEffect(() => {
    if (value) {
      setViewDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

  // Prev month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    days.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth - 1, d),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, i),
    });
  }

  // Next month padding (to reach 35 or 42 cells)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i),
    });
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const today = new Date();

  const formattedDisplay = selectedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {label && (
        <label className="block text-xs font-semibold text-ink mb-1.5">
          {label}
          {required && <span className="text-semantic-danger ml-0.5">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full h-10 rounded-control border border-border bg-surface px-3 text-xs text-left text-ink transition-all duration-150 flex items-center justify-between',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
          isOpen && 'border-primary ring-2 ring-primary/20'
        )}
      >
        <span className="truncate">{formattedDisplay}</span>
        <CalendarIcon className="w-3.5 h-3.5 text-textMuted flex-shrink-0 ml-2" />
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-72 rounded-control bg-surface border border-border shadow-dropdown p-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
            <span className="text-xs font-bold text-ink">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-6 h-6 rounded flex items-center justify-center text-textMuted hover:text-ink hover:bg-surface-subtle transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-6 h-6 rounded flex items-center justify-center text-textMuted hover:text-ink hover:bg-surface-subtle transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-textMuted mb-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((item, idx) => {
              const isSelected = isSameDay(item.date, selectedDate);
              const isToday = isSameDay(item.date, today);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(item.date);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'h-7 rounded text-xs flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-primary text-white font-bold shadow-sm'
                      : item.isCurrentMonth
                      ? 'text-ink hover:bg-surface-subtle'
                      : 'text-textSubtle hover:bg-surface-subtle',
                    isToday && !isSelected && 'border border-primary text-primary font-semibold'
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Quick Select Today */}
          <div className="pt-2 mt-2 border-t border-border flex justify-between items-center text-[11px]">
            <button
              type="button"
              onClick={() => {
                onChange(new Date());
                setIsOpen(false);
              }}
              className="text-primary hover:underline font-semibold"
            >
              Select Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-textMuted hover:text-ink"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
