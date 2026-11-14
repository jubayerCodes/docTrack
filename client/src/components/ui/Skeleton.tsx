'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Primitive Skeleton component with smooth pulse animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-border/70', className)}
      {...props}
    />
  );
};

/**
 * Reusable table skeleton rows matching portal table structures
 */
export interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  hasAvatar?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 6,
  cols = 6,
  hasAvatar = true,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-border/70">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="py-3.5 px-4 sm:px-6">
              {cIdx === 0 && hasAvatar ? (
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-28 max-w-full" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
              ) : cIdx === cols - 1 ? (
                <div className="flex justify-end">
                  <Skeleton className="w-7 h-7 rounded-md" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Skeleton
                    className={cn(
                      'h-3.5',
                      cIdx % 2 === 0 ? 'w-24' : 'w-32',
                      cIdx === 1 && 'w-20 rounded-full h-5'
                    )}
                  />
                  {cIdx === 2 && <Skeleton className="h-2.5 w-16" />}
                </div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

/**
 * Reusable mobile card list skeleton for viewports < 768px
 */
export interface CardListSkeletonProps {
  count?: number;
}

export const CardListSkeleton: React.FC<CardListSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-card bg-surface border border-border shadow-card space-y-3"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="h-4 w-32 max-w-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
            <Skeleton className="w-6 h-6 rounded-md flex-shrink-0" />
          </div>

          {/* Footer info row */}
          <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-control ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Reusable chart skeleton for dashboard bar and area charts
 */
export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64 sm:h-72' }) => {
  return (
    <div className={cn('w-full flex flex-col justify-end gap-3 p-4', height)}>
      <div className="flex items-end justify-between gap-2 h-full pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <Skeleton
              className="w-full max-w-[48px] rounded-t-md"
              style={{ height: `${30 + ((i * 19) % 55)}%` }}
            />
            <Skeleton className="h-2.5 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Reusable donut chart skeleton for dashboard breakdown
 */
export const DonutSkeleton: React.FC = () => {
  return (
    <div className="w-full h-64 sm:h-72 flex flex-col items-center justify-center gap-4">
      <div className="relative w-36 h-36 rounded-full border-8 border-border/70 animate-pulse flex items-center justify-center">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
};
