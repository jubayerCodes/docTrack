'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: 'active' | 'scheduled' | 'completed' | 'cancelled' | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const normalized = (status || '').toLowerCase();

  const styles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    active: {
      bg: 'bg-semantic-successBg',
      text: 'text-semantic-success',
      dot: 'bg-semantic-successDot',
      label: 'Active',
    },
    scheduled: {
      bg: 'bg-semantic-infoBg',
      text: 'text-semantic-info',
      dot: 'bg-semantic-info',
      label: 'Scheduled',
    },
    completed: {
      bg: 'bg-purple-50',
      text: 'text-primary',
      dot: 'bg-primary',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-semantic-dangerBg',
      text: 'text-semantic-danger',
      dot: 'bg-semantic-dangerDot',
      label: 'Cancelled',
    },
  };

  const current = styles[normalized] || {
    bg: 'bg-surface-subtle',
    text: 'text-textSecondary',
    dot: 'bg-textMuted',
    label: status,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide',
        current.bg,
        current.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', current.dot)} />
      {current.label}
    </span>
  );
};
